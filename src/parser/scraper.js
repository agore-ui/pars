const puppeteer = require('puppeteer');
const AntiBot = require('./antiBot');
const HHClient = require('./hhClient');
const Logger = require('../services/logger');

class Scraper {
  constructor() {
    this.logger = new Logger();
    this.antiBot = new AntiBot();
    this.hhClient = new HHClient();
    this.browser = null;
  }

  async launch() {
    this.browser = await puppeteer.launch({
      headless: process.env.PUPPETEER_HEADLESS !== 'false',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ]
    });
    this.logger.info('✅ Browser launched');
  }

  async parseJobs() {
    try {
      await this.launch();
      const jobs = [];

      // Get search queries
      const queries = this.hhClient.getSearchQueries();
      
      for (const query of queries) {
        this.logger.info(`📍 Searching: ${query}`);
        
        const page = await this.browser.newPage();
        
        // Set user agent
        await page.setUserAgent(this.antiBot.getRandomUserAgent());
        
        // Add delays
        await this.antiBot.delay();
        
        // Navigate
        await page.goto(`https://hh.ru/search/vacancy?text=${query}`, {
          waitUntil: 'networkidle2'
        });
        
        // Extract jobs
        const pageJobs = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('[data-qa="vacancy-serp__vacancy"]'))
            .map(el => ({
              title: el.querySelector('[data-qa="vacancy-serp__vacancy-title"]')?.textContent,
              company: el.querySelector('[data-qa="vacancy-serp__company-title"]')?.textContent,
              salary: el.querySelector('[data-qa="vacancy-serp__vacancy-compensation"]')?.textContent,
              location: el.querySelector('[data-qa="vacancy-serp__vacancy-address"]')?.textContent,
              url: el.querySelector('[data-qa="vacancy-serp__vacancy-title"]')?.href
            }));
        });
        
        jobs.push(...pageJobs);
        await page.close();
      }
      
      await this.browser.close();
      return jobs;
    } catch (error) {
      this.logger.error('❌ Scraper error:', error);
      if (this.browser) await this.browser.close();
      throw error;
    }
  }
}

module.exports = Scraper;
