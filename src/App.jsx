import { useState, useEffect, useCallback } from "react";

const TOPICS = [
  { id: "concepts", label: "Concepts Fondamentaux des SI", icon: "🧠", color: "#6C63FF" },
  { id: "erp_crm", label: "ERP / CRM / SCM", icon: "🔗", color: "#00C9A7" },
  { id: "bdd", label: "Bases de Données & SQL", icon: "🗄️", color: "#F7971E" },
  { id: "architecture", label: "Architecture des SI", icon: "🏗️", color: "#E94560" },
  { id: "gouvernance", label: "Gouvernance des SI", icon: "⚖️", color: "#845EC2" },
  { id: "securite", label: "Sécurité des SI", icon: "🔒", color: "#FF6B6B" },
  { id: "bi_dw", label: "BI & Data Warehousing", icon: "📊", color: "#0081CF" },
  { id: "gestion_projet", label: "Gestion de Projet SI", icon: "🗂️", color: "#43AA8B" },
  { id: "cloud", label: "Cloud Computing", icon: "☁️", color: "#FF9A3C" },
  { id: "urbanisation", label: "Urbanisation du SI", icon: "🏙️", color: "#C77DFF" },
];

const AI_MODELS = [
  { id: "claude", label: "Claude AI", logo: "✦", endpoint: "/api/claude", available: true },
  { id: "chatgpt", label: "ChatGPT", logo: "⬡", endpoint: "/api/chatgpt", available: true },
  { id: "gemini", label: "Gemini", logo: "✧", endpoint: "/api/gemini", available: true },
];

const TOPIC_LABELS = {
  concepts: "Systèmes d'information (concepts fondamentaux)",
  erp_crm: "ERP, CRM, SCM",
  bdd: "Bases de données (SQL, modèles relationnels, normalisation)",
  architecture: "Architecture des SI",
  gouvernance: "Gouvernance des SI",
  securite: "Sécurité des systèmes d'information",
  bi_dw: "Business Intelligence & Data Warehousing",
  gestion_projet: "Gestion de projet SI (Agile, cycle en V)",
  cloud: "Cloud computing",
  urbanisation: "Urbanisation du SI",
};

function buildPrompt(topicId, count) {
  const topicLabel = TOPIC_LABELS[topicId] || topicId;
  const easy = Math.round(count * 0.3);
  const medium = Math.round(count * 0.3);
  const hard = count - easy - medium;

  return `You are a university professor specialized in Information Systems. Your task is to generate exactly ${count} high-quality multiple-choice questions (QCM) in French focused specifically on the topic: "${topicLabel}".

Requirements:
1. Language: French only.
2. Difficulty distribution: ${easy} easy (Facile), ${medium} intermediate (Moyen), ${hard} advanced (Difficile).
3. Structure:
   * Each question must have 4 answer choices (A, B, C, D).
   * Only one correct answer.
   * Indicate the correct answer clearly.
   * Provide a short explanation (2–4 lines) justifying the correct answer.
4. Focus: All questions must be strictly about "${topicLabel}". Ensure conceptual variety and avoid redundancy.
5. Academic quality: Use a professional academic tone. Questions should test understanding, not just memorization.

CRITICAL: Return ONLY a valid JSON object with this exact structure, no markdown, no extra text:
{
  "questions": [
    {
      "id": 1,
      "question": "texte de la question",
      "difficulty": "Facile",
      "options": {
        "A": "option A",
        "B": "option B",
        "C": "option C",
        "D": "option D"
      },
      "correct": "A",
      "explanation": "explication courte de la bonne réponse en 2-4 lignes"
    }
  ]
}

Generate exactly ${count} questions. Difficulty must be exactly "Facile", "Moyen", or "Difficile".`;
}

