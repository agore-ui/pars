const ScoringEngine = require('./scoringEngine');
const Logger = require('../services/logger');

class LeadScorer {
  constructor() {
    this.engine = new ScoringEngine();
    this.logger = new Logger();
  }

  async scoreLeads(jobs) {
    this.logger.info('🎯 Starting lead scoring...');
    
    return jobs.map(job => {
      const warmthScore = this.engine.calculateWarmthScore(job);
      const matchScore = this.engine.calculateMatchScore(job);
      const totalScore = (warmthScore + matchScore) / 2;
      
      return {
        ...job,
        warmth_score: warmthScore,
        match_score: matchScore,
        total_score: totalScore,
        priority: this.getPriority(totalScore),
        scored_at: new Date().toISOString()
      };
    }).sort((a, b) => b.total_score - a.total_score);
  }

  getPriority(score) {
    if (score >= 80) return 'HIGH';
    if (score >= 50) return 'MEDIUM';
    return 'LOW';
  }
}

module.exports = LeadScorer;
