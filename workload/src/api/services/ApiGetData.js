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

//! запрос на разделение нагрузки
export const joinWorkloads = async (data) => {
  console.log("Раздление нагрузки ", data);
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
  console.log("Нагрузка удалена ", data);
  try {
    const response = await axios.delete(
      `https://workload.sfedu.ru/workload/delete/${data}`,
      data
    );
    console.log("response ", response);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
