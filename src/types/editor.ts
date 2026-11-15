export type FontFamilyOption =
  | 'Fraunces'
  | 'Plus Jakarta Sans'
  | 'DM Sans'
  | 'JetBrains Mono'
  | 'Georgia';

export type TextAlignOption = 'left' | 'center' | 'right';

export interface CustomFontAsset {
  id: string;
  name: string;
  /** Unique CSS FontFace family identifier */
  familyName: string;
  /** Base64 data URL of uploaded .ttf or .otf file */
  dataUrl: string;
  fileSize: number;
}

export interface DynamicField {
  id: string;
  /** Semantic or column key e.g. "name", "role", "date", "email", "signature", or custom column name */
  key: string;
  label: string;
  sampleFallback: string;
  /** Left edge in percentage of canvas width (0-100) */
  xPct: number;
  /** Top edge in percentage of canvas height (0-100) */
  yPct: number;
  /** Box width in percentage of canvas width (5-100) */
  widthPct: number;
  /** Rotation in degrees (-45 to 45) */
  rotation: number;
  fontFamily: FontFamilyOption;
  /** Optional uploaded custom TTF/OTF font asset ID */
  customFontId?: string;
  /** Font size scaled relative to a 1000px-tall reference canvas */
  fontSizePt: number;
  fontWeight: 400 | 500 | 600 | 700;
  color: string;
  align: TextAlignOption;
  /** Letter spacing in em * 100 (e.g. 0 = 0em, 8 = 0.08em) */
  letterSpacing: number;
  /** Opacity from 0.1 to 1 */
  opacity: number;
  /** Automatically shrink font size when text exceeds bounding width */
  autoFit: boolean;
  /** Field kind: 'text' (default) or 'image' (e.g. uploaded signature image) */
  fieldType?: 'text' | 'image';
  /** Base64 data URL for uploaded image fields */
  imageDataUrl?: string;
  /** Natural width / height ratio of uploaded image */
  imageAspectRatio?: number;
}

export interface OverflowWarning {
  fieldId: string;
  fieldLabel: string;
  renderedText: string;
  measuredWidthPx: number;
  boxWidthPx: number;
  fittedFontSizePt: number;
}

export interface GeneratedCert {
  participantId: string;
  participantName: string;
  email: string;
  filename: string;
  blob: Blob;
}

export interface GenerationJobState {
  status: 'idle' | 'running' | 'completed' | 'cancelled' | 'error';
  total: number;
  completed: number;
  failed: number;
  errors: Array<{ participantName: string; reason: string }>;
  results: GeneratedCert[];
  zipBlob: Blob | null;
}
