# ⚡ 5-Minute Quick Start

## Step 1: Install Dependencies

\`\`\`bash
npm install
\`\`\`

**Time**: 2 minutes

## Step 2: Initialize Database

\`\`\`bash
npm run db:init
\`\`\`

**Time**: 30 seconds

## Step 3: Configure Environment

\`\`\`bash
cp .env.example .env
nano .env
\`\`\`

Add your credentials and save.

**Time**: 1 minute

## Step 4: Test Parser

\`\`\`bash
npm run parser:test
\`\`\`

You should see job listings being parsed.

**Time**: 1.5 minutes

## 🎉 Done!

Your parser is ready to use:

- Local development: `npm run dev`
- Production: `npm run pm2:start`
- View logs: `npm run pm2:logs`

---

## 📍 Next Steps

1. Read full SETUP-GUIDE.md
2. Configure Google Sheets integration
3. Configure AmoCRM integration
4. Deploy to server

---

**Total Setup Time**: ~5 minutes ✅
