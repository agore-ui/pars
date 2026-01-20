require('dotenv').config();
const Logger = require('./services/logger');
const Scraper = require('./parser/scraper');
const LeadScorer = require('./scoring/leadScorer');
const GoogleSheetsService = require('./services/googleSheetsService');
const AmoCrmService = require('./services/amoCrmService');

const logger = new Logger();

async function main() {
  try {
    logger.info('🚀 Starting HH.ru Job Intelligence Tool');

    // Initialize scraper
    const scraper = new Scraper();
    
    // Start parsing
    logger.info('📊 Starting job listing parser...');
    const jobs = await scraper.parseJobs();
    logger.info(`✅ Parsed ${jobs.length} job listings`);

    // Score leads
    logger.info('🎯 Scoring leads...');
    const scorer = new LeadScorer();
    const scoredLeads = await scorer.scoreLeads(jobs);
    logger.info(`✅ Scored ${scoredLeads.length} leads`);

    // Export to Google Sheets
    if (process.env.GOOGLE_SHEETS_SPREADSHEET_ID) {
      const sheets = new GoogleSheetsService();
      await sheets.exportLeads(scoredLeads);
      logger.info('✅ Exported to Google Sheets');
    }

    // Export to AmoCRM
    if (process.env.AMOCRM_API_KEY) {
      const amocrm = new AmoCrmService();
      await amocrm.createLeads(scoredLeads);
      logger.info('✅ Exported to AmoCRM');
    }

    logger.info('🎉 Process completed successfully');
  } catch (error) {
    logger.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
