export default {
  blocking: {
    subject: 'Блокировка таблицы',
    template: (kaf) =>
      `<h1>${kaf}</h1>
      <p>Таблица изменена и заблокирована.</p>`,
  },
  requestUnblocking: {
    subject: 'Запрос на разблокировку таблицы',
    template: (senderName, kaf) =>
      `<p>Пользователь ${senderName} запросил разблокировку таблицы ${kaf}.</p>`,
  },
};
