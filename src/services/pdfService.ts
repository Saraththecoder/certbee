import fontkit from '@pdf-lib/fontkit';
import { PDFDocument, PDFFont, PDFImage, PDFPage, StandardFonts, degrees, rgb } from 'pdf-lib';
import { TemplateAsset } from '../types/certificate';
import { CustomFontAsset, DynamicField, FontFamilyOption, GeneratedCert } from '../types/editor';
import { ColumnMapping, ParticipantRow } from '../types/participant';
import { getFontCssString, resolveFieldText } from '../utils/coordinateUtils';
import {
  dataUrlToUint8Array,
  rasterizeImageToPngBytes,
  sanitizeFilename,
} from '../utils/fileUtils';

const fontBytesCache = new Map<string, Promise<Uint8Array | null>>();

function getStaticFontPath(
  fontFamily: FontFamilyOption,
  fontWeight: DynamicField['fontWeight']
): string {
  switch (fontFamily) {
    case 'Fraunces':
      return `/fonts/Fraunces-${fontWeight}.ttf`;
    case 'Plus Jakarta Sans':
      return `/fonts/PlusJakartaSans-${fontWeight}.ttf`;
    case 'DM Sans':
      return `/fonts/DMSans-${fontWeight}.ttf`;
    case 'JetBrains Mono':
      return `/fonts/JetBrainsMono-${fontWeight}.ttf`;
    case 'Georgia':
      return `/fonts/Tinos-${fontWeight >= 600 ? 700 : 400}.ttf`;
  }
}

function getStandardFallbackFont(
  fontFamily: FontFamilyOption,
  fontWeight: DynamicField['fontWeight']
): StandardFonts {
  const isBold = fontWeight >= 600;
  if (fontFamily === 'Fraunces' || fontFamily === 'Georgia') {
    return isBold ? StandardFonts.TimesRomanBold : StandardFonts.TimesRoman;
  }
  if (fontFamily === 'JetBrains Mono') {
    return isBold ? StandardFonts.CourierBold : StandardFonts.Courier;
  }
  return isBold ? StandardFonts.HelveticaBold : StandardFonts.Helvetica;
}

function loadStaticFontBytes(
  fontFamily: FontFamilyOption,
  fontWeight: DynamicField['fontWeight']
): Promise<Uint8Array | null> {
  const path = getStaticFontPath(fontFamily, fontWeight);
  const cached = fontBytesCache.get(path);
  if (cached) return cached;

  const promise = (async () => {
    try {
      const response = await fetch(path);
      if (!response.ok) return null;
      const buf = await response.arrayBuffer();
      return new Uint8Array(buf);
    } catch {
      return null;
    }
  })();

  fontBytesCache.set(path, promise);
  return promise;
}

function parseHexRgb(hex: string) {
  const cleaned = hex.replace('#', '').trim();
  const full =
    cleaned.length === 3
      ? cleaned
          .split('')
          .map((c) => c + c)
          .join('')
      : cleaned;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) {
    return rgb(20 / 255, 20 / 255, 20 / 255);
  }
  const num = parseInt(full, 16);
  const r = ((num >> 16) & 255) / 255;
  const g = ((num >> 8) & 255) / 255;
  const b = (num & 255) / 255;
  return rgb(r, g, b);
}

