// ! заголовки
export const headers = [
  { key: "id", label: "№" },
  { key: "discipline", label: "Дисциплина" },
  { key: "workload", label: "Нагрузка" },
  { key: "groups", label: "Группа" },
  { key: "department", label: "Кафедра" },
  { key: "block", label: "Блок" },
  { key: "semester", label: "Семестр" },
  { key: "period", label: "Период" },
  { key: "curriculum", label: "Учебный план" },
  { key: "curriculumUnit", label: "Подразделение учебного плана" },
  { key: "formOfEducation", label: "Форма обучения" },
  { key: "levelOfTraining", label: "Уровень подготовки" },
  {
    key: "specialty",
    label: "Направление подготовки (специальность)",
  },
  { key: "core", label: "Профиль" },
  { key: "numberOfStudents", label: "Количество студентов" },
  { key: "hours", label: "Часы" },
  { key: "audienceHours", label: "Аудиторные часы" },
  { key: "ratingControlHours", label: "Часы рейтинг-контроль" },
  { key: "educator", label: "Преподаватель" },
];

export const headersEducator = [
  { key: "id", label: "№" },
  { key: "name", label: "Преподаватель" },
  { key: "position", label: "Должность" },
  { key: "department", label: "Кафедра" },
  { key: "rate", label: "Ставка" },

  { key: "totalHours", label: "Всего часов" },
  { key: "totalOidHours", label: "Общеинститутские часы" },
  { key: "totalKafedralHours", label: "Кафедральные часы" },

  { key: "instituteAutumnWorkload", label: "Институтская 1 (осень)" },
  { key: "instituteSpringWorkload", label: "Институтская 2 (весна)" },
  { key: "instituteManagementWorkload", label: "Институтская Руководство" },

  { key: "kafedralAutumnWorkload", label: "Кафедральная 1 (осень)" },
  { key: "kafedralSpringWorkload", label: "Кафедральная 2 (весна)" },
  { key: "kafedralAdditionalWorkload", label: "Кафедральная Доп. нагрузка" },
];

export const tableHeadersLks = [
  { key: "id", label: "№" },
  { key: "workload", label: "Нагрузка" },
  { key: "department", label: "Кафедра" },
  { key: "type", label: "Тип" },
  { key: "curriculumUnit", label: "Подразделение учебного плана" },
  {
    key: "specialty",
    label: "Направление подготовки (специальность)",
  },
  { key: "hours", label: "Часы" },
  { key: "audienceHours", label: "Аудиторные часы" },
  { key: "hoursFirstPeriod", label: "Часы период 1" },
  { key: "hoursSecondPeriod", label: "Часы период 2" },
  { key: "hoursWithoutPeriod", label: "Часы период 3" },
];
