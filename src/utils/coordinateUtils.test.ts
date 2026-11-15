import { describe, expect, it } from 'vitest';
import { DynamicField } from '../types/editor';
import { calculateSnapPosition, getFontCssString, resolveFieldText } from './coordinateUtils';

const BASE_FIELD: DynamicField = {
  id: 'fld_1',
  key: 'name',
  label: 'Full Name',
  sampleFallback: 'Alex Morgan',
  xPct: 20,
  yPct: 45,
  widthPct: 60,
  rotation: 0,
  fontFamily: 'Fraunces',
  fontSizePt: 42,
  fontWeight: 700,
  color: '#18181B',
  align: 'center',
  letterSpacing: 0,
  opacity: 1,
  autoFit: true,
};

describe('resolveFieldText', () => {
  it('resolves mapped participant values, static custom text, and fallbacks', () => {
    const row = {
      id: 'row_1',
      values: { 'Participant Name': 'Jordan Lee', Track: 'AI Systems' },
    };
    const mapping = {
      name: 'Participant Name',
      email: '',
      role: 'Track',
      date: '',
      signature: '',
    };

    expect(resolveFieldText(BASE_FIELD, row, mapping)).toBe('Jordan Lee');
    expect(resolveFieldText({ ...BASE_FIELD, key: 'role' }, row, mapping)).toBe('AI Systems');
    expect(
      resolveFieldText({ ...BASE_FIELD, key: '__custom_text__', sampleFallback: '2026 Cohort' }, row, mapping)
    ).toBe('2026 Cohort');
    expect(resolveFieldText(BASE_FIELD, null, mapping)).toBe('Alex Morgan');
  });
});

describe('getFontCssString', () => {
  it('uses uploaded custom FontFace family when customFontId matches', () => {
    const css = getFontCssString(
      'DM Sans',
      600,
      24,
      [{ id: 'cf_1', name: 'Garamond', familyName: 'CertBeeCustom_cf1', dataUrl: '', fileSize: 100 }],
      'cf_1'
    );
    expect(css).toBe('600 24px "CertBeeCustom_cf1", sans-serif');
  });
});

describe('calculateSnapPosition', () => {
  it('snaps horizontally and vertically to canvas center (50%) when within threshold', () => {
    const snap = calculateSnapPosition(BASE_FIELD, 19.6, 49.4, []);
    expect(snap.xPct).toBe(20);
    expect(snap.yPct).toBe(50);
    expect(snap.snapXGuide).toBe(50);
    expect(snap.snapYGuide).toBe(50);
  });
});
