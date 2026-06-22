import nodemailer from 'nodemailer';

async function saveToNotion(name, email, profileName) {
  const token = process.env.NOTION_TOKEN;
  if (!token) return;
  const DB_ID = process.env.NOTION_DB_TALENT_ID || '9f709fada2b144a58322beaee4cf6dda';
  await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'Notion-Version': '2022-06-28' },
    body: JSON.stringify({
      parent: { database_id: DB_ID },
      properties: {
        '姓名': { title: [{ text: { content: name } }] },
        'Email': { email },
        '時間': { date: { start: new Date().toISOString() } },
        '報告摘要': { rich_text: [{ text: { content: profileName } }] },
      },
    }),
  });
}

function buildReportHtml(data) {
  const { name, profileName, profileEn, profileIcon, profileColor, profileColorBg, profileColorBorder,
    profileTagline, energy, D, B, T, S, desc, strengths, weaknesses, strategy, famous, careers, business, bestPartners } = data;

  const BG = '#0d0d1a';
  const SURFACE = '#14142a';
  const SURFACE2 = '#1c1c38';
  const FIRE = '#f97316';
  const TEXT = '#f0f0ff';
  const DIM = '#6868a0';
  const BORDER = '#252548';
  const DYNAMO_C = '#f59e0b';
  const BLAZE_C = '#ef4444';
  const TEMPO_C = '#22c55e';
  const STEEL_C = '#3b82f6';

  const pc = profileColor || FIRE;
  const pcBg = profileColorBg || 'rgba(249,115,22,0.08)';
  const pcBorder = profileColorBorder || 'rgba(249,115,22,0.3)';

  const total = ((D||0) + (B||0) + (T||0) + (S||0)) || 1;
  const pct = (v) => Math.round((v||0) / total * 100);

  const energyBar = (label, val, color) => `
    <tr>
      <td style="padding:6px 0;color:${DIM};font-size:13px;width:110px;">${label}</td>
      <td style="padding:6px 0;">
        <table width="100%" cellpadding="0" cellspacing="0"><tr>
          <td style="background:${BORDER};border-radius:99px;overflow:hidden;height:8px;">
            <div style="width:${pct(val)}%;height:8px;background:${color};border-radius:99px;"></div>
          </td>
          <td style="width:36px;text-align:right;font-size:13px;font-weight:700;color:${color};padding-left:8px;">${val||0}</td>
        </tr></table>
      </td>
    </tr>`;

  const section = (title, content) => `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
      <tr><td style="background:${SURFACE};border-radius:12px;padding:20px 24px;">
        <div style="color:${pc};font-size:12px;font-weight:700;letter-spacing:2px;margin-bottom:14px;">${title}</div>
        ${content}
      </td></tr>
    </table>`;

  const tags = (arr, color) => (arr||[]).map(t =>
    `<span style="display:inline-block;margin:3px;padding:4px 12px;border-radius:99px;font-size:12px;background:rgba(255,255,255,0.05);border:1px solid ${color}44;color:${color};">${t}</span>`
  ).join('');

  const listItems = (arr) => (arr||[]).map(item =>
    `<div style="padding:5px 0;border-bottom:1px solid ${BORDER};font-size:13px;color:#c0c0e0;display:flex;align-items:center;gap:8px;">
      <span style="color:${pc};font-size:11px;">▸</span>${item}
    </div>`
  ).join('');

  const date = new Date().toLocaleDateString('zh-TW', { timeZone: 'Asia/Taipei' });

  const partnerNames = { creator:'創作者', star:'明星', supporter:'支持者', dealmaker:'媒合者', trader:'商人', accumulator:'積蓄者', lord:'地主', mechanic:'技師' };
  const partnerIcons = { creator:'💡', star:'⭐', supporter:'🤝', dealmaker:'🎯', trader:'⚖️', accumulator:'🌱', lord:'🏰', mechanic:'⚙️' };

  return `<!DOCTYPE html>
<html lang="zh-TW"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0f0f8;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f0f8;">
<tr><td align="center" style="padding:24px 12px;">
<table width="640" cellpadding="0" cellspacing="0" style="max-width:640px;background:${BG};border-radius:16px;overflow:hidden;">

  <!-- Header -->
  <tr><td style="background:linear-gradient(135deg,${BG},${SURFACE});padding:40px 32px;text-align:center;border-bottom:1px solid ${BORDER};">
    <div style="font-size:42px;margin-bottom:8px;">🔥</div>
    <h1 style="color:${FIRE};letter-spacing:6px;font-size:20px;margin:0 0 6px;font-weight:700;">天賦原動力</h1>
    <p style="color:${DIM};font-size:13px;margin:0;">你的專屬天才類型分析報告</p>
  </td></tr>

  <!-- Greeting -->
  <tr><td style="padding:28px 32px 16px;">
    <p style="font-size:16px;color:${TEXT};margin:0 0 8px;">Hi <strong style="color:${FIRE};">${name}</strong>，</p>
    <p style="color:${DIM};font-size:13px;line-height:1.7;margin:0;">你的天賦原動力分析報告已完成。這份報告揭示了你天生最強的能量組合，好好珍藏。</p>
  </td></tr>

  <tr><td style="padding:0 32px 24px;">

    <!-- Profile Hero -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
      <tr><td style="background:${SURFACE};border-radius:12px;padding:28px;text-align:center;">
        <div style="font-size:52px;margin-bottom:12px;">${profileIcon}</div>
        <div style="display:inline-block;padding:4px 16px;border-radius:99px;font-size:11px;font-weight:700;letter-spacing:2px;background:${pcBg};color:${pc};border:1px solid ${pcBorder};margin-bottom:12px;">${energy}</div>
        <div style="font-size:28px;font-weight:800;color:${pc};letter-spacing:2px;margin-bottom:4px;">${profileName}</div>
        <div style="font-size:14px;color:${DIM};">${profileEn} · ${profileTagline}</div>
        ${desc ? `<p style="color:#c0c0e0;font-size:13px;line-height:1.8;margin:14px 0 0;text-align:left;">${desc}</p>` : ''}
      </td></tr>
    </table>

    <!-- Energy Bars -->
    ${section('⚡ 四大能量分佈', `
      <table width="100%" cellpadding="0" cellspacing="0">
        ${energyBar('⚡ 發電機 Dynamo', D, DYNAMO_C)}
        ${energyBar('🔥 火焰 Blaze', B, BLAZE_C)}
        ${energyBar('🌊 節奏 Tempo', T, TEMPO_C)}
        ${energyBar('🔩 鋼鐵 Steel', S, STEEL_C)}
      </table>
    `)}

    <!-- Strengths & Weaknesses -->
    ${section('🧬 天才類型特質', `
      <div style="margin-bottom:12px;">
        <div style="color:${FIRE};font-size:11px;font-weight:700;margin-bottom:8px;">✨ 天賦優勢</div>
        <div>${tags(strengths, pc)}</div>
      </div>
      <div>
        <div style="color:${DIM};font-size:11px;font-weight:700;margin-bottom:8px;">⚠️ 需要注意</div>
        <div>${tags(weaknesses, DIM)}</div>
      </div>
    `)}

    <!-- Strategy -->
    ${strategy ? section('💰 順流致富策略', `<p style="color:#c0c0e0;font-size:13px;line-height:1.8;margin:0;">${strategy}</p>`) : ''}

    <!-- Famous -->
    ${famous && famous.length ? section('👤 同類型知名人物', `<div>${tags(famous, pc)}</div>`) : ''}

    <!-- Careers -->
    ${careers && careers.length ? section('💼 最適合從事的職業', `<div>${tags(careers, pc)}</div>`) : ''}

    <!-- Business -->
    ${business && business.length ? section('🚀 最適合的創業方向', listItems(business)) : ''}

    <!-- Best Partners -->
    ${bestPartners && bestPartners.length ? section('🤝 最佳合作夥伴', `
      ${bestPartners.map(p => `
        <div style="margin-bottom:12px;padding:12px;background:${SURFACE2};border-radius:8px;border-left:3px solid ${pc};">
          <div style="font-size:14px;font-weight:700;color:${pc};margin-bottom:4px;">${partnerIcons[p.key]||''} ${partnerNames[p.key]||p.key}</div>
          <div style="font-size:12px;color:${DIM};line-height:1.7;">${p.reason}</div>
        </div>`).join('')}
    `) : ''}

  </td></tr>

  <!-- Footer -->
  <tr><td style="padding:20px 32px;border-top:1px solid ${BORDER};text-align:center;">
    <p style="color:#4a4a7a;font-size:12px;margin:0;">由 天賦原動力 寄出 · ${date}</p>
  </td></tr>

</table>
</td></tr>
</table>
</body></html>`;
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  if (req.method === 'OPTIONS') return res.status(200).end();
  try { return await handleRequest(req, res); }
  catch (err) { return res.status(500).json({ error: err.message || '伺服器錯誤' }); }
}

