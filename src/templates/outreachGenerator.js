const EmailTemplate = require('./emailTemplate');
const CallPitchTemplate = require('./callPitchTemplate');
const MessageTemplate = require('./messageTemplate');

class OutreachGenerator {
  generateEmail(lead) {
    const template = new EmailTemplate();
    return template.generate(lead);
  }

  generateCallPitch(lead) {
    const template = new CallPitchTemplate();
    return template.generate(lead);
  }

  generateMessage(lead) {
    const template = new MessageTemplate();
    return template.generate(lead);
  }

  generateAllOutreach(lead) {
    return {
      email: this.generateEmail(lead),
      call_pitch: this.generateCallPitch(lead),
      message: this.generateMessage(lead),
      created_at: new Date().toISOString()
    };
  }
}

module.exports = OutreachGenerator;
