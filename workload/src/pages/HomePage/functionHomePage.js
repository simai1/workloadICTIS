import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

//!Функция генерации файла для скачивания
export const generateAndDownloadExcel = (data, nameDepartment, nameTable) => {
  let transformedData = {};
  if (nameTable === "schedule") {
    transformedData = data.map(
      ({ id, isBlocked, isMerged, isOid, isSplit, educator, ...item }) => ({
        Кафедра: item?.department,
        Дисциплина: item?.discipline,
        Нагрузка: item?.workload,
        Группы: item?.groups,
        Примечение: item?.notes,
        Аудитории: item?.audiences,
        Блок: item?.block,
        Семестр: item?.semester,
        Период: item?.period,
        Учебный_план: item?.curriculum,
        Подразделение_учебного_плана: item?.curriculumUnit,
        Форма_обучения: item?.formOfEducation,
        Уровень_подготовки: item?.levelOfTraining,
        Специальность: item?.specialty,
        Профиль: item?.core,
        Количество_студентов: item?.numberOfStudents,
        Часы: item?.hours,
        Аудиторные_часы: item?.audienceHours,
        Часы_рейтинг_контроль: item?.ratingControlHours,
        Преподаватель: educator?.name,
        Дата_добавления: item?.createdAt,
      })
    );
  }else if(nameTable === 'Teacher'){
    transformedData = data.map(
      ({...item }) => ({
        Преподаватель: item?.name,
        Должность: item?.position,
        Вид_занятости: item?.typeOfEmployment,
        Кафедоа: item?.department,
        Ставка: item?.rate,
        Всего_часов: item?.totalHours,
        Общеинститутские_часы: item?.totalOidHours,
        Институтская_нагрузка_осень: item?.instituteAutumnWorkload,
        Институтская_нагрузка_весна: item?.instituteSpringWorkload,
        Институтская_нагрузка_руководство: item?.instituteManagementWorkload,
        Кафедральные_часы: item?.totalKafedralHours,
        Кафедральные_нагрузка_осень: item?.kafedralAutumnWorkload,
        Кафедральные_нагрузка_весна: item?.kafedralSpringWorkload,
        Доп_нагрузка: item?.kafedralAdditionalWorkload,
      })
    );
  } else {
    transformedData = data.map(
      ({ id, isBlocked, isMerged, isOid, isSplit, educator, ...item }) => ({
        Кафедра: item?.department,
        Дисциплина: item?.discipline,
        Нагрузка: item?.workload,
        Группы: item?.groups,
        Блок: item?.block,
        Семестр: item?.semester,
        Период: item?.period,
        Учебный_план: item?.curriculum,
        Подразделение_учебного_плана: item?.curriculumUnit,
        Форма_обучения: item?.formOfEducation,
        Уровень_подготовки: item?.levelOfTraining,
        Специальность: item?.specialty,
        Профиль: item?.core,
        Количество_студентов: item?.numberOfStudents,
        Часы: item?.hours,
        Аудиторные_часы: item?.audienceHours,
        Часы_рейтинг_контроль: item?.ratingControlHours,
        Преподаватель: educator?.name,
      })
    );
  }

  const worksheet = XLSX.utils.json_to_sheet(transformedData);

  // Установка ширины столбцов
  const columnWidths = transformedData.reduce((widths, row) => {
    Object.keys(row).forEach((key, index) => {
      const value = row[key] ? row[key].toString() : "";
      widths[index] = Math.max(widths[index] || 10, value.length);
    });
    return widths;
  }, []);

  worksheet["!cols"] = columnWidths.map((width) => ({ wch: width }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  const currentDate = new Date();
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Moscow",
  };
  const formattedDate = currentDate
    .toLocaleString("ru-RU", options)
    .replace(/(\d+)\.(\d+)\.(\d+), (\d+):(\d+)/, "$3.$2.$1_$4:$5");
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });
  const excelData = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(excelData, `Экспорт_Таблицы_${nameDepartment}_${formattedDate}.xlsx`);
};
