import { TemplateAsset } from '../types/certificate';
import { DynamicField } from '../types/editor';
import { ParticipantDataset } from '../types/participant';
import { createId } from './fileUtils';

const SAMPLE_CERT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1130" viewBox="0 0 1600 1130" fill="none">
  <rect width="1600" height="1130" fill="#FFFDF7"/>
  <rect x="44" y="44" width="1512" height="1042" stroke="#D98A00" stroke-opacity="0.55" stroke-width="3"/>
  <rect x="58" y="58" width="1484" height="1014" stroke="#161B2E" stroke-opacity="0.14" stroke-width="1.5"/>
  <polygon points="0,0 320,0 0,260" fill="#161B2E"/>
  <line x1="0" y1="320" x2="380" y2="0" stroke="#D98A00" stroke-width="5"/>
  <polygon points="1600,0 1360,0 1600,192" fill="#FFF4CC"/>
  <line x1="1300" y1="0" x2="1600" y2="240" stroke="#D98A00" stroke-width="4"/>
  <polygon points="0,1130 240,1130 0,938" fill="#FFF4CC"/>
  <line x1="0" y1="890" x2="300" y2="1130" stroke="#D98A00" stroke-width="4"/>
  <polygon points="1600,1130 1280,1130 1600,870" fill="#161B2E"/>
  <line x1="1220" y1="1130" x2="1600" y2="810" stroke="#D98A00" stroke-width="5"/>
  <text x="800" y="210" text-anchor="middle" fill="#161B2E" font-family="Georgia, serif" font-size="68" font-weight="700" letter-spacing="8">CERTIFICATE</text>
  <text x="800" y="268" text-anchor="middle" fill="#4A5268" font-family="sans-serif" font-size="24" font-weight="600" letter-spacing="10">OF APPRECIATION</text>
  <line x1="380" y1="258" x2="540" y2="258" stroke="#D98A00" stroke-width="2.5"/>
  <line x1="1060" y1="258" x2="1220" y2="258" stroke="#D98A00" stroke-width="2.5"/>
  <text x="800" y="368" text-anchor="middle" fill="#4A5268" font-family="Georgia, serif" font-style="italic" font-size="28">This certificate is proudly presented to</text>
  <line x1="360" y1="560" x2="1240" y2="560" stroke="#D98A00" stroke-width="2.5"/>
  <text x="800" y="704" text-anchor="middle" fill="#4A5268" font-family="Georgia, serif" font-style="italic" font-size="24">for active contribution during Campus Hackathon 2026.</text>
  <circle cx="800" cy="885" r="52" fill="#F6C23E" stroke="#D98A00" stroke-width="4"/>
  <polygon points="800,852 809,872 831,875 815,890 819,912 800,901 781,912 785,890 769,875 791,872" fill="#FFFDF7"/>
  <line x1="220" y1="905" x2="520" y2="905" stroke="#9CA3AF" stroke-width="2"/>
  <text x="370" y="942" text-anchor="middle" fill="#4A5268" font-family="sans-serif" font-size="20" font-weight="600">Date</text>
  <line x1="1080" y1="905" x2="1380" y2="905" stroke="#9CA3AF" stroke-width="2"/>
  <text x="1230" y="882" text-anchor="middle" fill="#161B2E" font-family="Georgia, serif" font-style="italic" font-size="26">Student Lead</text>
  <text x="1230" y="942" text-anchor="middle" fill="#4A5268" font-family="sans-serif" font-size="20" font-weight="600">Organizer</text>
</svg>`;

export function buildSampleWorkspacePayload(): {
  template: TemplateAsset;
  dataset: ParticipantDataset;
  fields: DynamicField[];
} {
  const todayLabel = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(SAMPLE_CERT_SVG)}`;

  const template: TemplateAsset = {
    id: createId('tpl_sample'),
    name: 'Campus_Hackathon_Sample.svg',
    dataUrl,
    mimeType: 'image/svg+xml',
    fileSize: SAMPLE_CERT_SVG.length,
    widthPx: 1600,
    heightPx: 1130,
  };

  const sampleNames = [
    { name: 'Aarav Kulkarni', role: 'Winner · Cloud Track', email: 'aarav@campus.edu' },
    { name: 'Venkatanarayana Subramanian', role: 'Student Organizer', email: 'venkat@club.org' },
    { name: 'Ananya Deshmukh', role: 'Workshop Mentor', email: 'ananya@devclub.in' },
    { name: 'आदित्य शर्मा', role: 'Keynote Speaker', email: 'aditya@campus.edu' },
    { name: 'శరత్ కుమార్', role: 'Student Ambassador', email: 'sarath@campus.edu' },
  ];

  const dataset: ParticipantDataset = {
    source: 'csv',
    sourceLabel: 'sample_participants.csv',
    headers: ['Name', 'Role', 'Date', 'Email'],
    mapping: {
      name: 'Name',
      role: 'Role',
      date: 'Date',
      email: 'Email',
      signature: '',
    },
    rows: sampleNames.map((item, idx) => ({
      id: createId(`row_${idx}`),
      values: {
        Name: item.name,
        Role: item.role,
        Date: todayLabel,
        Email: item.email,
      },
    })),
    issues: [],
  };

  const fields: DynamicField[] = [
    {
      id: createId('fld_name'),
      key: 'name',
      label: 'Participant Name',
      sampleFallback: 'Aarav Kulkarni',
      xPct: 16,
      yPct: 40,
      widthPct: 68,
      rotation: 0,
      fontFamily: 'Fraunces',
      fontSizePt: 58,
      fontWeight: 700,
      color: '#161B2E',
      align: 'center',
      letterSpacing: 0,
      opacity: 1,
      autoFit: true,
    },
    {
      id: createId('fld_role'),
      key: 'role',
      label: 'Role / Award',
      sampleFallback: 'Winner · Cloud Track',
      xPct: 22,
      yPct: 53,
      widthPct: 56,
      rotation: 0,
      fontFamily: 'Plus Jakarta Sans',
      fontSizePt: 26,
      fontWeight: 700,
      color: '#D98A00',
      align: 'center',
      letterSpacing: 2,
      opacity: 1,
      autoFit: true,
    },
    {
      id: createId('fld_date'),
      key: 'date',
      label: 'Issue Date',
      sampleFallback: todayLabel,
      xPct: 11,
      yPct: 75.5,
      widthPct: 24,
      rotation: 0,
      fontFamily: 'DM Sans',
      fontSizePt: 20,
      fontWeight: 600,
      color: '#161B2E',
      align: 'center',
      letterSpacing: 0,
      opacity: 1,
      autoFit: true,
    },
  ];

  return { template, dataset, fields };
}