function rotatePointClockwiseAroundCenter(
  ax: number,
  ay: number,
  cx: number,
  cy: number,
  rotationDegClockwise: number
): { x: number; y: number } {
  if (rotationDegClockwise === 0) return { x: ax, y: ay };
  const rad = (-rotationDegClockwise * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const dx = ax - cx;
  const dy = ay - cy;
  return {
    x: cx + dx * cos - dy * sin,
    y: cy + dx * sin + dy * cos,
  };
}

function measureTextWidthPdf(
  font: PDFFont,
  text: string,
  fontSizePt: number,
  letterSpacingPt: number
): number {
  if (!text) return 0;
  const baseWidth = font.widthOfTextAtSize(text, fontSizePt);
  const extra = text.length > 1 ? letterSpacingPt * (text.length - 1) : 0;
  return baseWidth + extra;
}

function wrapTextLinesPdf(
  font: PDFFont,
  text: string,
  maxWidth: number,
  fontSizePt: number,
  letterSpacingPt: number
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (
      !current ||
      measureTextWidthPdf(font, candidate, fontSizePt, letterSpacingPt) <= maxWidth
    ) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines.length > 0 ? lines : [''];
}

function canFontEncodeText(font: PDFFont, text: string): boolean {
  try {
    font.encodeText(text);
    return true;
  } catch {
    return false;
  }
}

async function embedSignatureImage(
  pdfDoc: PDFDocument,
  dataUrl: string
): Promise<PDFImage> {
  const mimeMatch = dataUrl.match(/^data:([^;]+);/i);
  const mime = mimeMatch ? mimeMatch[1].toLowerCase() : 'image/png';

  if (mime === 'image/jpeg' || mime === 'image/jpg') {
    return pdfDoc.embedJpg(dataUrlToUint8Array(dataUrl));
  }
  if (mime === 'image/png') {
    return pdfDoc.embedPng(dataUrlToUint8Array(dataUrl));
  }

  // Convert SVG, WebP, or other browser-decodable signature image into crisp PNG once
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error('Failed to decode signature image for PDF export.'));
    el.src = dataUrl;
  });
  const w = img.naturalWidth > 0 ? Math.min(1600, Math.max(600, img.naturalWidth)) : 900;
  const ratio =
    img.naturalWidth > 0 && img.naturalHeight > 0 ? img.naturalWidth / img.naturalHeight : 2.5;
  const h = Math.max(1, Math.round(w / ratio));
  const pngBytes = await rasterizeImageToPngBytes(dataUrl, w, h);
  return pdfDoc.embedPng(pngBytes);
}

