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
  },
  lectorInvite: {
    subject: 'Уведомление workload.sfedu.ru',
    template: () =>
      `<p>Добрый день! Вам назначена лекционная нагрузка по общеинститутским дисциплинам.<br>
          Чтобы рекомендовать преподавателей для практик и лабораторных работ, Вы можете авторизироваться 
          в <a href="https://workload.sfedu.ru/client/">системе распределения нагрузки</a><br>
          Для этого нажмите правой кнопкой мыши по нагрузке -> выберите пункт "Предложить" -> выберите преподавателя -> подтвердите действие. <br>
          После этого слева от нагрузки появится желтый кружок, кликнув по которому, можно увидеть предложение.</p>
          <img src="https://sun1-56.userapi.com/impg/-CvTmoJz2DpEL3yYq87pDeuPhvAyTe3RsxhHpw/y7i_YQeO9ns.jpg?size=586x512&quality=96&sign=278bff9c4e07d6fdf35aa6bac2225c7b&type=album" alt="1">
          <img src="https://sun9-70.userapi.com/impg/XsCsX2BGsmJEvlGUYxtlEQmBCnP68vuadQutbg/Wq97lDuq98Q.jpg?size=334x239&quality=96&sign=2762806ca4fdfe7ae74170e1940e722a&type=album" alt="2">
          <p>(Все действия на скриншотах выполнены на тестовом сервере)</p>`
  },
  guideAppears: {
    subject: 'Уведомление workload.sfedu.ru',
    template: () =>
      `<p>Руководство по пользованию системой уже доступно!<br>
          Вы можете ознакомиться с ним нажав на кнопку с восклицательным знаком в правом верхнем углу страницы.</p>`
  }
};
