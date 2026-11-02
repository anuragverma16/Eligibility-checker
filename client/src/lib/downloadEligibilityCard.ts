import type { FormValues, Scheme } from '../data/schemes';
import { type EligibilityStatus } from './eligibility';
import { LOGO_MARK_PATH } from './brand';
import { schemeDetails } from '../data/schemeDetails';

type CardInput = {
  scheme: Scheme;
  values: FormValues;
  status: EligibilityStatus;
  referenceId: string;
  displayName: string;
  organization: string;
  requirement: string;
  today: string;
};

export async function downloadEligibilityCard({ scheme, values, status, referenceId, displayName, organization, requirement, today }: CardInput) {
  const details = schemeDetails[scheme.id];

  try { await (document as Document & { fonts?: FontFaceSet }).fonts?.ready; } catch { /* fonts API unavailable */ }

  const SCALE = 2;
  const W = 900;
  const MAX_H = 2200;
  const CARD_MARGIN = 24;
  const boxX = CARD_MARGIN + 30;
  const boxW = W - boxX * 2 + CARD_MARGIN;
  const pad = 30;

  const work = document.createElement('canvas');
  work.width = W * SCALE;
  work.height = MAX_H * SCALE;
  const ctx = work.getContext('2d');
  if (!ctx) return;
  ctx.scale(SCALE, SCALE);

  const inter = (weight: number, size: number) => `${weight} ${size}px 'Inter', 'Segoe UI', sans-serif`;
  const colors = {
    white: '#ffffff', border: '#e4e9e4', dark: '#15291f',
    body: '#233129', gray: '#7c897f', labelGray: '#8b968e', green: '#2e9651',
  };
  const statusPalette: Record<EligibilityStatus, { bg: string; text: string; border: string }> = {
    Eligible: { bg: '#e6f6ea', text: '#1c7a3f', border: '#bfe6cc' },
    'Under Review': { bg: '#fdf3df', text: '#92620c', border: '#f3dfb0' },
    'Not Eligible': { bg: '#fdeaea', text: '#b3261e', border: '#f3c6c4' },
  };

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, MAX_H);

  const issuedTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  const roundRect = (x: number, y: number, w: number, h: number, r: number, target: CanvasRenderingContext2D = ctx) => {
    target.beginPath();
    target.moveTo(x + r, y);
    target.arcTo(x + w, y, x + w, y + h, r);
    target.arcTo(x + w, y + h, x, y + h, r);
    target.arcTo(x, y + h, x, y, r);
    target.arcTo(x, y, x + w, y, r);
    target.closePath();
  };

  const rightAlign = (value: string, rightEdge: number, yPos: number, font: string, color: string) => {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.fillText(value, rightEdge - ctx.measureText(value).width, yPos);
  };

  const wrapText = (value: string, maxWidth: number, font: string) => {
    ctx.font = font;
    const words = value.split(/\s+/).filter(Boolean);
    if (!words.length) return ['—'];
    const lines: string[] = [];
    let line = words[0];
    for (let i = 1; i < words.length; i++) {
      const test = `${line} ${words[i]}`;
      if (ctx.measureText(test).width > maxWidth) { lines.push(line); line = words[i]; }
      else line = test;
    }
    lines.push(line);
    return lines.slice(0, 4);
  };

  const drawCheckMark = (cx: number, cy: number, size: number, color: string) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(cx - size * 0.5, cy + size * 0.02);
    ctx.lineTo(cx - size * 0.1, cy + size * 0.4);
    ctx.lineTo(cx + size * 0.55, cy - size * 0.35);
    ctx.stroke();
  };

  let y = CARD_MARGIN + pad;

  const monoSize = 46;
  const badgeGradient = ctx.createLinearGradient(boxX, y, boxX + monoSize, y + monoSize);
  badgeGradient.addColorStop(0, details.coverFrom);
  badgeGradient.addColorStop(1, details.coverTo);
  roundRect(boxX, y, monoSize, monoSize, 11);
  ctx.fillStyle = badgeGradient;
  ctx.fill();
  // Grantwise logo mark, drawn from the same path the navbar uses.
  ctx.save();
  ctx.translate(boxX + 7, y + 7);
  ctx.scale(32 / 48, 32 / 48);
  ctx.fillStyle = '#e6b75e';
  ctx.fill(new Path2D(LOGO_MARK_PATH));
  ctx.restore();

  ctx.fillStyle = colors.dark;
  ctx.font = inter(700, 19);
  ctx.fillText(scheme.title, boxX + monoSize + 14, y + 20);
  ctx.fillStyle = colors.gray;
  ctx.font = inter(600, 10.5);
  ctx.fillText(`ELIGIBILITY VERIFICATION · ${details.code}`, boxX + monoSize + 14, y + 36);

  const chipPalette = statusPalette[status];
  ctx.font = inter(700, 11);
  const chipLabel = status.toUpperCase();
  const chipTextW = ctx.measureText(chipLabel).width;
  const chipH = 30;
  const chipW = chipTextW + 40;
  const chipX = boxX + boxW - chipW;
  const chipY = y + monoSize / 2 - chipH / 2;
  roundRect(chipX, chipY, chipW, chipH, chipH / 2);
  ctx.fillStyle = chipPalette.bg;
  ctx.fill();
  ctx.strokeStyle = chipPalette.border;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(chipX + 16, chipY + chipH / 2, 4, 0, Math.PI * 2);
  ctx.fillStyle = chipPalette.text;
  ctx.fill();
  ctx.fillText(chipLabel, chipX + 28, chipY + chipH / 2 + 4);
  y += monoSize + 22;

  ctx.strokeStyle = colors.border;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(boxX, y);
  ctx.lineTo(boxX + boxW, y);
  ctx.stroke();
  y += 14;

  ctx.font = inter(500, 11.5);
  ctx.fillStyle = colors.gray;
  ctx.fillText('Verification ID', boxX, y + 14);
  ctx.font = inter(700, 11.5);
  ctx.fillStyle = colors.body;
  ctx.fillText(referenceId, boxX + ctx.measureText('Verification ID  ').width, y + 14);
  rightAlign(`Generated ${today} · ${issuedTime}`, boxX + boxW, y + 14, inter(500, 11.5), colors.gray);
  y += 34;

  ctx.strokeStyle = colors.border;
  ctx.beginPath();
  ctx.moveTo(boxX, y);
  ctx.lineTo(boxX + boxW, y);
  ctx.stroke();
  y += 26;

  const colDivX = boxX + boxW * 0.58;
  ctx.fillStyle = colors.labelGray;
  ctx.font = inter(700, 9.5);
  ctx.fillText('APPLICANT', boxX, y);
  ctx.fillStyle = colors.body;
  ctx.font = inter(700, 18);
  ctx.fillText(displayName, boxX, y + 26);
  ctx.fillStyle = colors.gray;
  ctx.font = inter(400, 12.5);
  ctx.fillText(organization, boxX, y + 46);
  ctx.fillText(`${values.phone || '—'}  ·  ${values.email || '—'}`, boxX, y + 64);

  ctx.strokeStyle = colors.border;
  ctx.beginPath();
  ctx.moveTo(colDivX, y - 4);
  ctx.lineTo(colDivX, y + 70);
  ctx.stroke();

  const col2X = colDivX + 24;
  ctx.fillStyle = colors.labelGray;
  ctx.font = inter(700, 9.5);
  ctx.fillText('REQUIREMENT', col2X, y);
  ctx.fillStyle = scheme.accent;
  ctx.font = inter(700, 21);
  ctx.fillText(requirement, col2X, y + 28);
  y += 90;

  ctx.strokeStyle = colors.border;
  ctx.beginPath();
  ctx.moveTo(boxX, y);
  ctx.lineTo(boxX + boxW, y);
  ctx.stroke();
  y += 26;

  type DetailRow = { label: string; lines: string[]; block: boolean; height: number };
  const detailFieldEntries = scheme.fields.filter((field) => field.key !== 'organization' && field.key !== 'amount');
  const detailRows: DetailRow[] = detailFieldEntries.map((field) => {
    const raw = values[field.key] || '—';
    if (field.key === 'purpose') {
      const lines = wrapText(raw, boxW, inter(400, 12.5));
      return { label: field.label, lines, block: true, height: 20 + lines.length * 17 + 10 };
    }
    return { label: field.label, lines: [raw], block: false, height: 30 };
  });
  if (values.registration) {
    detailRows.push({ label: 'Registration / ID number', lines: [values.registration], block: false, height: 30 });
  }
  detailRows.push({ label: 'Administered by', lines: wrapText(details.agency, boxW, inter(600, 12.5)), block: false, height: 30 });
  const summaryLines = wrapText(details.summary, boxW, inter(400, 12.5));
  detailRows.push({ label: 'Scheme summary', lines: summaryLines, block: true, height: 20 + summaryLines.length * 17 + 10 });
  const criteriaLines = wrapText(details.eligibility.join('; '), boxW, inter(400, 12.5));
  detailRows.push({ label: 'Eligibility criteria', lines: criteriaLines, block: true, height: 20 + criteriaLines.length * 17 + 10 });
  const documentLines = wrapText(details.documents.join(' · '), boxW, inter(400, 12.5));
  detailRows.push({ label: 'Documents to keep ready', lines: documentLines, block: true, height: 20 + documentLines.length * 17 + 10 });

  ctx.fillStyle = colors.dark;
  ctx.font = inter(700, 12.5);
  ctx.fillText(`${scheme.title.toUpperCase()} DETAILS`, boxX, y);
  y += 18;

  detailRows.forEach((row, i) => {
    if (i > 0) {
      ctx.strokeStyle = '#f0f2ef';
      ctx.beginPath();
      ctx.moveTo(boxX, y);
      ctx.lineTo(boxX + boxW, y);
      ctx.stroke();
    }
    if (row.block) {
      ctx.fillStyle = colors.gray;
      ctx.font = inter(400, 12.5);
      ctx.fillText(row.label, boxX, y + 17);
      ctx.fillStyle = colors.body;
      ctx.font = inter(600, 12.5);
      row.lines.forEach((line, li) => ctx.fillText(line, boxX, y + 17 + 17 + li * 17));
    } else {
      ctx.fillStyle = colors.gray;
      ctx.font = inter(400, 12.5);
      ctx.fillText(row.label, boxX, y + 20);
      const value = row.lines[0];
      rightAlign(value, boxX + boxW, y + 20, inter(600, 12.5), colors.body);
    }
    y += row.height;
  });
  y += 12;

  ctx.strokeStyle = colors.border;
  ctx.beginPath();
  ctx.moveTo(boxX, y);
  ctx.lineTo(boxX + boxW, y);
  ctx.stroke();
  y += 26;

  ctx.fillStyle = colors.dark;
  ctx.font = inter(700, 12.5);
  ctx.fillText('ELIGIBILITY CHECKLIST', boxX, y);
  y += 20;

  scheme.checks.forEach((check) => {
    drawCheckMark(boxX + 7, y + 4, 13, colors.green);
    ctx.fillStyle = colors.body;
    ctx.font = inter(400, 12.5);
    ctx.fillText(check, boxX + 22, y + 9);
    y += 24;
  });
  y += 12;

  ctx.strokeStyle = colors.border;
  ctx.beginPath();
  ctx.moveTo(boxX, y);
  ctx.lineTo(boxX + boxW, y);
  ctx.stroke();
  y += 20;

  const disclaimerLines = wrapText(
    'This is a system-generated eligibility snapshot based on the information you provided and is not an official document issued by any government authority. Subject to final verification by the scheme authority.',
    boxW,
    inter(400, 10.5),
  );
  ctx.fillStyle = colors.gray;
  ctx.font = inter(400, 10.5);
  disclaimerLines.forEach((line, i) => ctx.fillText(line, boxX, y + i * 15));
  y += disclaimerLines.length * 15;

  const finalH = Math.min(MAX_H, Math.ceil(y + CARD_MARGIN + pad));
  const finalCanvas = document.createElement('canvas');
  finalCanvas.width = W * SCALE;
  finalCanvas.height = finalH * SCALE;
  const finalCtx = finalCanvas.getContext('2d');
  if (!finalCtx) return;
  finalCtx.drawImage(work, 0, 0, W * SCALE, finalH * SCALE, 0, 0, W * SCALE, finalH * SCALE);
  finalCtx.scale(SCALE, SCALE);
  finalCtx.strokeStyle = '#dfe7df';
  finalCtx.lineWidth = 1.4;
  roundRect(CARD_MARGIN, CARD_MARGIN, W - CARD_MARGIN * 2, finalH - CARD_MARGIN * 2, 14, finalCtx);
  finalCtx.stroke();

  let blobUrl: string | null = null;
  finalCanvas.toBlob((blob) => {
    if (!blob) {
      window.alert('Sorry, the eligibility image could not be generated. Please try again.');
      return;
    }
    blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `${scheme.id}-eligibility.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(() => { if (blobUrl) URL.revokeObjectURL(blobUrl); }, 4000);
  }, 'image/png');
}
