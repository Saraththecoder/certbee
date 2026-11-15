export type PageRoute =
  | 'home'
  | 'create'
  | 'features'
  | 'how-it-works'
  | 'bulk-certificate-generator'
  | 'certificate-generator-from-excel'
  | 'certificate-generator-from-google-sheets'
  | 'workshop-certificate-generator'
  | 'hackathon-certificate-generator'
  | 'student-certificate-generator'
  | 'about'
  | 'guide'
  | 'blog'
  | 'blog-post'
  | 'contact'
  | 'privacy'
  | 'terms'
  | 'not-found';

export type WorkflowStep = 1 | 2 | 3 | 4;

export type TemplateMimeType =
  | 'image/png'
  | 'image/jpeg'
  | 'image/svg+xml'
  | 'application/pdf';

export interface TemplateAsset {
  id: string;
  name: string;
  dataUrl: string;
  /** Optional rendered PNG preview for non-raster templates like PDF */
  previewDataUrl?: string;
  mimeType: TemplateMimeType;
  fileSize: number;
  widthPx: number;
  heightPx: number;
}
