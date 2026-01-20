class EmailTemplate {
  generate(lead) {
    const subject = `Интересное предложение от TQB Agency для ${lead.company}`;
    
    const body = `
Здравствуйте!

Мы заметили, что ваша компания ${lead.company} ищет ${lead.title.toLowerCase()}.

У нас есть отличное предложение, которое может помочь вам:
- Ускорить процесс найма на ${(lead.match_score)}%
- Снизить стоимость привлечения кандидата на 40%
- Автоматизировать процесс скоринга лидов

Давайте обсудим, как мы можем вам помочь.

С уважением,
TQB Agency Team

---
Контакты: hello@tqb.agency
Телефон: +7 (999) XXX-XXXX
    `.trim();

    return { subject, body };
  }
}

module.exports = EmailTemplate;
