class MessageTemplate {
  generate(lead) {
    return `
Привет! 👋

Видим, что вы нанимаете ${lead.title.toLowerCase()} в ${lead.location}.

Мы помогли ${Math.floor(Math.random() * 50) + 10} компаниям сократить время найма вдвое.

Нашим инструментом уже пользуются топовые IT компании.

Есть интерес?

TQB Agency 🚀
    `.trim();
  }
}

module.exports = MessageTemplate;