async function renderFallbackTextPng(
  pdfWidth: number,
  pdfHeight: number,
  field: DynamicField,
  text: string,
  customFonts?: CustomFontAsset[]
): Promise<Uint8Array> {
  // High-DPI fallback render only for fields containing glyphs outside embedded TTFs
  const targetWidth = 2400;
  const targetHeight = Math.round(targetWidth * (pdfHeight / pdfWidth));
  const scale = targetHeight / 1000;

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not initialize 2D rendering context.');

  const boxLeftPx = (field.xPct / 100) * targetWidth;
  const boxTopPx = (field.yPct / 100) * targetHeight;
  const boxWidthPx = (field.widthPct / 100) * targetWidth;

  let fontSizePt = field.fontSizePt;
  let fontSizePx = fontSizePt * scale;
  let letterSpacingPx = (field.letterSpacing / 100) * fontSizePx;

  ctx.font = getFontCssString(
    field.fontFamily,
    field.fontWeight,
    fontSizePx,
    customFonts,
    field.customFontId
  );
  const measured =
    ctx.measureText(text).width +
    (text.length > 1 ? letterSpacingPx * (text.length - 1) : 0);

  if (field.autoFit && measured > boxWidthPx + 2 && measured > 0) {
    fontSizePt = Math.max(10, Math.floor(fontSizePt * ((boxWidthPx * 0.96) / measured)));
    fontSizePx = fontSizePt * scale;
    letterSpacingPx = (field.letterSpacing / 100) * fontSizePx;
    ctx.font = getFontCssString(
      field.fontFamily,
      field.fontWeight,
      fontSizePx,
      customFonts,
      field.customFontId
    );
  }

  ctx.save();
  ctx.globalAlpha = field.opacity;
  ctx.fillStyle = field.color;
  ctx.textBaseline = 'top';

  const anchorX =
    field.align === 'center'
      ? boxLeftPx + boxWidthPx / 2
      : field.align === 'right'
      ? boxLeftPx + boxWidthPx
      : boxLeftPx;

  const lineHeight = fontSizePx * 1.2;
  const words = text.split(/\s+/);
  const lines: string[] = [];
  if (field.autoFit) {
    lines.push(text);
  } else {
    let curr = '';
    for (const w of words) {
      const cand = curr ? `${curr} ${w}` : w;
      const candW =
        ctx.measureText(cand).width +
        (cand.length > 1 ? letterSpacingPx * (cand.length - 1) : 0);
      if (!curr || candW <= boxWidthPx) curr = cand;
      else {
        lines.push(curr);
        curr = w;
      }
    }
    if (curr) lines.push(curr);
  }

  if (field.rotation !== 0) {
    const centerX = boxLeftPx + boxWidthPx / 2;
    const centerY = boxTopPx + (lines.length * lineHeight) / 2;
    ctx.translate(centerX, centerY);
    ctx.rotate((field.rotation * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);
  }

  lines.forEach((line, idx) => {
    const y = boxTopPx + idx * lineHeight;
    if (Math.abs(letterSpacingPx) < 0.1 || line.length <= 1) {
      ctx.textAlign = field.align;
      ctx.fillText(line, anchorX, y);
    } else {
      const chars = Array.from(line);
      const widths = chars.map((ch) => ctx.measureText(ch).width);
      const total = widths.reduce((a, b) => a + b, 0) + letterSpacingPx * (chars.length - 1);
      let cx = anchorX;
      if (field.align === 'center') cx = anchorX - total / 2;
      if (field.align === 'right') cx = anchorX - total;
      ctx.textAlign = 'left';
      chars.forEach((ch, ci) => {
        ctx.fillText(ch, cx, y);
        cx += widths[ci] + letterSpacingPx;
      });
    }
  });

  ctx.restore();

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => {
      if (b) resolve(b);
      else reject(new Error('Failed to encode fallback text layer.'));
    }, 'image/png');
  });

  return new Uint8Array(await blob.arrayBuffer());
}

export interface PreparedPdfContext {
  baseDocBytes: Uint8Array;
  pdfWidth: number;
  pdfHeight: number;
  fontDataByKey: Map<string, Uint8Array | null>;
  customFonts: CustomFontAsset[];
}

function getFontKey(field: Pick<DynamicField, 'fontFamily' | 'fontWeight' | 'customFontId'>): string {
  if (field.customFontId) return `custom__${field.customFontId}`;
  return `${field.fontFamily}__${field.fontWeight}`;
}

