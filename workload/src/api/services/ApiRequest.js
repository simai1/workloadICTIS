//? Здесь все запросы к апи, присвоение этих данных состояниями в AssingApiData

import axios from "axios";
const server = "https://workload.sfedu.ru:80/authoff";
//const server = "http://localhost:80";

//! получаем преподов
export const Educator = async () => {
  try {
    const response = await axios.get(`${server}/educator`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

//! получаем данных личного кабинета преподавателя
export const EducatorLK = async (data) => {
  try {
    const response = await axios.get(`${server}/educator/${data}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const Positions = async () => {
  try {
    const response = await axios.get(`${server}/educatorget/positions`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const TypeOfEmployments = async () => {
  try {
    const response = await axios.get(
      `${server}/educator/get/typeOfEmployments`, { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

//! получаем нагрузки
export const Workload = async () => {
  try {
    const response = await axios.get(`${server}/workload`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

//! получаем комментарии к нагрузкам от преподавателей
export const Comment = async () => {
  try {
    const response = await axios.get(`${server}/comment/getAllComment`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

//! получение предупреждений о перегрузках
export const getAllWarningMessage = async () => {
  try {
    const response = await axios.get(`${server}/notification`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

//! получение предложений
export const getOffers = async () => {
  try {
    const response = await axios.get(`${server}/offers`, { withCredentials: true });
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
    const response = await axios.patch(`${server}/workload/faculty`, data, { withCredentials: true });
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
    const response = await axios.post(`${server}/workload/split`, data, { withCredentials: true });
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
    const response = await axios.post(`${server}/workload/map`, data, { withCredentials: true });
    console.log("response ", response);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

//! запрос на принятие предложения
export const AcceptOffer = async (data) => {
  console.log("Предложение принято ", data);
  try {
    const response = await axios.post(
      `${server}/offers/confirmOrReject/${data.id}`,
      { status: data.status }, { withCredentials: true }
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
    const response = await axios.delete(
      `${server}/workload/deleteSeveralWorkloads`,
      { data: data, withCredentials: true}
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
    const response = await axios.delete(`${server}/workload/faculty`, {
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
    const response = await axios.delete(
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
    const response = await axios.post(`${server}/comment/createComment`, data);
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
    const response = await axios.post(`${server}/offers/createOffer`, data);
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
    const response = await axios.patch(`${server}/workload/${data.id}/update`, {
      [data.key]: data.value,
    });
    console.log("response ", response);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
