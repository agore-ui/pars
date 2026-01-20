const fs = require('fs');
const path = require('path');

class ScoringEngine {
  constructor() {
    this.config = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../../config/tqb-keywords.json'), 'utf8')
    );
  }

  calculateWarmthScore(job) {
    let score = 0;

    // Company type score
    if (this.config.company_types.some(type => job.company?.includes(type))) {
      score += 30;
    }

    // Location score
    if (this.config.locations.priority.some(loc => job.location?.includes(loc))) {
      score += 25;
    }

    // Remote work bonus
    if (job.location?.includes('Удалённо')) {
      score += 15;
    }

    return Math.min(score, 100);
  }

  calculateMatchScore(job) {
    let score = 0;
    const jobText = `${job.title} ${job.company}`.toLowerCase();

    // High priority keywords
    this.config.keywords.high_priority.forEach(kw => {
      if (jobText.includes(kw.toLowerCase())) score += 35;
    });

    // Medium priority keywords
    this.config.keywords.medium_priority.forEach(kw => {
      if (jobText.includes(kw.toLowerCase())) score += 20;
    });

    // Salary match
    const salary = this.parseSalary(job.salary);
    if (salary >= this.config.salary_min) {
      score += 25;
    }

    return Math.min(score, 100);
  }

  parseSalary(salaryStr) {
    if (!salaryStr) return 0;
    const numbers = salaryStr.match(/\d+/g);
    return numbers ? parseInt(numbers) : 0;
  }
}

module.exports = ScoringEngine;
