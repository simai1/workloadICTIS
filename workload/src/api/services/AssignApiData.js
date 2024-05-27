//? Здесь присвоение данных полученных к апи к состояниям,
//? представленно в виде функций которые вызываются в TableDisciplins

import {
  Comment,
  Educator,
  EducatorLK,
  Workload,
  getAllColors,
  getAllWarningMessage,
  getOffers,
} from "./ApiRequest";

//! функция получения всех преподавателей
export function getDataEducator() {
  return Educator().then((data) => {
    console.log("teatcher ", data);
    return data;
  });
}

//! функция получения данных личного кабинета преподавателя
export function getDataEducatorLK(id, setEducatorLkData, setEducatorLkTable) {
  EducatorLK(id).then((data) => {
    console.log("EducatorLK ", data);
    setEducatorLkData(data);
    setEducatorLkTable(data.workloads[0]);
  });
}

//! функция получения всех нагрузок
export function getDataTable() {
  return Workload().then((data) => {
    console.log("Workload", data);
    const updatedWorkload = data.map((item) => {
      const { isSplit, ...rest } = item; // убираем isSplit из массива
      return {
        ...rest,
        educator: item.educator && item.educator.name,
      };
    });
    return updatedWorkload; //данные с апи нагрузки
  });
}

//! функция получения всех комментариев на странице
export function getDataAllComment(setCommentAllData) {
  Comment().then((data) => {
    console.log("comment", data);
    setCommentAllData(data);
  });
}

//! функция получения всех предупреждений
export function getAllWarnin(setAllWarningMessage) {
  getAllWarningMessage().then((data) => {
    console.log("AllWarning ", data);
    setAllWarningMessage(data);
  });
}

//! функция получения всех предложений
export function getAllOffers(setAllOffersData) {
  getOffers().then((data) => {
    console.log("Предложения", data);
    setAllOffersData(data);
  });
}

//! функция получения всех предложений
export function funcGetAllColors(setAllColorsData) {
  getAllColors().then((data) => {
    console.log("allColors", data);
    setAllColorsData(data);
  });
}
