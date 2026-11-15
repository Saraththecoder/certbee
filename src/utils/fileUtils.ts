import * as pdfjsLib from 'pdfjs-dist';

let pdfWorkerConfigured = false;

function ensurePdfWorker(): void {
  if (pdfWorkerConfigured || typeof window === 'undefined') return;
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
  ).toString();
  pdfWorkerConfigured = true;
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const exp = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, exp);
  return `${value >= 10 || exp === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[exp]}`;
}

export function sanitizeFilename(raw: string, fallback = 'Certificate'): string {
  const cleaned = raw
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s_-]/g, '')
    .trim()
    .replace(/\s+/g, '_');
  return cleaned.length > 0 ? cleaned.slice(0, 80) : fallback;
}

export function dataUrlToUint8Array(dataUrl: string): Uint8Array {
  const commaIdx = dataUrl.indexOf(',');
  const header = commaIdx >= 0 ? dataUrl.slice(0, commaIdx) : '';
  const payload = commaIdx >= 0 ? dataUrl.slice(commaIdx + 1) : dataUrl;

  if (header.includes(';base64')) {
    const binary = atob(payload);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  // Handle non-base64 URL-encoded data URLs (common with inline SVG exports)
  const decoded = decodeURIComponent(payload);
  return new TextEncoder().encode(decoded);
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Could not read file as data URL.'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file from disk.'));
    reader.readAsDataURL(file);
  });
}

export function getImageDimensions(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => reject(new Error('Invalid image file or corrupted image data.'));
    img.src = dataUrl;
  });
}

function parseSvgViewBoxFromDataUrl(dataUrl: string): { width: number; height: number } | null {
  try {
    const bytes = dataUrlToUint8Array(dataUrl);
    const svgText = new TextDecoder().decode(bytes);
    const viewBoxMatch = svgText.match(/viewBox\s*=\s*["']\s*[-\d.]+\s+[-\d.]+\s+([\d.]+)\s+([\d.]+)\s*["']/i);
    if (viewBoxMatch) {
      const w = parseFloat(viewBoxMatch[1]);
      const h = parseFloat(viewBoxMatch[2]);
      if (w > 0 && h > 0) return { width: Math.round(w), height: Math.round(h) };
    }
    const wMatch = svgText.match(/<svg[^>]*\bwidth\s*=\s*["']([\d.]+)(?:px)?["']/i);
    const hMatch = svgText.match(/<svg[^>]*\bheight\s*=\s*["']([\d.]+)(?:px)?["']/i);
    if (wMatch && hMatch) {
      const w = parseFloat(wMatch[1]);
      const h = parseFloat(hMatch[1]);
      if (w > 0 && h > 0) return { width: Math.round(w), height: Math.round(h) };
    }
  } catch {
    // Fallback below
  }
  return null;
}

export async function getSvgDimensions(
  dataUrl: string
): Promise<{ width: number; height: number }> {
  const fromViewBox = parseSvgViewBoxFromDataUrl(dataUrl);
  const fromImg = await getImageDimensions(dataUrl).catch(() => ({ width: 0, height: 0 }));

  const rawWidth = fromImg.width > 0 ? fromImg.width : fromViewBox?.width ?? 1920;
  const rawHeight = fromImg.height > 0 ? fromImg.height : fromViewBox?.height ?? 1080;

  // Scale tiny vector viewBoxes (e.g. 297x210 mm) up proportionally to crisp reference pixels
  if (rawWidth < 800) {
    const ratio = rawHeight / rawWidth;
    const width = 1920;
    return { width, height: Math.round(width * ratio) };
  }
  return { width: rawWidth, height: rawHeight };
}

export async function rasterizeImageToPngBytes(
  dataUrl: string,
  targetWidthPx: number,
  targetHeightPx: number
): Promise<Uint8Array> {
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error('Failed to decode vector or image asset for PDF export.'));
    el.src = dataUrl;
  });

  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(targetWidthPx));
  canvas.height = Math.max(1, Math.round(targetHeightPx));

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not initialize 2D rendering context.');
  }

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => {
      if (b) resolve(b);
      else reject(new Error('Failed to encode rasterized image to PNG.'));
    }, 'image/png');
  });

  return new Uint8Array(await blob.arrayBuffer());
}

export async function renderPdfTemplatePreview(dataUrl: string): Promise<{
  previewDataUrl: string;
  widthPx: number;
  heightPx: number;
}> {
  ensurePdfWorker();
  const pdfBytes = dataUrlToUint8Array(dataUrl);

  const loadingTask = pdfjsLib.getDocument({ data: pdfBytes });
  const pdfDoc = await loadingTask.promise;

  try {
    if (pdfDoc.numPages < 1) {
      throw new Error('The uploaded PDF file contains no pages.');
    }

    const page = await pdfDoc.getPage(1);
    const baseViewport = page.getViewport({ scale: 1 });
    if (baseViewport.width <= 0 || baseViewport.height <= 0) {
      throw new Error('Invalid PDF page dimensions.');
    }

    // Target crisp ~2000px preview width, capped at 3x scale
    const renderScale = Math.min(3, Math.max(1.5, 2000 / baseViewport.width));
    const renderViewport = page.getViewport({ scale: renderScale });

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(renderViewport.width);
    canvas.height = Math.round(renderViewport.height);

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not initialize 2D canvas for PDF preview.');
    }

    await page.render({
      canvasContext: ctx,
      viewport: renderViewport,
      canvas,
    }).promise;

    const previewDataUrl = canvas.toDataURL('image/png');
    return {
      previewDataUrl,
      widthPx: canvas.width,
      heightPx: canvas.height,
    };
  } finally {
    await loadingTask.destroy();
  }
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export function createId(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;
}
