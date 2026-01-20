module.exports = {
  apps: [
    {
      name: 'hh-intelligence-parser',
      script: './src/index.js',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s'
    }
  ],
  deploy: {
    production: {
      user: 'root',
      host: '45.159.209.14',
      ref: 'origin/main',
      repo: 'https://github.com/agore-ui/pars.git',
      path: '/opt/hh-job-intelligence-tool',
      'post-deploy': 'npm install && npm run db:init && pm2 restart ecosystem.config.js'
    }
  }
};
