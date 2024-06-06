export default {
  blocking: {
    subject: 'Блокировка таблицы',
    template: (kaf) =>
      `<h1>${kaf}</h1>
      <p>Таблица изменена и заблокирована.</p>`,
  },
};
