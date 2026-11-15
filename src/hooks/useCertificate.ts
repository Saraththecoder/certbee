import { useCallback, useState } from 'react';
import { TemplateAsset } from '../types/certificate';
import {
  createId,
  getImageDimensions,
  getSvgDimensions,
  readFileAsDataUrl,
  renderPdfTemplatePreview,
} from '../utils/fileUtils';
import { validateTemplateFile } from '../utils/validation';

export function useCertificate(initialTemplate: TemplateAsset | null = null) {
  const [template, setTemplate] = useState<TemplateAsset | null>(initialTemplate);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadTemplateFile = useCallback(async (file: File): Promise<TemplateAsset | null> => {
    setUploadError(null);
    const check = validateTemplateFile(file);
    if (!check.valid || !check.mimeType) {
      setUploadError(check.error || 'Invalid template file.');
      return null;
    }

    const mimeType = check.mimeType;
    setIsUploading(true);
    setUploadProgress(20);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setUploadProgress(55);

      let widthPx = 1920;
      let heightPx = 1080;
      let previewDataUrl: string | undefined;

      if (mimeType === 'application/pdf') {
        const pdfPreview = await renderPdfTemplatePreview(dataUrl);
        widthPx = pdfPreview.widthPx;
        heightPx = pdfPreview.heightPx;
        previewDataUrl = pdfPreview.previewDataUrl;
      } else if (mimeType === 'image/svg+xml') {
        const svgDims = await getSvgDimensions(dataUrl);
        widthPx = svgDims.width;
        heightPx = svgDims.height;
      } else {
        const imgDims = await getImageDimensions(dataUrl);
        widthPx = imgDims.width;
        heightPx = imgDims.height;
      }

      setUploadProgress(100);

      const asset: TemplateAsset = {
        id: createId('tpl'),
        name: file.name,
        dataUrl,
        previewDataUrl,
        mimeType,
        fileSize: file.size,
        widthPx,
        heightPx,
      };
      setTemplate(asset);
      return asset;
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : 'Unable to process the selected template file.'
      );
      return null;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const clearTemplate = useCallback(() => {
    setTemplate(null);
    setUploadError(null);
    setUploadProgress(0);
  }, []);

  return {
    template,
    setTemplate,
    isUploading,
    uploadProgress,
    uploadError,
    setUploadError,
    uploadTemplateFile,
    clearTemplate,
  };
}
