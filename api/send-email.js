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
        '報告摘要': { rich_text: [{ text: { content: profileName || '' } }] },
      },
    }),
  });
}

function buildEmail(data) {
  const { name, profileName, profileEn, profileIcon, profileColor, profileColorBg,
    profileTagline, energy, D, B, T, S, desc, strengths, weaknesses,
    strategy, famous, careers, business, bestPartners, allProfiles, userProfileKey } = data;

  const pc = profileColor || '#f97316';
  const pcBg = profileColorBg || 'rgba(249,115,22,0.15)';
  const total = ((D||0)+(B||0)+(T||0)+(S||0)) || 1;
  const pct = v => Math.round((v||0)/total*100);
  const date = new Date().toLocaleDateString('zh-TW', { timeZone: 'Asia/Taipei' });

  const energyRow = (label, val, color) => {
    const w = pct(val);
    return `<tr>
      <td style="padding:5px 8px 5px 0;font-size:13px;color:#9999c0;white-space:nowrap;width:110px;">${label}</td>
      <td style="padding:5px 0;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
          <td style="background:#252548;border-radius:6px;height:8px;">
            <table width="${w}%" cellpadding="0" cellspacing="0" border="0"><tr>
              <td style="background:${color};border-radius:6px;height:8px;font-size:0;">&nbsp;</td>
            </tr></table>
          </td>
          <td style="width:30px;text-align:right;font-size:13px;font-weight:700;color:${color};padding-left:6px;">${val||0}</td>
        </tr></table>
      </td>
    </tr>`;
  };

  const tags = (arr, color) => (arr||[]).map(t =>
    `<span style="display:inline-block;margin:3px;padding:5px 12px;border-radius:99px;font-size:12px;color:${color};border:1px solid ${color};background:rgba(255,255,255,0.04);">${t}</span>`
  ).join('');

  const sectionWrap = (title, content) => `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:12px;">
      <tr><td style="background:#14142a;border-radius:12px;padding:20px 22px;">
        <div style="color:${pc};font-size:11px;font-weight:700;letter-spacing:2px;margin-bottom:14px;">${title}</div>
        ${content}
      </td></tr>
    </table>`;

  const businessItems = (arr) => (arr||[]).map(item =>
    `<div style="padding:6px 0;border-bottom:1px solid #252548;font-size:13px;color:#c0c0e0;">
      <span style="color:${pc};margin-right:6px;">▸</span>${item}
    </div>`
  ).join('');

  const partnerMap = { creator:'💡 創作者', star:'⭐ 明星', supporter:'🤝 支持者', dealmaker:'🎯 媒合者', trader:'⚖️ 商人', accumulator:'🌱 積蓄者', lord:'🏰 地主', mechanic:'⚙️ 技師' };

  return `<!DOCTYPE html>
<html lang="zh-TW"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f0f0f8;font-family:Arial,'Segoe UI',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f0f0f8;">
<tr><td align="center" style="padding:20px 12px;">
<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#0d0d1a;border-radius:14px;overflow:hidden;">

  <!-- Header -->
  <tr><td style="padding:32px 28px;text-align:center;background:#0d0d1a;border-bottom:1px solid #252548;">
    <div style="font-size:36px;margin-bottom:6px;">🔥</div>
    <div style="color:#f97316;font-size:18px;font-weight:700;margin-bottom:4px;">天賦原動力</div>
    <div style="color:#6868a0;font-size:12px;">你的專屬天才類型分析報告</div>
  </td></tr>

  <!-- Greeting -->
  <tr><td style="padding:22px 28px 10px;">
    <div style="font-size:15px;color:#f0f0ff;">Hi <strong style="color:#f97316;">${name}</strong>，</div>
    <div style="color:#6868a0;font-size:13px;margin-top:6px;line-height:1.7;">你的天賦原動力分析報告已完成，以下是你的完整報告。</div>
  </td></tr>

  <tr><td style="padding:10px 28px 24px;">

    <!-- Profile Hero -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:12px;">
      <tr><td style="background:#14142a;border-radius:12px;padding:24px;text-align:center;">
        <div style="font-size:48px;margin-bottom:10px;">${profileIcon}</div>
        <div style="display:inline-block;padding:4px 14px;border-radius:99px;font-size:11px;font-weight:700;letter-spacing:2px;background:${pcBg};color:${pc};border:1px solid ${pc};margin-bottom:10px;">${energy}</div>
        <div style="font-size:26px;font-weight:800;color:${pc};letter-spacing:2px;margin-bottom:4px;">${profileName}</div>
        <div style="font-size:13px;color:#6868a0;">${profileEn} · ${profileTagline}</div>
        ${desc ? `<div style="color:#c0c0e0;font-size:13px;line-height:1.8;margin-top:14px;text-align:left;">${desc}</div>` : ''}
      </td></tr>
    </table>

    <!-- Energy -->
    ${sectionWrap('⚡ 四大能量分佈', `
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        ${energyRow('⚡ 發電機 Dynamo', D, '#f59e0b')}
        ${energyRow('🔥 火焰 Blaze', B, '#ef4444')}
        ${energyRow('🌊 節奏 Tempo', T, '#22c55e')}
        ${energyRow('🔩 鋼鐵 Steel', S, '#3b82f6')}
      </table>
    `)}

    <!-- Strengths & Weaknesses -->
    ${sectionWrap('🧬 天才類型特質', `
      <div style="margin-bottom:14px;">
        <div style="color:#f97316;font-size:11px;font-weight:700;margin-bottom:8px;">✨ 天賦優勢</div>
        <div>${tags(strengths, pc)}</div>
      </div>
      <div>
        <div style="color:#6868a0;font-size:11px;font-weight:700;margin-bottom:8px;">⚠️ 需要注意</div>
        <div>${tags(weaknesses, '#6868a0')}</div>
      </div>
    `)}

    <!-- Strategy -->
    ${strategy ? sectionWrap('💰 順流致富策略', `<div style="color:#c0c0e0;font-size:13px;line-height:1.9;">${strategy}</div>`) : ''}

    <!-- Famous -->
    ${famous && famous.length ? sectionWrap('👤 同類型知名人物', `<div>${tags(famous, pc)}</div>`) : ''}

    <!-- Careers -->
    ${careers && careers.length ? sectionWrap('💼 最適合從事的職業', `<div>${tags(careers, pc)}</div>`) : ''}

    <!-- Business -->
    ${business && business.length ? sectionWrap('🚀 最適合的創業方向', businessItems(business)) : ''}

    <!-- Partners -->
    ${bestPartners && bestPartners.length ? sectionWrap('🤝 最佳合作夥伴', bestPartners.map(p => `
      <div style="margin-bottom:10px;padding:12px;background:#1c1c38;border-radius:8px;border-left:3px solid ${pc};">
        <div style="font-size:13px;font-weight:700;color:${pc};margin-bottom:4px;">${partnerMap[p.key]||p.key}</div>
        <div style="font-size:12px;color:#9999c0;line-height:1.7;">${p.reason}</div>
      </div>`).join('')) : ''}

    <!-- All Profiles Overview -->
    ${allProfiles && allProfiles.length ? sectionWrap('🧩 八種天才類型總覽', `
      <div style="color:#9999c0;font-size:12px;margin-bottom:14px;line-height:1.7;">天賦原動力系統由 4 種能量組成 8 種天才類型。相鄰兩種能量的交界點形成一個類型，你被標記的類型就是你的天賦核心。</div>
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
      ${allProfiles.map((p, i) => {
        const isUser = p.key === userProfileKey;
        const borderColor = isUser ? p.color : '#252548';
        const bgColor = isUser ? 'rgba(255,255,255,0.04)' : '#1c1c38';
        return `${i % 2 === 0 ? '<tr>' : ''}
          <td width="50%" style="padding:4px ${i % 2 === 0 ? '4px 4px 0' : '0 4px 4px'};">
            <div style="background:${bgColor};border:1px solid ${borderColor};border-radius:10px;padding:14px;position:relative;">
              ${isUser ? `<div style="background:${p.color};color:#fff;font-size:10px;font-weight:700;padding:2px 8px;border-radius:99px;display:inline-block;margin-bottom:8px;">你的類型</div><br>` : ''}
              <div style="font-size:20px;margin-bottom:4px;">${p.icon}</div>
              <div style="font-size:14px;font-weight:700;color:${p.color};margin-bottom:2px;">${p.name}</div>
              <div style="font-size:11px;color:#6868a0;margin-bottom:6px;">${p.en} · ${p.energy}</div>
              <div style="font-size:11px;color:#9999c0;margin-bottom:8px;">${p.tagline}</div>
              <div style="margin-bottom:6px;">${(p.strengths||[]).map(s => `<span style="display:inline-block;margin:2px;padding:2px 8px;border-radius:99px;font-size:10px;color:${p.color};border:1px solid ${p.color};">${s}</span>`).join('')}</div>
              <div style="font-size:11px;color:#6868a0;font-weight:700;margin-bottom:3px;">適合職業</div>
              <div style="font-size:11px;color:#c0c0e0;margin-bottom:6px;">${(p.careers||[]).join('・')}</div>
            </div>
          </td>
        ${i % 2 === 1 ? '</tr>' : ''}`;
      }).join('')}
      ${allProfiles.length % 2 !== 0 ? '<td width="50%"></td></tr>' : ''}
      </table>
    `) : ''}

  </td></tr>

  <!-- Footer -->
  <tr><td style="padding:16px 28px;border-top:1px solid #252548;text-align:center;">
    <div style="color:#4a4a7a;font-size:11px;">由 天賦原動力 寄出 · ${date}</div>
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
  const { email, name, profileName, profileEn, profileIcon, energy } = body;
  if (!email || !name) return res.status(400).json({ error: '缺少必要欄位' });

  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  if (!gmailUser || !gmailPass) return res.status(500).json({ error: 'Email 服務尚未設定' });

  saveToNotion(name, email, profileName).catch(() => {});

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', port: 587, secure: false,
    auth: { user: gmailUser, pass: gmailPass },
  });

  await transporter.sendMail({
    from: `"天賦原動力" <${gmailUser}>`,
    to: email,
    subject: `${name} 的天賦原動力報告 ${profileIcon || '🔥'}`,
    html: buildEmail(body),
  });

  await transporter.sendMail({
    from: `"天賦原動力系統" <${gmailUser}>`,
    to: gmailUser,
    subject: `[新用戶] ${name} ｜${profileIcon} ${profileName}（${profileEn}）｜${email}`,
    html: buildEmail(body),
  });

  return res.status(200).json({ ok: true });
}
