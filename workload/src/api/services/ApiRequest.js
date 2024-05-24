//? Здесь все запросы к апи, присвоение этих данных состояниями в AssingApiData

import axios from "axios";
const server = "http://localhost:3002";
// const server = process.env.REACT_APP_API_URL;
const http = axios.create({
  withCredentials: true,
});

//! получаем преподов
export const Educator = async () => {
  try {
    // console.log(`${server}/workload`)
    const response = await http.get(`${server}/educator`);
    return response.data;
  } catch (error) {
    console.error("Error:", error, `${server}/workload`);
    throw error;
  }
};

//! получаем преподов по кафедре
export const apiEducatorDepartment = async () => {
  try {
    const response = await http.get(
      `${server}/educator/get/educatorsByDepartment`
    );
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

//! получение данных user
export const apiGetUser = async () => {
  try {
    const response = await http.get(`${server}/user`);
    return response.data;
  } catch (error) {
    console.error("Error:", error, `${server}/workload`);
    throw error;
  }
};

//! получаем данных личного кабинета преподавателя
export const EducatorLK = async (data) => {
  try {
    const response = await http.get(`${server}/educator/${data}`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const Positions = async () => {
  try {
    const response = await http.get(`${server}/educatorget/positions`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const TypeOfEmployments = async () => {
  try {
    const response = await http.get(`${server}/educator/get/typeOfEmployments`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

//! получаем нагрузки
export const Workload = async () => {
  try {
    const response = await http.get(`${server}/workload`);
    return response.data;
  } catch (error) {
    console.error("Error:", error, `${server}/workload`);
    throw error;
  }
};

//! получаем нагрузки по кафедре
export const apiGetWorkloadDepartment = async () => {
  try {
    const response = await http.get(`${server}/workload/get/department`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

//! получаем комментарии к нагрузкам от преподавателей
export const Comment = async () => {
  try {
    const response = await http.get(`${server}/comment/getAllComment`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

//! получение предупреждений о перегрузках
export const getAllWarningMessage = async () => {
  try {
    const response = await http.get(`${server}/notification`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

//! получение предложений
export const getOffers = async () => {
  try {
    const response = await http.get(`${server}/offers`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

//! запрос на добавление преподавателя к нагрузке
export const addEducatorWorkload = async (data) => {
  console.log("Добавление преподавателя ", data);
  try {
    const response = await http.patch(`${server}/workload/faculty`, data);
    console.log("response ", response);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

//! запрос на разделение нагрузки
export const splitWorkload = async (data) => {
  console.log("Раздление нагрузки ", data);
  try {
    const response = await http.post(`${server}/workload/split`, data);
    console.log("response ", response);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

//! запрос на соединение нагрузки
export const joinWorkloads = async (data) => {
  console.log("Соединение нагрузки ", data);
  try {
    const response = await http.post(`${server}/workload/map`, data);
    console.log("response ", response);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
};

//! запрос на принятие предложения
// 1 - предложить
// 2 - подтвердить ЗК
// 3 - отклонить ЗК При этом, подтверждение не удаляется.
// 4 - принять Дирекция
// 5 - отменить Дирекцией

export const AcceptOffer = async (data) => {
  console.log("Предложение принято ", data);
  try {
    const response = await http.post(
      `${server}/offers/confirmOrReject/${data.id}`,
      { status: data.status }
    );
    console.log("response ", response);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

//! запрос на принятие предложения с акк ЗК
export const AcceptOfferZK = async (data) => {
  console.log("Предложение принято ", data);
  try {
    const response = await http.post(
      `${server}/offers/introduceOrDecline/${data.id}`,
      { status: data.status }
    );
    console.log("response ", response);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
//! запрос на удаление нагрузки
export const deleteWorkload = async (data) => {
  console.log("Нагрузки удалены ", data);
  try {
    const response = await http.delete(
      `${server}/workload/deleteSeveralWorkloads`,
      { data: data }
    );
    console.log("response ", response);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// ! запрос на удаление преподавателя с нагрузки
export const removeEducatorinWorkload = async (data) => {
  console.log("Преподаватель удален с нагрузки ", data);
  try {
    const response = await http.delete(`${server}/workload/faculty`, {
      data: data,
    });
    console.log("response ", response);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

//! запрос на удаление коммента
export const deleteComment = async (data) => {
  console.log("Комменты удалены ", data);
  try {
    const response = await http.delete(
      `${server}/comment/deleteAllComments/${data}`
    );
    console.log("response ", response);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

//! запрос на добавление комментария
export const createComment = async (data) => {
  console.log("добавление комментария ", data);
  try {
    const response = await http.post(`${server}/comment/createComment`, data);
    console.log("response ", response);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

//! запрос на добавление предложения преподавателя к нагрузке
export const createOffer = async (data) => {
  console.log("Предложение ", data);
  try {
    const response = await http.post(`${server}/offers/createOffer`, data);
    console.log("response ", response);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

//! запрос на изменени данных нагрузки
export const workloadUpdata = async (data) => {
  console.log("изменение данных нагрузки ", data);
  try {
    const response = await http.patch(`${server}/workload/${data.id}/update`, {
      [data.key]: data.value,
    });
    console.log("response ", response);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

//! запрос на получение выделенных цветов
export const getAllColors = async () => {
  try {
    const response = await http.get(`${server}/color/getAllColors`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

//! запрос на добавление выделение строци цветом // получает color и workloadId
export const apiAddColored = async (data) => {
  console.log("выделение цветом ", data);
  try {
    const response = await http.post(`${server}/color/setColor`, data);
    console.log("response ", response);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

//! запрос обновления цвета
export const apiUpdateColors = async (data) => {
  console.log("обновление цветом ", data);
  try {
    const response = await http.put(`${server}/color/changeColors`, data);
    console.log("response ", response);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

//! запрос удалить цвет
export const apiDelColors = async (data) => {
  console.log("убрать цвета ", data);
  try {
    const response = await http.delete(`${server}/color/deleteColors`, {
      data,
    });
    console.log("response ", response);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

//! получаем закрепленные
export const getAllAttaches = async () => {
  try {
    const response = await http.get(`${server}/attaches/getAllAttaches`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

//! добавить закрепленную строку
export const apiAddAttaches = async (data) => {
  console.log("закрепленно ", data);
  try {
    const response = await http.post(`${server}/attaches/setAttaches`, data);
    console.log("response ", response);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

//! запрос убрать закрепленную строку
export const apiUnAttaches = async (data) => {
  console.log("открепленно ", data);
  try {
    const response = await http.delete(`${server}/attaches/unAttaches`, {
      data,
    });
    console.log("response ", response);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

//! импорт файла
export const SubmitFileXLSX = async (data) => {
  console.log("файл ", data);
  try {
    const response = await http.post(`${server}/parser/parseWorkload/7`, data);
    console.log("response ", response);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
