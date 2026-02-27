# 🎓 Quiz SI — Préparation aux Examens

Application de quiz interactif pour les Systèmes d'Information, propulsée par Claude AI, ChatGPT et Gemini.

---

## 🚀 Déploiement sur Vercel (3 étapes)

### 1. Installer les dépendances
```bash
npm install
```

### 2. Pousser sur GitHub
```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/VOTRE_USERNAME/quiz-si.git
git push -u origin main
```

### 3. Déployer sur Vercel
1. Allez sur [vercel.com](https://vercel.com) → **Add New Project**
2. Importez votre repo GitHub
3. Dans **Settings → Environment Variables**, ajoutez :

| Variable | Valeur |
|----------|--------|
| `ANTHROPIC_API_KEY` | `sk-ant-...` |
| `OPENAI_API_KEY` | `sk-...` |
| `GEMINI_API_KEY` | `AIza...` |

4. Cliquez **Deploy** ✅

---

## 💻 Développement local

```bash
# 1. Copiez le fichier d'environnement
cp .env.example .env.local

# 2. Ajoutez vos clés API dans .env.local

# 3. Lancez le serveur
npm run dev
```

---

## 🔑 Où obtenir les clés API

| Modèle | Lien |
|--------|------|
| Claude AI | https://console.anthropic.com |
| ChatGPT | https://platform.openai.com/api-keys |
| Gemini | https://aistudio.google.com/app/apikey |

---

## 📁 Structure du projet

```
quiz-si/
├── api/
│   ├── claude.js      ← API Route Claude (Anthropic)
│   ├── chatgpt.js     ← API Route ChatGPT (OpenAI)
│   └── gemini.js      ← API Route Gemini (Google)
├── src/
│   ├── App.jsx        ← Application principale
│   └── main.jsx       ← Point d'entrée React
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
└── .env.example
```

---

## 🎯 Fonctionnalités

- **10 thèmes** couvrant tout le programme SI
- **3 modèles IA** : Claude, ChatGPT, Gemini
- **Distribution intelligente** : 30% Facile, 30% Moyen, 40% Difficile
- **Timer par question** configurable (30s à 90s)
- **Nouvelles questions** à chaque tentative
- **Révision détaillée** avec explications après chaque quiz
