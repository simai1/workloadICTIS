export default {
  blocking: {
    subject: 'Блокировка таблицы',
    template: (kaf) =>
      `<p>Редактирование нагрузки для кафедры ${kaf} завершено.</p>`,
  },
  requestUnblocking: {
    subject: 'Запрос на разблокировку таблицы',
    template: (kaf) =>
      `<p>Кафедра ${kaf} просит разблокировать нагрузку.</p>`,
  },
};