async function generateQuestions(topicId, count, modelId, setStatus) {
  const model = AI_MODELS.find((m) => m.id === modelId);
  setStatus(`Génération avec ${model.label}...`);
  const prompt = buildPrompt(topicId, count);

  const response = await fetch(model.endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error || `Erreur API ${response.status}`);
  }

  const data = await response.json();
  const text = data.text || "";
  const cleaned = text.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(cleaned);
  return parsed.questions;
}

// ─────────────────────────────────────────
// Styles
// ─────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #080B14;
    --surface: #0E1220;
    --surface2: #141829;
    --border: rgba(255,255,255,0.07);
    --text: #E8EAF0;
    --muted: #6B7289;
    --accent: #6C63FF;
    --accent2: #00C9A7;
    --danger: #FF4D6D;
    --success: #2ECC71;
    --warning: #FFB703;
  }

  body { font-family: 'Sora', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; overflow-x: hidden; }

  .noise-overlay {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
    opacity: 0.4;
  }

  .glow-orb { position: fixed; border-radius: 50%; pointer-events: none; filter: blur(80px); opacity: 0.12; z-index: 0; }
  .glow-orb-1 { width: 600px; height: 600px; background: #6C63FF; top: -200px; left: -200px; }
  .glow-orb-2 { width: 400px; height: 400px; background: #00C9A7; bottom: -100px; right: -100px; }

  .page { position: relative; z-index: 1; min-height: 100vh; }

  .home { padding: 60px 20px 100px; max-width: 1100px; margin: 0 auto; }
  .home-header { text-align: center; margin-bottom: 60px; }
  .badge { display: inline-block; font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: var(--accent); border: 1px solid rgba(108,99,255,0.3); padding: 6px 16px; border-radius: 100px; margin-bottom: 24px; background: rgba(108,99,255,0.08); }
  .home-title { font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 800; line-height: 1.1; margin-bottom: 16px; }
  .home-title span { background: linear-gradient(135deg, #6C63FF, #00C9A7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .home-subtitle { color: var(--muted); font-size: 1.05rem; font-weight: 300; max-width: 520px; margin: 0 auto; }

  .topics-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 14px; margin-bottom: 50px; }
  .topic-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 22px 18px; cursor: pointer; transition: all 0.25s cubic-bezier(.4,0,.2,1); position: relative; overflow: hidden; }
  .topic-card::before { content: ''; position: absolute; inset: 0; opacity: 0; transition: opacity 0.25s; background: var(--topic-color, #6C63FF); border-radius: inherit; }
  .topic-card:hover { transform: translateY(-3px); border-color: rgba(255,255,255,0.15); }
  .topic-card:hover::before { opacity: 0.06; }
  .topic-card.selected { border-color: var(--topic-color, #6C63FF); transform: translateY(-3px); }
  .topic-card.selected::before { opacity: 0.12; }
  .topic-icon { font-size: 28px; margin-bottom: 12px; display: block; }
  .topic-label { font-size: 0.82rem; font-weight: 600; line-height: 1.4; color: var(--text); position: relative; }
  .topic-check { position: absolute; top: 12px; right: 12px; width: 20px; height: 20px; border-radius: 50%; background: var(--topic-color); display: flex; align-items: center; justify-content: center; font-size: 10px; opacity: 0; transition: opacity 0.2s; }
  .topic-card.selected .topic-check { opacity: 1; }

  .generate-btn { display: block; margin: 0 auto; padding: 18px 56px; font-size: 1rem; font-weight: 700; font-family: 'Sora', sans-serif; letter-spacing: 0.5px; background: linear-gradient(135deg, #6C63FF, #845EC2); color: white; border: none; border-radius: 14px; cursor: pointer; transition: all 0.25s; box-shadow: 0 8px 32px rgba(108,99,255,0.35); }
  .generate-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(108,99,255,0.5); }
  .generate-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 20px; animation: fadeIn 0.2s ease; }
  .modal { background: var(--surface2); border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; padding: 40px; max-width: 500px; width: 100%; animation: slideUp 0.3s cubic-bezier(.4,0,.2,1); max-height: 90vh; overflow-y: auto; }
  .modal-title { font-size: 1.5rem; font-weight: 700; margin-bottom: 8px; }
  .modal-sub { color: var(--muted); font-size: 0.88rem; margin-bottom: 32px; }
  .field-label { font-size: 0.78rem; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); margin-bottom: 10px; }

  .model-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 28px; }
  .model-btn { padding: 14px 10px; border-radius: 12px; border: 1px solid var(--border); background: var(--surface); cursor: pointer; text-align: center; transition: all 0.2s; color: var(--text); }
  .model-btn .logo { font-size: 22px; display: block; margin-bottom: 6px; }
  .model-btn .name { font-size: 0.75rem; font-weight: 600; }
  .model-btn.selected { border-color: var(--accent); background: rgba(108,99,255,0.12); }
  .model-btn.claude.selected { border-color: #6C63FF; background: rgba(108,99,255,0.12); }
  .model-btn.chatgpt.selected { border-color: #10A37F; background: rgba(16,163,127,0.12); }
  .model-btn.gemini.selected { border-color: #4285F4; background: rgba(66,133,244,0.12); }

  .count-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 28px; }
  .count-btn { padding: 12px; border-radius: 10px; border: 1px solid var(--border); background: var(--surface); cursor: pointer; text-align: center; font-size: 0.9rem; font-weight: 600; color: var(--text); transition: all 0.2s; font-family: 'Sora', sans-serif; }
  .count-btn.selected { border-color: var(--accent); background: rgba(108,99,255,0.12); color: var(--accent); }

  .time-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 32px; }
  .time-btn { padding: 12px 6px; border-radius: 10px; border: 1px solid var(--border); background: var(--surface); cursor: pointer; text-align: center; font-size: 0.78rem; font-weight: 600; color: var(--text); transition: all 0.2s; font-family: 'Sora', sans-serif; }
  .time-btn.selected { border-color: var(--accent2); background: rgba(0,201,167,0.1); color: var(--accent2); }

  .start-btn { width: 100%; padding: 16px; font-size: 1rem; font-weight: 700; font-family: 'Sora', sans-serif; background: linear-gradient(135deg, #6C63FF, #00C9A7); color: white; border: none; border-radius: 12px; cursor: pointer; transition: all 0.25s; box-shadow: 0 6px 24px rgba(108,99,255,0.3); }
  .start-btn:hover { transform: translateY(-1px); box-shadow: 0 10px 32px rgba(108,99,255,0.45); }
  .start-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .modal-cancel { width: 100%; padding: 12px; margin-top: 10px; font-family: 'Sora', sans-serif; font-size: 0.88rem; color: var(--muted); background: none; border: none; cursor: pointer; transition: color 0.2s; }
  .modal-cancel:hover { color: var(--text); }

  .loading-page { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; gap: 24px; }
  .spinner { width: 56px; height: 56px; border: 3px solid rgba(108,99,255,0.2); border-top-color: #6C63FF; border-radius: 50%; animation: spin 0.8s linear infinite; }
  .loading-text { color: var(--muted); font-size: 0.9rem; font-family: 'JetBrains Mono'; }

  .quiz-page { max-width: 780px; margin: 0 auto; padding: 40px 20px 80px; }
  .quiz-topbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; flex-wrap: wrap; gap: 12px; }
  .quiz-info { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
  .topic-pill { font-size: 0.75rem; font-weight: 600; padding: 6px 14px; border-radius: 100px; border: 1px solid var(--border); color: var(--muted); }
  .model-pill { font-size: 0.72rem; font-weight: 600; padding: 5px 12px; border-radius: 100px; background: rgba(108,99,255,0.1); border: 1px solid rgba(108,99,255,0.3); color: var(--accent); }
  .q-counter { font-family: 'JetBrains Mono'; font-size: 0.85rem; color: var(--muted); }

  .timer-ring { position: relative; width: 56px; height: 56px; }
  .timer-ring svg { transform: rotate(-90deg); }
  .timer-ring circle { fill: none; stroke-width: 3; }
  .timer-bg { stroke: rgba(255,255,255,0.08); }
  .timer-fg { stroke: var(--accent); stroke-linecap: round; transition: stroke-dashoffset 1s linear, stroke 0.3s; }
  .timer-text { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono'; font-size: 0.8rem; font-weight: 500; }

  .progress-bar-wrap { background: rgba(255,255,255,0.06); border-radius: 100px; height: 4px; margin-bottom: 36px; overflow: hidden; }
  .progress-bar-fill { height: 100%; background: linear-gradient(90deg, #6C63FF, #00C9A7); border-radius: 100px; transition: width 0.4s ease; }

  .question-card { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 36px; margin-bottom: 24px; }
  .diff-badge { display: inline-block; font-size: 0.7rem; font-weight: 700; letter-spacing: 1px; padding: 4px 12px; border-radius: 100px; margin-bottom: 18px; font-family: 'JetBrains Mono'; }
  .diff-Facile { background: rgba(46,204,113,0.12); color: #2ECC71; border: 1px solid rgba(46,204,113,0.3); }
  .diff-Moyen { background: rgba(255,183,3,0.12); color: #FFB703; border: 1px solid rgba(255,183,3,0.3); }
  .diff-Difficile { background: rgba(255,77,109,0.12); color: #FF4D6D; border: 1px solid rgba(255,77,109,0.3); }
  .question-text { font-size: 1.05rem; font-weight: 500; line-height: 1.7; }

  .options-list { display: flex; flex-direction: column; gap: 10px; }
  .option-btn { display: flex; align-items: flex-start; gap: 14px; padding: 16px 20px; background: var(--surface); border: 1px solid var(--border); border-radius: 14px; cursor: pointer; text-align: left; color: var(--text); font-family: 'Sora', sans-serif; font-size: 0.9rem; line-height: 1.5; transition: all 0.2s; width: 100%; }
  .option-btn:hover { border-color: rgba(108,99,255,0.5); background: rgba(108,99,255,0.05); }
  .option-btn.selected { border-color: var(--accent); background: rgba(108,99,255,0.1); }
  .option-btn.correct { border-color: var(--success); background: rgba(46,204,113,0.1); color: #2ECC71; }
  .option-btn.wrong { border-color: var(--danger); background: rgba(255,77,109,0.1); color: #FF4D6D; }
  .option-btn:disabled { cursor: default; }
  .opt-letter { width: 28px; height: 28px; border-radius: 8px; background: rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; font-family: 'JetBrains Mono'; flex-shrink: 0; margin-top: 1px; }
  .option-btn.selected .opt-letter { background: var(--accent); color: white; }
  .option-btn.correct .opt-letter { background: var(--success); color: white; }
  .option-btn.wrong .opt-letter { background: var(--danger); color: white; }

  .nav-buttons { display: flex; align-items: center; justify-content: space-between; margin-top: 28px; }
  .nav-btn { padding: 12px 28px; border-radius: 10px; border: 1px solid var(--border); background: var(--surface); color: var(--text); font-family: 'Sora', sans-serif; font-size: 0.88rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
  .nav-btn:hover { border-color: rgba(255,255,255,0.2); }
  .nav-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .submit-btn { padding: 14px 36px; border-radius: 10px; border: none; background: linear-gradient(135deg, #6C63FF, #845EC2); color: white; font-family: 'Sora', sans-serif; font-size: 0.9rem; font-weight: 700; cursor: pointer; transition: all 0.25s; box-shadow: 0 6px 20px rgba(108,99,255,0.3); }
  .submit-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 28px rgba(108,99,255,0.45); }

  .dots-nav { display: flex; gap: 6px; justify-content: center; margin-top: 20px; flex-wrap: wrap; }
  .dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.1); cursor: pointer; transition: all 0.2s; }
  .dot.answered { background: rgba(108,99,255,0.6); }
  .dot.active { background: var(--accent); transform: scale(1.4); }

  .results-page { max-width: 860px; margin: 0 auto; padding: 50px 20px 80px; }
  .results-header { text-align: center; margin-bottom: 50px; }
  .score-circle { width: 160px; height: 160px; border-radius: 50%; margin: 0 auto 24px; position: relative; display: flex; align-items: center; justify-content: center; }
  .score-number { font-size: 2.5rem; font-weight: 800; font-family: 'JetBrains Mono'; position: relative; }
  .score-total { font-size: 0.9rem; color: var(--muted); margin-top: 2px; font-family: 'JetBrains Mono'; }
  .result-title { font-size: 1.8rem; font-weight: 700; margin-bottom: 8px; }
  .result-msg { color: var(--muted); font-size: 0.95rem; }

  .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 44px; }
  .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 22px; text-align: center; }
  .stat-val { font-size: 2rem; font-weight: 800; font-family: 'JetBrains Mono'; margin-bottom: 6px; }
  .stat-label { font-size: 0.78rem; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }

  .review-section { margin-bottom: 44px; }
  .review-title-label { font-size: 0.78rem; font-weight: 700; margin-bottom: 20px; color: var(--muted); text-transform: uppercase; letter-spacing: 1.5px; }
  .review-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 24px; margin-bottom: 14px; }
  .review-q-header { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 16px; }
  .review-q-num { font-family: 'JetBrains Mono'; font-size: 0.78rem; color: var(--muted); padding-top: 2px; white-space: nowrap; }
  .review-q-text { font-size: 0.92rem; font-weight: 500; line-height: 1.6; }
  .review-options { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
  .review-opt { display: flex; align-items: center; gap: 10px; font-size: 0.85rem; padding: 8px 12px; border-radius: 8px; border: 1px solid transparent; }
  .review-opt.correct-ans { background: rgba(46,204,113,0.08); border-color: rgba(46,204,113,0.25); color: #2ECC71; }
  .review-opt.wrong-ans { background: rgba(255,77,109,0.08); border-color: rgba(255,77,109,0.25); color: #FF4D6D; }
  .review-opt.neutral { color: var(--muted); }
  .review-opt-letter { font-family: 'JetBrains Mono'; font-size: 0.75rem; font-weight: 700; width: 22px; flex-shrink: 0; }
  .explanation-box { background: rgba(108,99,255,0.06); border: 1px solid rgba(108,99,255,0.2); border-radius: 10px; padding: 14px 16px; font-size: 0.83rem; color: rgba(232,234,240,0.8); line-height: 1.6; }
  .expl-label { font-size: 0.7rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--accent); margin-bottom: 6px; font-family: 'JetBrains Mono'; }

  .results-actions { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
  .action-btn { padding: 14px 32px; border-radius: 12px; font-family: 'Sora', sans-serif; font-size: 0.92rem; font-weight: 700; cursor: pointer; transition: all 0.25s; }
  .action-primary { background: linear-gradient(135deg, #6C63FF, #845EC2); color: white; border: none; box-shadow: 0 6px 24px rgba(108,99,255,0.3); }
  .action-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(108,99,255,0.45); }
  .action-secondary { background: none; color: var(--text); border: 1px solid var(--border); }
  .action-secondary:hover { border-color: rgba(255,255,255,0.2); }

  .error-box { background: rgba(255,77,109,0.1); border: 1px solid rgba(255,77,109,0.3); border-radius: 12px; padding: 16px 20px; color: #FF4D6D; font-size: 0.88rem; margin-top: 16px; text-align: center; }

  @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
  @keyframes spin { to { transform: rotate(360deg) } }

  @media (max-width: 600px) {
    .stats-row { grid-template-columns: 1fr 1fr; }
    .quiz-topbar { flex-direction: column; align-items: flex-start; }
    .nav-buttons { flex-direction: column; gap: 10px; }
    .nav-btn, .submit-btn { width: 100%; text-align: center; }
  }
`;

function TimerRing({ seconds, total, onExpire }) {
  const [left, setLeft] = useState(seconds);
  const r = 22;
  const circ = 2 * Math.PI * r;
  const pct = left / total;
  const stroke = left <= 10 ? "#FF4D6D" : left <= 20 ? "#FFB703" : "#6C63FF";

  useEffect(() => { setLeft(seconds); }, [seconds]);
  useEffect(() => {
    if (left <= 0) { onExpire(); return; }
    const t = setTimeout(() => setLeft((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [left, onExpire]);

  return (
    <div className="timer-ring">
      <svg width="56" height="56" viewBox="0 0 56 56">
        <circle className="timer-bg" cx="28" cy="28" r={r} />
        <circle className="timer-fg" cx="28" cy="28" r={r}
          strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)} style={{ stroke }} />
      </svg>
      <div className="timer-text" style={{ color: stroke }}>{left}</div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("home");
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState("claude");
  const [questionCount, setQuestionCount] = useState(10);
  const [timePerQ, setTimePerQ] = useState(60);
  const [loading, setLoading] = useState(false);
  const [loadStatus, setLoadStatus] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [error, setError] = useState("");

  const topicObj = TOPICS.find((t) => t.id === selectedTopic);
  const modelObj = AI_MODELS.find((m) => m.id === selectedModel);

  const handleStart = async () => {
    setError("");
    setLoading(true);
    setModalOpen(false);
    try {
      const qs = await generateQuestions(selectedTopic, questionCount, selectedModel, setLoadStatus);
      setQuestions(qs);
      setAnswers({});
      setCurrentQ(0);
      setSubmitted(false);
      setTimerKey((k) => k + 1);
      setPage("quiz");
    } catch (e) {
      setError("Erreur : " + e.message);
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (letter) => {
    if (submitted) return;
    setAnswers((p) => ({ ...p, [currentQ]: letter }));
  };

  const handleTimeExpire = useCallback(() => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((p) => p + 1);
      setTimerKey((k) => k + 1);
    } else {
      setSubmitted(true);
      setPage("results");
    }
  }, [currentQ, questions.length]);

  const handleNext = () => { if (currentQ < questions.length - 1) { setCurrentQ((p) => p + 1); setTimerKey((k) => k + 1); } };
  const handlePrev = () => { if (currentQ > 0) { setCurrentQ((p) => p - 1); setTimerKey((k) => k + 1); } };
  const handleSubmit = () => { setSubmitted(true); setPage("results"); };

  const score = questions.filter((q, i) => answers[i] === q.correct).length;
  const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  const getResultMsg = () => {
    if (pct >= 80) return { title: "Excellent ! 🎉", msg: "Vous maîtrisez très bien ce sujet.", color: "#2ECC71" };
    if (pct >= 60) return { title: "Bien joué ! 👍", msg: "Bonne performance, continuez à vous améliorer.", color: "#FFB703" };
    return { title: "À améliorer 💪", msg: "Révisez le sujet et réessayez pour progresser.", color: "#FF4D6D" };
  };

  return (
    <>
      <style>{styles}</style>
      <div className="noise-overlay" />
      <div className="glow-orb glow-orb-1" />
      <div className="glow-orb glow-orb-2" />

      {/* HOME */}
      {page === "home" && !loading && (
        <div className="page">
          <div className="home">
            <div className="home-header">
              <div className="badge">✦ Préparation aux Examens SI</div>
              <h1 className="home-title">Maîtrisez vos<br /><span>Systèmes d'Information</span></h1>
              <p className="home-subtitle">Questions générées par IA — adaptées à votre niveau, renouvelées à chaque session</p>
            </div>
            <div className="topics-grid">
              {TOPICS.map((t) => (
                <div key={t.id} className={`topic-card ${selectedTopic === t.id ? "selected" : ""}`}
                  style={{ "--topic-color": t.color }} onClick={() => setSelectedTopic(t.id)}>
                  <span className="topic-icon">{t.icon}</span>
                  <div className="topic-label">{t.label}</div>
                  <div className="topic-check" style={{ background: t.color }}>✓</div>
                </div>
              ))}
            </div>
            <button className="generate-btn" disabled={!selectedTopic} onClick={() => setModalOpen(true)}>
              Générer les Questions →
            </button>
          </div>

          {modalOpen && (
            <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}>
              <div className="modal">
                <div className="modal-title">Configurer votre session</div>
                <div className="modal-sub">Sujet : <strong style={{ color: topicObj?.color }}>{topicObj?.label}</strong></div>

                <div className="field-label">Modèle IA</div>
                <div className="model-grid">
                  {AI_MODELS.map((m) => (
                    <div key={m.id} className={`model-btn ${m.id} ${selectedModel === m.id ? "selected" : ""}`}
                      onClick={() => setSelectedModel(m.id)}>
                      <span className="logo">{m.logo}</span>
                      <span className="name">{m.label}</span>
                    </div>
                  ))}
                </div>

                <div className="field-label">Nombre de questions</div>
                <div className="count-grid">
                  {[5, 10, 15, 20].map((n) => (
                    <button key={n} className={`count-btn ${questionCount === n ? "selected" : ""}`} onClick={() => setQuestionCount(n)}>{n}</button>
                  ))}
                </div>

                <div className="field-label">Temps par question</div>
                <div className="time-grid">
                  {[30, 45, 60, 90].map((t) => (
                    <button key={t} className={`time-btn ${timePerQ === t ? "selected" : ""}`} onClick={() => setTimePerQ(t)}>{t}s</button>
                  ))}
                </div>

                {error && <div className="error-box">{error}</div>}
                <button className="start-btn" onClick={handleStart}>Commencer le Quiz ✦</button>
                <button className="modal-cancel" onClick={() => setModalOpen(false)}>Annuler</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="page loading-page">
          <div className="spinner" />
          <div className="loading-text">{loadStatus}</div>
        </div>
      )}

      {/* QUIZ */}
      {page === "quiz" && questions.length > 0 && (
        <div className="page">
          <div className="quiz-page">
            <div className="quiz-topbar">
              <div className="quiz-info">
                <div className="topic-pill">{topicObj?.icon} {topicObj?.label}</div>
                <div className="model-pill">{modelObj?.logo} {modelObj?.label}</div>
                <div className="q-counter">Q {currentQ + 1} / {questions.length}</div>
              </div>
              <TimerRing key={`${timerKey}-${currentQ}`} seconds={timePerQ} total={timePerQ} onExpire={handleTimeExpire} />
            </div>
            <div className="progress-bar-wrap">
              <div className="progress-bar-fill" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
            </div>
            {questions[currentQ] && (
              <>
                <div className="question-card">
                  <span className={`diff-badge diff-${questions[currentQ].difficulty}`}>{questions[currentQ].difficulty}</span>
                  <p className="question-text">{questions[currentQ].question}</p>
                </div>
                <div className="options-list">
                  {Object.entries(questions[currentQ].options).map(([letter, text]) => (
                    <button key={letter} className={`option-btn ${answers[currentQ] === letter ? "selected" : ""}`}
                      onClick={() => handleAnswer(letter)} disabled={submitted}>
                      <span className="opt-letter">{letter}</span>{text}
                    </button>
                  ))}
                </div>
                <div className="nav-buttons">
                  <button className="nav-btn" onClick={handlePrev} disabled={currentQ === 0}>← Précédent</button>
                  {currentQ < questions.length - 1
                    ? <button className="nav-btn" onClick={handleNext}>Suivant →</button>
                    : <button className="submit-btn" onClick={handleSubmit}>Soumettre ✓</button>
                  }
                </div>
                <div className="dots-nav">
                  {questions.map((_, i) => (
                    <div key={i} className={`dot ${i === currentQ ? "active" : ""} ${answers[i] ? "answered" : ""}`}
                      onClick={() => { setCurrentQ(i); setTimerKey((k) => k + 1); }} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* RESULTS */}
      {page === "results" && questions.length > 0 && (() => {
        const res = getResultMsg();
        const wrong = Object.keys(answers).filter((i) => answers[i] !== questions[i]?.correct).length;
        const skipped = questions.length - Object.keys(answers).length;
        return (
          <div className="page">
            <div className="results-page">
              <div className="results-header">
                <div className="score-circle">
                  <svg style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }} width="160" height="160" viewBox="0 0 160 160">
                    <circle cx="80" cy="80" r="70" fill="none" strokeWidth="6" stroke="rgba(255,255,255,0.06)" />
                    <circle cx="80" cy="80" r="70" fill="none" strokeWidth="6" stroke={res.color} strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 70} strokeDashoffset={2 * Math.PI * 70 * (1 - pct / 100)}
                      style={{ transition: "stroke-dashoffset 1s ease" }} />
                  </svg>
                  <div>
                    <div className="score-number" style={{ color: res.color }}>{pct}%</div>
                    <div className="score-total">{score}/{questions.length}</div>
                  </div>
                </div>
                <div className="result-title">{res.title}</div>
                <div className="result-msg">{res.msg}</div>
              </div>
              <div className="stats-row">
                <div className="stat-card"><div className="stat-val" style={{ color: "#2ECC71" }}>{score}</div><div className="stat-label">Correctes</div></div>
                <div className="stat-card"><div className="stat-val" style={{ color: "#FF4D6D" }}>{wrong}</div><div className="stat-label">Incorrectes</div></div>
                <div className="stat-card"><div className="stat-val" style={{ color: "#FFB703" }}>{skipped}</div><div className="stat-label">Non répondues</div></div>
              </div>
              <div className="review-section">
                <div className="review-title-label">Révision détaillée</div>
                {questions.map((q, i) => {
                  const userAns = answers[i];
                  const isCorrect = userAns === q.correct;
                  return (
                    <div key={i} className="review-card">
                      <div className="review-q-header">
                        <span className="review-q-num">Q{i + 1}</span>
                        <span className={`diff-badge diff-${q.difficulty}`} style={{ margin: 0, fontSize: "0.65rem" }}>{q.difficulty}</span>
                        <span className="review-q-text">{q.question}</span>
                      </div>
                      <div className="review-options">
                        {Object.entries(q.options).map(([letter, text]) => {
                          let cls = "neutral";
                          if (letter === q.correct) cls = "correct-ans";
                          else if (letter === userAns && !isCorrect) cls = "wrong-ans";
                          return (
                            <div key={letter} className={`review-opt ${cls}`}>
                              <span className="review-opt-letter">{letter}</span>
                              <span>{text}</span>
                              {letter === q.correct && <span style={{ marginLeft: "auto", fontSize: "0.75rem" }}>✓</span>}
                              {letter === userAns && !isCorrect && <span style={{ marginLeft: "auto", fontSize: "0.75rem" }}>✗</span>}
                            </div>
                          );
                        })}
                      </div>
                      <div className="explanation-box">
                        <div className="expl-label">Explication</div>
                        {q.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="results-actions">
                <button className="action-btn action-primary" onClick={handleStart}>Nouvelle tentative ↺</button>
                <button className="action-btn action-secondary" onClick={() => setPage("home")}>Changer de sujet</button>
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
}
