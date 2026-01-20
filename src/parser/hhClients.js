const fs = require('fs');
const path = require('path');

class HHClient {
  constructor() {
    this.configPath = path.join(__dirname, '../../config/tqb-keywords.json');
    this.config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
  }

  getSearchQueries() {
    const keywords = [
      ...this.config.keywords.high_priority,
      ...this.config.keywords.medium_priority
    ];
    
    return keywords.map(kw => `${kw} ${this.config.locations.priority}`);
  }

  filterJobs(jobs) {
    return jobs.filter(job => {
      const salary = this.parseSalary(job.salary);
      return salary >= this.config.salary_min;
    });
  }

  parseSalary(salaryStr) {
    if (!salaryStr) return 0;
    const numbers = salaryStr.match(/\d+/g);
    return numbers ? parseInt(numbers) : 0;
  }
}

module.exports = HHClient;
