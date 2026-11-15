import JSZip from 'jszip';
import { GeneratedCert } from '../types/editor';

export interface StreamingZipSession {
  addPdf: (filename: string, pdfBytes: Uint8Array) => void;
  finalize: (onProgress?: (percent: number) => void) => Promise<Blob>;
}

export function createStreamingZipSession(folderName = 'CertBee_Certificates'): StreamingZipSession {
  const zip = new JSZip();
  const folder = zip.folder(folderName);
  if (!folder) {
    throw new Error('Could not initialize ZIP archive folder.');
  }

  return {
    addPdf(filename: string, pdfBytes: Uint8Array) {
      // PDF internal content streams are already Flate-compressed; STORE avoids double compression overhead on large batches.
      folder.file(filename, pdfBytes, { compression: 'STORE' });
    },
    finalize(onProgress?: (percent: number) => void) {
      return zip.generateAsync(
        {
          type: 'blob',
          compression: 'STORE',
        },
        (metadata) => {
          onProgress?.(Math.min(100, Math.round(metadata.percent)));
        }
      );
    },
  };
}

export async function createCertificatesZip(certs: GeneratedCert[]): Promise<Blob> {
  const zip = new JSZip();
  const folder = zip.folder('CertBee_Certificates');
  if (!folder) {
    throw new Error('Could not initialize ZIP archive folder.');
  }

  for (const cert of certs) {
    folder.file(cert.filename, cert.blob, { compression: 'STORE' });
  }

  return zip.generateAsync({
    type: 'blob',
    compression: 'STORE',
  });
}
