# 🎓 Quiz SI — Guide de démarrage

## ✅ Démarrer en 4 commandes

```bash
# 1. Entrer dans le dossier
cd quiz-si

# 2. Installer les dépendances
npm install

# 3. Copier et remplir le fichier de configuration
cp .env.example .env
# → Ouvrez .env et remplacez les clés par les vôtres

# 4. Lancer le serveur
npm start
```

Ouvrez ensuite http://localhost:3000 dans votre navigateur. ✅

---

## 🔑 Obtenir les clés API

### Claude AI (obligatoire pour tester)
1. Allez sur https://console.anthropic.com
2. Créez un compte (gratuit)
3. Cliquez sur "API Keys" → "Create Key"
4. Copiez la clé (commence par `sk-ant-`)

### ChatGPT (optionnel)
1. Allez sur https://platform.openai.com/api-keys
2. Créez un compte → "Create new secret key"
3. Copiez la clé (commence par `sk-`)

### Gemini (optionnel)
1. Allez sur https://aistudio.google.com/app/apikey
2. Connectez-vous avec Google → "Create API key"
3. Copiez la clé (commence par `AIza`)

---

## 🌐 Déployer sur Vercel (gratuit)

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Déployer
vercel --prod
```

Pendant le déploiement, Vercel vous demande les variables d'environnement.
Ou ajoutez-les dans : Dashboard Vercel → Settings → Environment Variables

| Nom | Valeur |
|-----|--------|
| ANTHROPIC_API_KEY | sk-ant-... |
| OPENAI_API_KEY | sk-... |
| GEMINI_API_KEY | AIza... |

---

## 📁 Structure du projet

```
quiz-si/
├── server.js          ← Serveur Express (proxy API, résout CORS)
├── package.json
├── .env.example       ← Template des clés
├── .env               ← Vos clés (à créer, ne pas partager)
└── public/
    └── index.html     ← Application complète
```

---

## 📚 13 Thèmes disponibles

**Systèmes d'Information :**
Concepts Fondamentaux · ERP/CRM/SCM · Bases de Données & SQL · Architecture · Gouvernance · Sécurité · BI & Data Warehousing · Gestion de Projet SI · Cloud Computing · Urbanisation du SI

**Informatique :**
🧩 Programmation Orientée Objet (avec exemples de code)
🌲 Structures de Données (avec exemples de code)
⚡ Complexité Algorithmique (avec analyse de code)
