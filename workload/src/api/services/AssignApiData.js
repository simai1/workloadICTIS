//? Здесь присвоение данных полученных к апи к состояниям,
//? представленно в виде функций которые вызываются в TableDisciplins

import {
  Comment,
  Workload,
  getAllWarningMessage,
  getOffers,
} from "./ApiRequest";

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
