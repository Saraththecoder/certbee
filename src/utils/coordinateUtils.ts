import { CustomFontAsset, DynamicField, OverflowWarning } from '../types/editor';
import { ColumnMapping, ParticipantRow } from '../types/participant';

export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

export function resolveFieldText(
  field: DynamicField,
  participant: ParticipantRow | null,
  mapping: ColumnMapping
): string {
  if (!participant) {
    return field.sampleFallback || `{{${field.key}}}`;
  }

  // Static custom text field
  if (field.key === '__custom_text__') {
    return field.sampleFallback;
  }

  // Direct mapped semantic column
  const mappedColumn =
    field.key in mapping ? mapping[field.key as keyof ColumnMapping] : undefined;

  if (mappedColumn && participant.values[mappedColumn] !== undefined) {
    const val = participant.values[mappedColumn]?.trim();
    return val || field.sampleFallback || '';
  }

  // Direct column header match
  if (participant.values[field.key] !== undefined) {
    const val = participant.values[field.key]?.trim();
    return val || field.sampleFallback || '';
  }

  // Case-insensitive match
  const matchedKey = Object.keys(participant.values).find(
    (k) => k.toLowerCase() === field.key.toLowerCase()
  );
  if (matchedKey) {
    const val = participant.values[matchedKey]?.trim();
    return val || field.sampleFallback || '';
  }

  return field.sampleFallback || `{{${field.key}}}`;
}

export function getFontFamilyCss(
  fontFamily: DynamicField['fontFamily'],
  customFonts?: CustomFontAsset[],
  customFontId?: string
): string {
  if (customFontId && customFonts && customFonts.length > 0) {
    const custom = customFonts.find((f) => f.id === customFontId);
    if (custom) {
      return `"${custom.familyName}", sans-serif`;
    }
  }

  const familyMap: Record<DynamicField['fontFamily'], string> = {
    Fraunces: '"Fraunces", Georgia, serif',
    'Plus Jakarta Sans': '"Plus Jakarta Sans", sans-serif',
    'DM Sans': '"DM Sans", sans-serif',
    'JetBrains Mono': '"JetBrains Mono", monospace',
    Georgia: 'Georgia, "Times New Roman", serif',
  };
  return familyMap[fontFamily];
}

export function getFontCssString(
  fontFamily: DynamicField['fontFamily'],
  fontWeight: number,
  fontSizePx: number,
  customFonts?: CustomFontAsset[],
  customFontId?: string
): string {
  const familyCss = getFontFamilyCss(fontFamily, customFonts, customFontId);
  return `${fontWeight} ${fontSizePx}px ${familyCss}`;
}

let measureCanvas: HTMLCanvasElement | null = null;

function getMeasureContext(): CanvasRenderingContext2D | null {
  if (typeof document === 'undefined') return null;
  if (!measureCanvas) {
    measureCanvas = document.createElement('canvas');
  }
  return measureCanvas.getContext('2d');
}

export function measureAndFitField(
  field: DynamicField,
  text: string,
  canvasWidthPx: number,
  canvasHeightPx: number,
  customFonts?: CustomFontAsset[]
): {
  overflows: boolean;
  measuredWidthPx: number;
  boxWidthPx: number;
  effectiveFontSizePt: number;
  warning: OverflowWarning | null;
} {
  const scale = canvasHeightPx / 1000;
  const baseFontSizePx = field.fontSizePt * scale;
  const boxWidthPx = (field.widthPct / 100) * canvasWidthPx;

  if (field.fieldType === 'image' && field.imageDataUrl) {
    return {
      overflows: false,
      measuredWidthPx: boxWidthPx,
      boxWidthPx,
      effectiveFontSizePt: field.fontSizePt,
      warning: null,
    };
  }

  const ctx = getMeasureContext();

  if (!ctx || !text) {
    return {
      overflows: false,
      measuredWidthPx: 0,
      boxWidthPx,
      effectiveFontSizePt: field.fontSizePt,
      warning: null,
    };
  }

  const measureWithSize = (sizePx: number): number => {
    ctx.font = getFontCssString(
      field.fontFamily,
      field.fontWeight,
      sizePx,
      customFonts,
      field.customFontId
    );
    const metrics = ctx.measureText(text);
    const extraSpacing =
      text.length > 1 ? (field.letterSpacing / 100) * sizePx * (text.length - 1) : 0;
    return metrics.width + extraSpacing;
  };

  const baseWidth = measureWithSize(baseFontSizePx);
  const overflows = baseWidth > boxWidthPx + 2;

  let effectiveFontSizePt = field.fontSizePt;
  if (overflows && field.autoFit && baseWidth > 0) {
    const ratio = (boxWidthPx * 0.96) / baseWidth;
    effectiveFontSizePt = Math.max(10, Math.floor(field.fontSizePt * ratio));
  }

  const warning: OverflowWarning | null = overflows
    ? {
        fieldId: field.id,
        fieldLabel: field.label,
        renderedText: text,
        measuredWidthPx: Math.round(baseWidth),
        boxWidthPx: Math.round(boxWidthPx),
        fittedFontSizePt: effectiveFontSizePt,
      }
    : null;

  return {
    overflows,
    measuredWidthPx: baseWidth,
    boxWidthPx,
    effectiveFontSizePt,
    warning,
  };
}

export interface SnapResult {
  xPct: number;
  yPct: number;
  snapXGuide: number | null;
  snapYGuide: number | null;
}

export function calculateSnapPosition(
  activeField: DynamicField,
  proposedXPct: number,
  proposedYPct: number,
  otherFields: DynamicField[]
): SnapResult {
  const threshold = 1.1;
  let xPct = clamp(proposedXPct, 0, Math.max(0, 100 - activeField.widthPct));
  let yPct = clamp(proposedYPct, 0, 96);
  let snapXGuide: number | null = null;
  let snapYGuide: number | null = null;

  const boxCenterX = xPct + activeField.widthPct / 2;

  // Snap box center to canvas center (50%)
  if (Math.abs(boxCenterX - 50) < threshold) {
    xPct = 50 - activeField.widthPct / 2;
    snapXGuide = 50;
  }

  // Snap vertical position to canvas center (50%)
  if (Math.abs(yPct - 50) < threshold) {
    yPct = 50;
    snapYGuide = 50;
  }

  // Snap left or center to other fields
  for (const other of otherFields) {
    if (other.id === activeField.id) continue;
    const otherCenterX = other.xPct + other.widthPct / 2;

    if (snapXGuide === null && Math.abs(boxCenterX - otherCenterX) < threshold) {
      xPct = clamp(otherCenterX - activeField.widthPct / 2, 0, 100 - activeField.widthPct);
      snapXGuide = otherCenterX;
    } else if (snapXGuide === null && Math.abs(xPct - other.xPct) < threshold) {
      xPct = other.xPct;
      snapXGuide = other.xPct;
    }

    if (snapYGuide === null && Math.abs(yPct - other.yPct) < threshold) {
      yPct = other.yPct;
      snapYGuide = other.yPct;
    }
  }

  return { xPct, yPct, snapXGuide, snapYGuide };
}
