export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

  const { name, profile, profileEn, energy, D, B, T, S, tagline } = req.body;
  const total = (D || 0) + (B || 0) + (T || 0) + (S || 0);

  const pct = (v) => total > 0 ? Math.round(v / total * 100) : 0;

  const prompt = `你是天賦原動力（Talent Dynamics）的專業顧問，由 Roger Hamilton 創建的天賦測評系統。

以下是 ${name} 的測驗結果：

━━━ 天才類型 ━━━
類型：${profile}（${profileEn}）
主能量：${energy}
核心定位：${tagline}

━━━ 四大能量分數 ━━━
- 發電機 Dynamo（創意/創新）：${D} 分（${pct(D)}%）
- 火焰 Blaze（人際/影響力）：${B} 分（${pct(B)}%）
- 節奏 Tempo（穩定/時機）：${T} 分（${pct(T)}%）
- 鋼鐵 Steel（分析/系統）：${S} 分（${pct(S)}%）

━━━━━━━━━━━━━━━━━━━━━━━━

請用繁體中文，全程以「你」稱呼 ${name}，語氣真誠有力，像智慧好友在說話（不要太學術）。

請依照以下結構撰寫個人化解讀（每段 100–150 字）：

## 🔥 你的天賦能量核心
根據能量分數組合，解釋 ${name} 的主要能量特質，以及這個組合為什麼讓 ${name} 成為「${profile}」型。要直接說出這個類型最核心的天賦是什麼。

## ⚡ 你的順流工作模式
具體說明 ${name} 在哪種工作情境最容易進入心流、最容易創造高績效。要給出 3–4 個具體的工作情境或職能建議。

## 🤝 你在團隊中的最佳角色
說明 ${name} 在團隊中最自然扮演什麼角色，以及哪種類型的夥伴跟 ${name} 搭配會讓整個團隊效能最大化。

## ⚠️ 你的能量陷阱
根據能量分數，直接指出 ${name} 最容易掉入的陷阱、消耗最多能量的狀況，以及如何避免。

## 💰 你的致富順流路徑
根據天賦原動力的財富理論，說明 ${name} 最適合的賺錢方式和商業模式。要給出具體、實際的方向（不要說廢話）。

## 🎯 給 ${name} 的三個立刻行動
列出 3 個 ${name} 可以在接下來 30 天內執行的具體行動，直接對應 ${profile} 類型的順流策略。格式：
1. **行動標題**：做什麼 + 為什麼重要 + 第一步
2. **行動標題**：做什麼 + 為什麼重要 + 第一步
3. **行動標題**：做什麼 + 為什麼重要 + 第一步

整篇約 900–1100 字，直接輸出報告，不要加前言或結語。`;

  try {
    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 3000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const result = await claudeRes.json();
    if (!claudeRes.ok) return res.status(claudeRes.status).json({ error: result?.error?.message || JSON.stringify(result) });

    const text = (result?.content?.[0]?.text || '').trim();
    return res.status(200).json({ text });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
