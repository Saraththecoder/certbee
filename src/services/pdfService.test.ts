import { PDFDocument } from 'pdf-lib';
import { describe, expect, it } from 'vitest';
import { TemplateAsset } from '../types/certificate';
import { DynamicField } from '../types/editor';
import { prepareBatchPdfContext, renderParticipantPdfBytes } from './pdfService';

async function createSamplePdfTemplateDataUrl(): Promise<string> {
  const doc = await PDFDocument.create();
  doc.addPage([842, 595]);
  const bytes = await doc.save();
  const base64 = Buffer.from(bytes).toString('base64');
  return `data:application/pdf;base64,${base64}`;
}

describe('pdfService vector batch rendering', () => {
  it('caches base PDF template and renders valid personalized PDF bytes with title metadata', async () => {
    const template: TemplateAsset = {
      id: 'tpl_test',
      name: 'VectorCert.pdf',
      dataUrl: await createSamplePdfTemplateDataUrl(),
      mimeType: 'application/pdf',
      fileSize: 1024,
      widthPx: 842,
      heightPx: 595,
    };

    const fields: DynamicField[] = [
      {
        id: 'fld_name',
        key: 'name',
        label: 'Recipient Name',
        sampleFallback: 'Sample Name',
        xPct: 15,
        yPct: 45,
        widthPct: 70,
        rotation: 0,
        fontFamily: 'Fraunces',
        fontSizePt: 40,
        fontWeight: 700,
        color: '#141414',
        align: 'center',
        letterSpacing: 2,
        opacity: 1,
        autoFit: true,
      },
    ];

    const ctx = await prepareBatchPdfContext(template, fields);
    expect(ctx.pdfWidth).toBe(842);
    expect(ctx.pdfHeight).toBe(595);

    const outBytes = await renderParticipantPdfBytes(
      ctx,
      fields,
      { id: 'row_1', values: { Name: 'Aarav Kulkarni' } },
      { name: 'Name', email: '', role: '', date: '', signature: '' }
    );

    const header = new TextDecoder().decode(outBytes.slice(0, 5));
    expect(header).toBe('%PDF-');

    const loaded = await PDFDocument.load(outBytes);
    expect(loaded.getPageCount()).toBe(1);
    expect(loaded.getTitle()).toBe('Certificate - Aarav Kulkarni');
  });
});
