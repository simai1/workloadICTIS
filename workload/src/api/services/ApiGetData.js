import axios from "axios";

//! получаем преподов
export const Educator = async () => {
  try {
    const response = await axios.get("https://workload.sfedu.ru/educator");
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const Positions = async () => {
  try {
    const response = await axios.get(
      "https://workload.sfedu.ru/educator/get/positions"
    );
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const TypeOfEmployments = async () => {
  try {
    const response = await axios.get(
      "https://workload.sfedu.ru/educator/get/typeOfEmployments"
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
    const response = await axios.get("https://workload.sfedu.ru/workload");
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

//! получаем комментарии к нагрузкам от преподавателей
export const Comment = async () => {
  try {
    const response = await axios.get(
      "https://workload.sfedu.ru/comment/getAllComment"
    );
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

//! получение предупреждений о перегрузках
export const getAllWarningMessage = async () => {
  try {
    const response = await axios.get("https://workload.sfedu.ru/notification");
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

//! получение предложений
export const getOffers = async () => {
  try {
    const response = await axios.get("https://workload.sfedu.ru/offers");
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
    const response = await axios.patch(
      "https://workload.sfedu.ru/workload/faculty",
      data
    );
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
    const response = await axios.post(
      `https://workload.sfedu.ru/workload/${data.workloadId}/split`,
      data
    );
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
    const response = await axios.post(
      "https://workload.sfedu.ru/workload/map",
      data
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
      "https://workload.sfedu.ru/workload/deleteSeveralWorkloads",
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
    const response = await axios.delete(
      "https://workload.sfedu.ru/workload/faculty",
      { data: data }
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
    const response = await axios.post(
      "https://workload.sfedu.ru/comment/createComment",
      data
    );
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
    const response = await axios.post(
      "https://workload.sfedu.ru/offers/createOffer",
      data
    );
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
    const response = await axios.patch(
      `https://workload.sfedu.ru/workload/${id}/update`,
      data
    );
    console.log("response ", response);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

//! запрос на удаление коммента
export const deleteComment = async (data) => {
  console.log("Коммент удален ", data);
  try {
    const response = await axios.delete(
      `https://workload.sfedu.ru/comment/delete/${data}`,
      data
    );
    console.log("response ", response);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
