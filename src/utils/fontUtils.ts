import { CustomFontAsset } from '../types/editor';
import { createId, dataUrlToUint8Array, readFileAsDataUrl } from './fileUtils';

const MAX_FONT_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const registeredFamilies = new Set<string>();

export async function registerCustomFontFace(asset: CustomFontAsset): Promise<void> {
  if (typeof document === 'undefined' || typeof FontFace === 'undefined') return;
  if (registeredFamilies.has(asset.familyName)) return;

  try {
    const bytes = dataUrlToUint8Array(asset.dataUrl);
    const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
    const face = new FontFace(asset.familyName, buffer);
    const loaded = await face.load();
    document.fonts.add(loaded);
    registeredFamilies.add(asset.familyName);
  } catch {
    // Skip invalid persisted font cleanly
  }
}

export async function registerAllCustomFonts(assets: CustomFontAsset[]): Promise<void> {
  await Promise.all(assets.map((asset) => registerCustomFontFace(asset)));
}

export async function loadCustomFontFile(file: File): Promise<CustomFontAsset> {
  const lower = file.name.toLowerCase();
  const isTtfOrOtf = lower.endsWith('.ttf') || lower.endsWith('.otf');
  if (!isTtfOrOtf) {
    throw new Error('Please upload a TrueType (.ttf) or OpenType (.otf) font file.');
  }

  if (file.size <= 0 || file.size > MAX_FONT_SIZE_BYTES) {
    throw new Error('Custom font file must be 10 MB or smaller.');
  }

  const dataUrl = await readFileAsDataUrl(file);
  const id = createId('font');
  const familyName = `CertBeeCustom_${id}`;
  const cleanName = file.name.replace(/\.(ttf|otf)$/i, '').replace(/[_-]+/g, ' ').trim() || 'Custom Font';

  if (typeof FontFace !== 'undefined' && typeof document !== 'undefined') {
    const bytes = dataUrlToUint8Array(dataUrl);
    const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
    const face = new FontFace(familyName, buffer);
    let loaded: FontFace;
    try {
      loaded = await face.load();
    } catch {
      throw new Error('Could not parse this font file. Ensure it is a valid .ttf or .otf file.');
    }
    document.fonts.add(loaded);
    registeredFamilies.add(familyName);
  }

  return {
    id,
    name: cleanName,
    familyName,
    dataUrl,
    fileSize: file.size,
  };
}
