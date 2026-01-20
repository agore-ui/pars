# 🎯 HH.ru Job Intelligence Tool

Production-ready parser for HH.ru job listings with AI-powered lead scoring and automated outreach.

## ✨ Features

- ✅ **HH.ru Scraper** - Anti-bot technology for reliable data collection
- ✅ **Lead Scoring** - AI scoring based on warmth and relevance
- ✅ **Outreach Automation** - Email, call scripts, and messages
- ✅ **Google Sheets Integration** - Real-time data export
- ✅ **AmoCRM Integration** - CRM automation
- ✅ **SQLite Database** - Persistent data storage
- ✅ **PM2 Deployment** - Server automation

## 🚀 Quick Start

### Local Development

\`\`\`bash
git clone https://github.com/agore-ui/pars.git
cd pars
npm install
cp .env.example .env
npm run db:init
npm run parser:test
\`\`\`

### Server Deployment

\`\`\`bash
ssh root@45.159.209.14
cd /opt
git clone https://github.com/agore-ui/pars.git hh-job-intelligence-tool
cd hh-job-intelligence-tool
npm install
cp .env.example .env
nano .env  # Configure credentials
npm run db:init
npm run pm2:start
\`\`\`

## 📋 Configuration

1. Copy `.env.example` to `.env`
2. Add your credentials:
   - Google Sheets API key
   - AmoCRM API key
   - SMTP credentials

## 📚 Documentation

- [QUICKSTART.md](./QUICKSTART.md) - 5-minute setup guide
- [SETUP-GUIDE.md](./SETUP-GUIDE.md) - Full configuration guide

## 🛠️ Technologies

- Node.js 16+
- Puppeteer (browser automation)
- SQLite3 (database)
- PM2 (process management)
- Winston (logging)

## 📞 Support

GitHub Issues: https://github.com/agore-ui/pars/issues

---

**Version**: 1.0  
**Last Updated**: 2026-01-20  
**Status**: Production Ready ✅