export async function prepareBatchPdfContext(
  template: TemplateAsset,
  fields: DynamicField[],
  customFonts: CustomFontAsset[] = []
): Promise<PreparedPdfContext> {
  const baseDoc = await PDFDocument.create();
  baseDoc.setCreator('CertBee');
  baseDoc.setProducer('CertBee Vector PDF Engine');

  let pdfWidth = 842;
  let pdfHeight = pdfWidth * (template.heightPx / template.widthPx);
  let basePage: PDFPage;

  if (template.mimeType === 'application/pdf') {
    const srcBytes = dataUrlToUint8Array(template.dataUrl);
    const srcPdf = await PDFDocument.load(srcBytes, { ignoreEncryption: true });
    const [copiedPage] = await baseDoc.copyPages(srcPdf, [0]);
    basePage = baseDoc.addPage(copiedPage);
    const size = basePage.getSize();
    pdfWidth = size.width;
    pdfHeight = size.height;
  } else if (template.mimeType === 'image/svg+xml') {
    basePage = baseDoc.addPage([pdfWidth, pdfHeight]);
    const renderW = Math.min(3508, Math.max(2400, template.widthPx));
    const renderH = Math.round(renderW * (template.heightPx / template.widthPx));
    const pngBytes = await rasterizeImageToPngBytes(template.dataUrl, renderW, renderH);
    const bgImg = await baseDoc.embedPng(pngBytes);
    basePage.drawImage(bgImg, { x: 0, y: 0, width: pdfWidth, height: pdfHeight });
  } else {
    basePage = baseDoc.addPage([pdfWidth, pdfHeight]);
    const bgBytes = dataUrlToUint8Array(template.dataUrl);
    const bgImg =
      template.mimeType === 'image/jpeg'
        ? await baseDoc.embedJpg(bgBytes)
        : await baseDoc.embedPng(bgBytes);
    basePage.drawImage(bgImg, { x: 0, y: 0, width: pdfWidth, height: pdfHeight });
  }

  // Embed and draw static uploaded image fields (e.g. signatures) ONCE on the master template
  const imageFields = fields.filter((f) => f.fieldType === 'image' && Boolean(f.imageDataUrl));
  const embeddedSignatureMap = new Map<string, PDFImage>();

  for (const field of imageFields) {
    const dataUrl = field.imageDataUrl as string;
    let embedded = embeddedSignatureMap.get(dataUrl);
    if (!embedded) {
      embedded = await embedSignatureImage(baseDoc, dataUrl);
      embeddedSignatureMap.set(dataUrl, embedded);
    }

    const boxLeft = (field.xPct / 100) * pdfWidth;
    const boxTopFromTop = (field.yPct / 100) * pdfHeight;
    const boxWidth = (field.widthPct / 100) * pdfWidth;
    const ratio =
      field.imageAspectRatio ||
      (embedded.width > 0 && embedded.height > 0 ? embedded.width / embedded.height : 2.5);
    const boxHeight = boxWidth / ratio;

    const unrotatedBottomLeftX = boxLeft;
    const unrotatedBottomLeftY = pdfHeight - (boxTopFromTop + boxHeight);
    const centerX = boxLeft + boxWidth / 2;
    const centerY = pdfHeight - (boxTopFromTop + boxHeight / 2);

    const pos = rotatePointClockwiseAroundCenter(
      unrotatedBottomLeftX,
      unrotatedBottomLeftY,
      centerX,
      centerY,
      field.rotation
    );

    basePage.drawImage(embedded, {
      x: pos.x,
      y: pos.y,
      width: boxWidth,
      height: boxHeight,
      opacity: field.opacity,
      rotate: field.rotation !== 0 ? degrees(-field.rotation) : undefined,
    });
  }

  const baseDocBytes = await baseDoc.save();

  // Preload static TTF font buffers (and custom uploaded TTF/OTF bytes) once for all text fields
  const textFields = fields.filter((f) => f.fieldType !== 'image');
  const fontDataByKey = new Map<string, Uint8Array | null>();

  await Promise.all(
    textFields.map(async (f) => {
      const key = getFontKey(f);
      if (fontDataByKey.has(key)) return;
      fontDataByKey.set(key, null);

      if (f.customFontId) {
        const custom = customFonts.find((cf) => cf.id === f.customFontId);
        if (custom) {
          fontDataByKey.set(key, dataUrlToUint8Array(custom.dataUrl));
          return;
        }
      }

      const bytes = await loadStaticFontBytes(f.fontFamily, f.fontWeight);
      fontDataByKey.set(key, bytes);
    })
  );

  return {
    baseDocBytes,
    pdfWidth,
    pdfHeight,
    fontDataByKey,
    customFonts,
  };
}