async function handleRequest(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const body = req.body || {};
  const { email, name, profileName, profileIcon, energy, pageHtml } = body;
  if (!email || !name) return res.status(400).json({ error: '缺少必要欄位' });

  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  if (!gmailUser || !gmailPass) return res.status(500).json({ error: 'Email 服務尚未設定' });

  saveToNotion(name, email, profileName || energy).catch(() => {});

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', port: 587, secure: false,
    auth: { user: gmailUser, pass: gmailPass },
  });

  await transporter.sendMail({
    from: `"天賦原動力" <${gmailUser}>`,
    to: email,
    subject: `${name} 的天賦原動力報告 ${profileIcon || '🔥'}`,
    html: pageHtml || '<p>報告內容載入失敗，請重新測驗。</p>',
  });

  // Notify Jimmy
  const jimmyHtml = `<div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;">
    <h2 style="color:#f97316;">🔥 新用戶報告通知</h2>
    <table style="width:100%;border-collapse:collapse;border:1px solid #eee;">
      <tr style="background:#f9f9f9;"><td style="padding:10px;color:#666;width:80px;">姓名</td><td style="padding:10px;font-weight:bold;">${name}</td></tr>
      <tr><td style="padding:10px;color:#666;">Email</td><td style="padding:10px;">${email}</td></tr>
      <tr style="background:#f9f9f9;"><td style="padding:10px;color:#666;">類型</td><td style="padding:10px;font-weight:bold;">${profileIcon} ${profileName}（${profileEn}）</td></tr>
      <tr><td style="padding:10px;color:#666;">主能量</td><td style="padding:10px;">${energy}</td></tr>
      <tr style="background:#f9f9f9;"><td style="padding:10px;color:#666;">時間</td><td style="padding:10px;">${new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}</td></tr>
    </table>
  </div>`;

  await transporter.sendMail({
    from: `"天賦原動力系統" <${gmailUser}>`,
    to: gmailUser,
    subject: `[新用戶] ${name} ｜${profileIcon} ${profileName}｜${email}`,
    html: jimmyHtml,
  });

  return res.status(200).json({ ok: true });
}
