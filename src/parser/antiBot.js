class AntiBot {
  constructor() {
    this.userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
    ];
  }

  getRandomUserAgent() {
    return this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
  }

  async delay(min = 2000, max = 5000) {
    const delayTime = Math.random() * (max - min) + min;
    return new Promise(resolve => setTimeout(resolve, delayTime));
  }

  getRandomHeaders() {
    return {
      'Accept-Language': 'ru-RU,ru;q=0.9',
      'Accept': 'text/html,application/xhtml+xml',
      'Referer': 'https://hh.ru'
    };
  }
}

module.exports = AntiBot;