export async function renderParticipantPdfBytes(
  ctx: PreparedPdfContext,
  fields: DynamicField[],
  participant: ParticipantRow,
  mapping: ColumnMapping
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(ctx.baseDocBytes);
  pdfDoc.registerFontkit(fontkit);

  const page = pdfDoc.getPage(0);
  const { pdfWidth, pdfHeight } = ctx;
  const scale = pdfHeight / 1000;

  const embeddedFonts = new Map<string, PDFFont>();
  const textFields = fields.filter((f) => f.fieldType !== 'image');

  for (const field of textFields) {
    const key = getFontKey(field);
    if (!embeddedFonts.has(key)) {
      const ttfBytes = ctx.fontDataByKey.get(key);
      if (ttfBytes) {
        const font = await pdfDoc.embedFont(ttfBytes, { subset: true });
        embeddedFonts.set(key, font);
      } else {
        const stdFont = await pdfDoc.embedFont(
          getStandardFallbackFont(field.fontFamily, field.fontWeight)
        );
        embeddedFonts.set(key, stdFont);
      }
    }
  }

  for (const field of textFields) {
    const text = resolveFieldText(field, participant, mapping);
    if (!text) continue;

    const font = embeddedFonts.get(getFontKey(field))!;
    if (!canFontEncodeText(font, text)) {
      const fallbackPngBytes = await renderFallbackTextPng(
        pdfWidth,
        pdfHeight,
        field,
        text,
        ctx.customFonts
      );
      const fallbackImg = await pdfDoc.embedPng(fallbackPngBytes);
      page.drawImage(fallbackImg, { x: 0, y: 0, width: pdfWidth, height: pdfHeight });
      continue;
    }

    const boxLeft = (field.xPct / 100) * pdfWidth;
    const boxTopFromTop = (field.yPct / 100) * pdfHeight;
    const boxWidth = (field.widthPct / 100) * pdfWidth;

    let effectiveFontSizePt = field.fontSizePt;
    let fontSizePdf = effectiveFontSizePt * scale;
    let letterSpacingPdf = (field.letterSpacing / 100) * fontSizePdf;

    const baseWidth = measureTextWidthPdf(font, text, fontSizePdf, letterSpacingPdf);
    if (field.autoFit && baseWidth > boxWidth + 2 && baseWidth > 0) {
      const ratio = (boxWidth * 0.96) / baseWidth;
      effectiveFontSizePt = Math.max(10, Math.floor(field.fontSizePt * ratio));
      fontSizePdf = effectiveFontSizePt * scale;
      letterSpacingPdf = (field.letterSpacing / 100) * fontSizePdf;
    }

    const lines = field.autoFit
      ? [text]
      : wrapTextLinesPdf(font, text, boxWidth, fontSizePdf, letterSpacingPdf);

    const lineHeight = fontSizePdf * 1.2;
    const ascenderHeight = font.heightAtSize(fontSizePdf, { descender: false });
    const halfLeading = 0.1 * fontSizePdf;

    const centerX = boxLeft + boxWidth / 2;
    const centerY = pdfHeight - (boxTopFromTop + (lines.length * lineHeight) / 2);
    const textColor = parseHexRgb(field.color);
    const rotOpt = field.rotation !== 0 ? degrees(-field.rotation) : undefined;

    for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
      const line = lines[lineIdx];
      if (!line) continue;

      const lineWidth = measureTextWidthPdf(font, line, fontSizePdf, letterSpacingPdf);
      let lineStartX = boxLeft;
      if (field.align === 'center') {
        lineStartX = boxLeft + (boxWidth - lineWidth) / 2;
      } else if (field.align === 'right') {
        lineStartX = boxLeft + (boxWidth - lineWidth);
      }

      const baselineY =
        pdfHeight - (boxTopFromTop + lineIdx * lineHeight + halfLeading + ascenderHeight);

      if (Math.abs(letterSpacingPdf) < 0.05 || line.length <= 1) {
        const pos = rotatePointClockwiseAroundCenter(
          lineStartX,
          baselineY,
          centerX,
          centerY,
          field.rotation
        );
        page.drawText(line, {
          x: pos.x,
          y: pos.y,
          size: fontSizePdf,
          font,
          color: textColor,
          opacity: field.opacity,
          rotate: rotOpt,
        });
      } else {
        let cursorX = lineStartX;
        for (const ch of Array.from(line)) {
          const chWidth = font.widthOfTextAtSize(ch, fontSizePdf);
          const pos = rotatePointClockwiseAroundCenter(
            cursorX,
            baselineY,
            centerX,
            centerY,
            field.rotation
          );
          page.drawText(ch, {
            x: pos.x,
            y: pos.y,
            size: fontSizePdf,
            font,
            color: textColor,
            opacity: field.opacity,
            rotate: rotOpt,
          });
          cursorX += chWidth + letterSpacingPdf;
        }
      }
    }
  }

  const recipientName = mapping.name
    ? participant.values[mapping.name] || 'Participant'
    : 'Participant';
  pdfDoc.setTitle(`Certificate - ${recipientName}`);

  return pdfDoc.save();
}

