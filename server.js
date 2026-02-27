import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";
import * as dotenv from "dotenv";
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json({ limit: "2mb" }));
app.use(express.static(path.join(__dirname, "public")));

// ─── CLAUDE (Anthropic) ───────────────────────────────
app.post("/api/claude", async (req, res) => {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(500).json({ error: "ANTHROPIC_API_KEY manquante. Ajoutez-la dans Vercel → Settings → Environment Variables" });

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 8000,
        messages: [{ role: "user", content: req.body.prompt }],
      }),
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: data?.error?.message || "Erreur Claude API" });
    const text = (data.content || []).map(b => b.text || "").join("");
    res.json({ text });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─── CHATGPT (OpenAI) ─────────────────────────────────
app.post("/api/chatgpt", async (req, res) => {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return res.status(500).json({ error: "OPENAI_API_KEY manquante. Ajoutez-la dans Vercel → Settings → Environment Variables" });

  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        max_tokens: 8000,
        response_format: { type: "json_object" },
        messages: [{ role: "user", content: req.body.prompt }],
      }),
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: data?.error?.message || "Erreur OpenAI API" });
    const text = data.choices?.[0]?.message?.content || "";
    res.json({ text });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─── GEMINI (Google) ──────────────────────────────────
app.post("/api/gemini", async (req, res) => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return res.status(500).json({ error: "GEMINI_API_KEY manquante. Ajoutez-la dans Vercel → Settings → Environment Variables" });

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${key}`;
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: req.body.prompt }] }],
        generationConfig: {
          maxOutputTokens: 8000,
          temperature: 0.7,
          responseMimeType: "application/json",
        },
      }),
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: data?.error?.message || "Erreur Gemini API" });
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    res.json({ text });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─── Toutes les autres routes → index.html ────────────
app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ─── Démarrage local uniquement ───────────────────────
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅  Quiz SI lancé → http://localhost:${PORT}`);
  });
}

export default app;
