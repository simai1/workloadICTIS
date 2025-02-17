export default {
  blocking: {
    subject: 'Блокировка таблицы',
    template: (kaf) =>
      `<p>Редактирование нагрузки для кафедры ${kaf} завершено.</p>`,
  },
  blockingMaterials: {
    subject: 'Блокировка материалов к расписанию',
    template: (kaf) =>
      `<p>Редактирование материалов к расписанию для кафедры ${kaf} завершено.</p>`,
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
  },
  unblockingMaterials: {
    subject: 'Разблокировка материалов к расписанию',
    template: () =>
      `<p>Материалы к расписанию Вашей кафедры были разблокированы</p>`
  },
  lectorInvite: {
    subject: 'Уведомление workload.sfedu.ru',
    template: () =>
      `<p>Добрый день! Вам назначена лекционная нагрузка по общеинститутским дисциплинам.<br>
          Чтобы рекомендовать преподавателей для практик и лабораторных работ, Вы можете авторизоваться 
          в <a href="https://workload.sfedu.ru/client/">системе распределения нагрузки</a><br>
          Для этого нажмите правой кнопкой мыши по нагрузке -> выберите пункт "Предложить" -> выберите преподавателя -> подтвердите действие. <br>
          После этого слева от нагрузки появится желтый кружок, кликнув по которому, можно увидеть предложение.</p>
          <img src="https://sun1-56.userapi.com/impg/-CvTmoJz2DpEL3yYq87pDeuPhvAyTe3RsxhHpw/y7i_YQeO9ns.jpg?size=586x512&quality=96&sign=278bff9c4e07d6fdf35aa6bac2225c7b&type=album" alt="1">
          <img src="https://sun9-70.userapi.com/impg/XsCsX2BGsmJEvlGUYxtlEQmBCnP68vuadQutbg/Wq97lDuq98Q.jpg?size=334x239&quality=96&sign=2762806ca4fdfe7ae74170e1940e722a&type=album" alt="2">
          <p>(Все действия на скриншотах выполнены на тестовом сервере)</p><br><br>
          <p>Елькин Дмитрий Максимович, Руководитель центра разработки ИКТИБ</p>`
  },
  guideAppears: {
    subject: 'Уведомление workload.sfedu.ru',
    template: () =>
      `<p>Руководство по пользованию <a href="https://workload.sfedu.ru/client/">системой распределения нагрузки</a> уже доступно!<br>
          Для ознакомления нажмите на кнопку с вопросительным знаком в правом верхнем углу страницы.</p>
      <img src="https://sun9-4.userapi.com/impg/44Y9O0iDKcvlBf6PtG0qrHWWkfC7eTdJ0XrkWA/k6Mzq20H5bc.jpg?size=352x186&quality=96&sign=8f4188ae2fc9379c1461708f5693f697&type=album" alt="1">`
  }
};
