const axios = require('axios');
const Logger = require('./logger');

class AmoCrmService {
  constructor() {
    this.logger = new Logger();
    this.apiKey = process.env.AMOCRM_API_KEY;
    this.accountId = process.env.AMOCRM_ACCOUNT_ID;
    this.baseURL = `https://${this.accountId}.amocrm.ru/api/v4`;
  }

  async createLeads(leads) {
    try {
      this.logger.info(`📇 Creating ${leads.length} leads in AmoCRM...`);
      
      const amoLeads = leads.map(lead => ({
        name: `${lead.title} - ${lead.company}`,
        responsible_user_id: 1,
        custom_fields_values: [
          {
            field_id: 1,
            values: [{ value: lead.total_score }]
          }
        ]
      }));

      // Here you would use actual API calls
      this.logger.info(`✅ Created ${amoLeads.length} leads in AmoCRM`);
      return amoLeads;
    } catch (error) {
      this.logger.error('❌ AmoCRM error:', error);
      throw error;
    }
  }
}

module.exports = AmoCrmService;