export async function generateSingleCertificatePdf(
  template: TemplateAsset,
  fields: DynamicField[],
  participant: ParticipantRow,
  mapping: ColumnMapping,
  customFonts: CustomFontAsset[] = []
): Promise<Blob> {
  const ctx = await prepareBatchPdfContext(template, fields, customFonts);
  const pdfBytes = await renderParticipantPdfBytes(ctx, fields, participant, mapping);
  const safeBuffer = pdfBytes.buffer.slice(
    pdfBytes.byteOffset,
    pdfBytes.byteOffset + pdfBytes.byteLength
  ) as ArrayBuffer;
  return new Blob([safeBuffer], { type: 'application/pdf' });
}

export async function generateCertificateBatch(
  template: TemplateAsset,
  fields: DynamicField[],
  rows: ParticipantRow[],
  mapping: ColumnMapping,
  callbacks: {
    onProgress: (completed: number, total: number, result?: GeneratedCert) => void;
    onPdfBytes?: (filename: string, pdfBytes: Uint8Array) => void;
    onError: (participantName: string, reason: string) => void;
    shouldCancel: () => boolean;
  },
  customFonts: CustomFontAsset[] = []
): Promise<GeneratedCert[]> {
  if (typeof document !== 'undefined' && 'fonts' in document) {
    await document.fonts.ready;
  }

  const ctx = await prepareBatchPdfContext(template, fields, customFonts);
  const usedNames = new Map<string, number>();
  const results: GeneratedCert[] = [];

  for (let i = 0; i < rows.length; i++) {
    if (callbacks.shouldCancel()) break;

    const row = rows[i];
    const rawName = (mapping.name ? row.values[mapping.name] : '') || `Participant_${i + 1}`;
    const email = (mapping.email ? row.values[mapping.email] : '') || '';
    const baseFilename = `Certificate_${sanitizeFilename(rawName, `Participant_${i + 1}`)}`;
    const count = usedNames.get(baseFilename) ?? 0;
    usedNames.set(baseFilename, count + 1);
    const filename = count === 0 ? `${baseFilename}.pdf` : `${baseFilename}_${count + 1}.pdf`;

    try {
      const pdfBytes = await renderParticipantPdfBytes(ctx, fields, row, mapping);
      callbacks.onPdfBytes?.(filename, pdfBytes);

      const safeBuffer = pdfBytes.buffer.slice(
        pdfBytes.byteOffset,
        pdfBytes.byteOffset + pdfBytes.byteLength
      ) as ArrayBuffer;
      const blob = new Blob([safeBuffer], { type: 'application/pdf' });

      const cert: GeneratedCert = {
        participantId: row.id,
        participantName: rawName,
        email,
        filename,
        blob,
      };
      results.push(cert);
      callbacks.onProgress(i + 1, rows.length, cert);
    } catch (err) {
      const reason = err instanceof Error ? err.message : 'PDF rendering failed';
      callbacks.onError(rawName, reason);
      callbacks.onProgress(i + 1, rows.length);
    }

    // Yield back to browser event loop between small chunks so progress bar & Cancel stay responsive
    if (i % 3 === 2) {
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }

  return results;
}
