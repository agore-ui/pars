const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const Logger = require('../services/logger');

const logger = new Logger();
const dbPath = process.env.DB_PATH || './data/hh_intelligence.db';

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    logger.error('❌ Database connection error:', err);
    process.exit(1);
  }
  logger.info('✅ Connected to database');
});

const schema = `
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT,
    salary TEXT,
    url TEXT UNIQUE,
    warmth_score INTEGER,
    match_score INTEGER,
    total_score REAL,
    priority TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    outreach_email_sent BOOLEAN DEFAULT 0,
    outreach_call_sent BOOLEAN DEFAULT 0,
    outreach_message_sent BOOLEAN DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS outreach_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id INTEGER,
    type TEXT,
    status TEXT,
    response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(lead_id) REFERENCES leads(id)
  );

  CREATE TABLE IF NOT EXISTS sync_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service TEXT,
    status TEXT,
    records_count INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_priority ON leads(priority);
  CREATE INDEX IF NOT EXISTS idx_score ON leads(total_score);
`;

db.exec(schema, (err) => {
  if (err) {
    logger.error('❌ Schema creation error:', err);
    process.exit(1);
  }
  logger.info('✅ Database schema created successfully');
  db.close();
});
