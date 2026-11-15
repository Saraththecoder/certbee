import { PDFDocument } from 'pdf-lib';
import { describe, expect, it } from 'vitest';
import { TemplateAsset } from '../types/certificate';
import { DynamicField } from '../types/editor';
import { containsComplexScript } from '../utils/coordinateUtils';
import { buildSampleWorkspacePayload } from '../utils/sampleData';
import { prepareBatchPdfContext, renderParticipantPdfBytes } from './pdfService';

async function createSamplePdfTemplateDataUrl(): Promise<string> {
  const doc = await PDFDocument.create();
  doc.addPage([842, 595]);
  const bytes = await doc.save();
  const base64 = Buffer.from(bytes).toString('base64');
  return `data:application/pdf;base64,${base64}`;
}

describe('pdfService vector batch rendering & launch checks', () => {
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

  it('detects Telugu, Hindi, and complex Indic scripts to preserve native shaping', () => {
    expect(containsComplexScript('శరత్ కుమార్')).toBe(true);
    expect(containsComplexScript('आदित्य शर्मा')).toBe(true);
    expect(containsComplexScript('Venkatanarayana Subramanian')).toBe(false);
    expect(containsComplexScript('Aarav Kulkarni')).toBe(false);
  });

  it('provides a complete 5-person sample dataset with template, long name, Hindi, and Telugu', () => {
    const sample = buildSampleWorkspacePayload();
    expect(sample.template.widthPx).toBe(1600);
    expect(sample.template.heightPx).toBe(1130);
    expect(sample.dataset.rows).toHaveLength(5);
    expect(sample.fields.length).toBeGreaterThanOrEqual(3);
    const names = sample.dataset.rows.map((r) => r.values.Name);
    expect(names).toContain('Venkatanarayana Subramanian');
    expect(names).toContain('आदित्य शर्मा');
    expect(names).toContain('శరత్ కుమార్');
  });

  it('renders a 100-name GSA batch including a 42-char long name into valid PDFs quickly', async () => {
    const template: TemplateAsset = {
      id: 'tpl_gsa',
      name: 'GSA_Cohort_Template.pdf',
      dataUrl: await createSamplePdfTemplateDataUrl(),
      mimeType: 'application/pdf',
      fileSize: 2048,
      widthPx: 842,
      heightPx: 595,
    };

    const fields: DynamicField[] = [
      {
        id: 'fld_name',
        key: 'name',
        label: 'Recipient Name',
        sampleFallback: 'Student Name',
        xPct: 16,
        yPct: 40,
        widthPct: 68,
        rotation: 0,
        fontFamily: 'Fraunces',
        fontSizePt: 52,
        fontWeight: 700,
        color: '#161B2E',
        align: 'center',
        letterSpacing: 0,
        opacity: 1,
        autoFit: true,
      },
      {
        id: 'fld_role',
        key: 'role',
        label: 'Role',
        sampleFallback: 'Google Student Ambassador',
        xPct: 22,
        yPct: 55,
        widthPct: 56,
        rotation: 0,
        fontFamily: 'Plus Jakarta Sans',
        fontSizePt: 22,
        fontWeight: 600,
        color: '#D98A00',
        align: 'center',
        letterSpacing: 1,
        opacity: 1,
        autoFit: true,
      },
    ];

    const ctx = await prepareBatchPdfContext(template, fields);
    const mapping = { name: 'Name', email: '', role: 'Role', date: '', signature: '' };

    const rows = Array.from({ length: 100 }, (_, i) => ({
      id: `gsa_${i + 1}`,
      values: {
        Name:
          i === 49
            ? 'Venkatanarayana Subramanian Krishnamurthy'
            : `Campus Ambassador ${i + 1}`,
        Role: 'Google Student Ambassador',
      },
    }));

    const outputs = await Promise.all(
      rows.map((row) => renderParticipantPdfBytes(ctx, fields, row, mapping))
    );

    expect(outputs).toHaveLength(100);
    const longDoc = await PDFDocument.load(outputs[49]);
    expect(longDoc.getTitle()).toBe(
      'Certificate - Venkatanarayana Subramanian Krishnamurthy'
    );
  });
});
