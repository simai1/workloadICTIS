//? Здесь все запросы к апи, присвоение этих данных состояниями в AssingApiData

import axios from "axios";
const server = "https://workload.sfedu.ru";

//! получаем преподов
export const Educator = async () => {
  try {
    const response = await axios.get(`${server}/educator`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

//! получаем данных личного кабинета преподавателя
export const EducatorLK = async (data) => {
  try {
    const response = await axios.get(`${server}/educator/${data}`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const Positions = async () => {
  try {
    const response = await axios.get(`${server}/educatorget/positions`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const TypeOfEmployments = async () => {
  try {
    const response = await axios.get(
      `${server}/educator/get/typeOfEmployments`
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
    const response = await axios.get(`${server}/workload`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

//! получаем комментарии к нагрузкам от преподавателей
export const Comment = async () => {
  try {
    const response = await axios.get(`${server}/comment/getAllComment`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

//! получение предупреждений о перегрузках
export const getAllWarningMessage = async () => {
  try {
    const response = await axios.get(`${server}/notification`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

//! получение предложений
export const getOffers = async () => {
  try {
    const response = await axios.get(`${server}/offers`);
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
    const response = await axios.patch(`${server}/workload/faculty`, data);
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
    const response = await axios.post(`${server}/workload/split`, data);
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
    const response = await axios.post(`${server}/workload/map`, data);
    console.log("response ", response);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

//! запрос на принятие предложения
export const AcceptOffer = async (data, status) => {
  console.log("Предложение принято ", data);
  try {
    const response = await axios.post(
      `${server}/offers/confirmOrReject/${data}`,
      { status: status }
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
export const workloadUpdata = async (id, data) => {
  console.log("изменение данных нагрузки ", id, data);
  try {
    const response = await axios.patch(`${server}/workload/${id}/update`, data);
    console.log("response ", response);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
