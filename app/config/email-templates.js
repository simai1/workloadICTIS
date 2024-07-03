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
  uploadedNewWorkload: {
    subject: 'Обновленная нагрузка',
    template: () =>
      `<p>Обновленная нагрузка кафедры доступна в системе</p>`
  },
  unblocking: {
    subject: 'Разблокировка таблицы',
    template: () =>
      `<p>По вашей просьбе кафедра была разблокирована</p>`
  }
};
