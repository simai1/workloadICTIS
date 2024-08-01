//? Здесь все запросы к апи, присвоение этих данных состояниями в AssingApiData

import axios from "axios";
// const server = "https://workload.sfedu.ru";
const server = "http://localhost:3002";
const http = axios.create({
  withCredentials: true,
});

//! получаем преподов
export const Educator = async (par = "") => {
  try {
    // console.log(`${server}/workload`)
    const response = await http.get(`${server}/educator${par}`);
    return response;
  } catch (error) {
    console.error("Error:", error, `${server}/workload`);
    //throw error;
  }
};

//! получаем преподов по своему институту
export const EducatorByInstitute = async () => {
  try {
    const response = await http.get(
      `${server}/educator/get/educatorsByInstitute`
    );
    return response;
  } catch (error) {
    console.error("Error:", error);
    //throw error;
  }
};

//! получаем преподов по кафедре
export const apiEducatorDepartment = async (par = "") => {
  try {
    const response = await http.get(
      `${server}/educator/get/educatorsByDepartment${par}`
    );
    return response;
  } catch (error) {
    console.error("Error:", error);
    //throw error;
  }
};

//! получение данных user профиль
export const apiGetUser = async () => {
  try {
    const response = await http.get(`${server}/user`);
    return response.data;
  } catch (error) {
    console.error("Error:", error, `${server}/workload`);
    //! если возникли проблемы с получение профиля пользователя перенаправляем на регистрацию
    // window.location.href = "http://localhost:3002/auth/logout";
    window.location.href = "https://workload.sfedu.ru/auth/logout";
  }
};

//! получаем данных личного кабинета преподавателя
export const EducatorLK = async (data) => {
  try {
    const response = await http.get(`${server}/educator/${data}`);
    console.log("response_EducatorLK", response);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    //throw error;
  }
};

//! получаем данных личного кабинета преподавателя
export const EducatorKard = async (data) => {
  try {
    const response = await http.get(`${server}/educator/lk/${data}`);
    console.log("response_EducatorLK", response);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    //throw error;
  }
};

//! получаем историю блокированных таблиц
export const apiGetHistory = async (par, department) => {
  console.log("par", par);
  try {
    const response = await http.get(
      `${server}/history/getAll${par}${department}`
    );
    console.log("история", response);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    //throw error;
  }
};

export const CreateEducator = async (data) => {
  try {
    const response = await http.post(`${server}/educator/`, data);
    return response;
  } catch (error) {
    console.error("Error:", error);
    return error;
    //throw error;
  }
};

export const Positions = async () => {
  try {
    const response = await http.get(`${server}/educatorget/positions`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    //throw error;
  }
};

export const TypeOfEmployments = async () => {
  try {
    const response = await http.get(`${server}/educator/get/typeOfEmployments`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    //throw error;
  }
};

const uniqueObjects = (array) => {
  return array.filter(
    (value, index, self) => index === self.findIndex((t) => t.id === value.id)
  );
};
//! получаем нагрузки
export const Workload = async (param) => {
  try {
    const response = await http.get(`${server}/workload${param}`);
    return uniqueObjects(response.data); //! БАГ С ОДИНКОВЫМИ id по этому фильтрация
  } catch (error) {
    console.error("Error:", error, `${server}/workload`);
    return [];
  }
};

//! получаем нагрузки для зк в роли лектора
export const apiOwnDepartHead = async () => {
  try {
    const response = await http.get(`${server}/workload/get/ownDepartHead`);
    return response;
  } catch (error) {
    console.error("Error:", error, `${server}/workload`);
    return [];
  }
};

//! получаем нагрузки по кафедре
export const apiGetWorkloadDepartment = async () => {
  try {
    const response = await http.get(`${server}/workload/get/department`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    //throw error;
  }
};

//! получаем комментарии к нагрузкам от преподавателей
export const Comment = async () => {
  try {
    const response = await http.get(`${server}/comment/getAllComment`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    //throw error;
  }
};

//! получаем комментарии к нагрузкам от лектора
export const CommentsLecktorer = async () => {
  try {
    const response = await http.get(`${server}/comment/getOwnComments`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    //throw error;
  }
};

//! получение предупреждений о перегрузках
export const getAllWarningMessage = async () => {
  try {
    const response = await http.get(`${server}/notification`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    //throw error;
  }
};

//! получение предложений
export const getOffers = async () => {
  try {
    const response = await http.get(`${server}/offers`);
    return response;
  } catch (error) {
    console.error("Error:", error);
    //throw error;
  }
};

//! получение предложений для лектора
export const getOffersLecturer = async () => {
  try {
    const response = await http.get(`${server}/offers/getAllOffersByLecture`);
    console.log("предложений", response);
    return response;
  } catch (error) {
    console.error("Error:", error);
    //throw error;
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
    //throw error;
  }
};

//! запрос на разделение нагрузки
export const splitWorkload = async (data) => {
  console.log("Разделение нагрузки по подгруппам", data);
  try {
    const response = await http.post(`${server}/workload/split`, data);
    console.log("response ", response);
    return response;
  } catch (error) {
    console.error("Error:", error);
    //throw error;
  }
};

//! запрос на разделение нагрузки по часам
export const apiSplitByHours = async (data) => {
  console.log("Разделение нагрузки по часам ", data);
  try {
    const response = await http.post(`${server}/workload/splitByHours`, data);
    return response;
  } catch (error) {
    console.error("Error:", error);
    //throw error;
  }
};

//! запрос на соединение нагрузки
export const joinWorkloads = async (data, action) => {
  console.log("Соединение нагрузки ", "data: ", data, "action: ", action);
  try {
    const response = await http.post(`${server}/workload/map${action}`, data);
    console.log("response ", response);
    return response;
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
};

//! запрос на соединение доп нагрузки
export const joinAddWorkloads = async (data) => {
  console.log("Соединение Доп нагрузки ", data);
  try {
    const response = await http.post(`${server}/workload/mapReadyData`, data);
    console.log("response ", response);
    return response;
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
};

//! запрос на принятие предложения
// 1 - предложить
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
    //throw error;
  }
};

//! запрос на принятие предложения с акк ЗК
// 2 - подтвердить ЗК
// 3 - отклонить ЗК При этом, подтверждение не удаляется.

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
    //throw error;
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
    //throw error;
  }
};

//! запрос на удаление преподавателя с нагрузки
export const removeEducatorinWorkload = async (data) => {
  console.log("Преподаватель удален с нагрузки ", data);
  try {
    const response = await http.delete(`${server}/workload/faculty`, {
      data: data,
    });
    console.log("response ", response);
    return response;
  } catch (error) {
    console.error("Error:", error);
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
    //throw error;
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
    //throw error;
  }
};

//! запрос на добавление предложения преподавателя к нагрузке
export const createOffer = async (data) => {
  console.log("Создать предложение ", data);
  try {
    const response = await http.post(`${server}/offers/createOffer`, data);
    console.log("response ", response);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    //throw error;
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
    //throw error;
  }
};

//! запрос на изменени данных в админке
export const apiAdminUpdata = async (data) => {
  console.log("изменение данных админке ", data);
  try {
    const response = await http.put(`${server}/user/${data.id}/update`, {
      [data.key]: data.value,
    });
    console.log("response ", response);
    return response;
  } catch (error) {
    console.error("Error:", error);
    //throw error;
  }
};

//! запрос на получение выделенных цветов
export const getAllColors = async () => {
  try {
    const response = await http.get(`${server}/color/getAllColors`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    //throw error;
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
    //throw error;
  }
};

//! запрос обновления цвета
export const apiUpdateColors = async (data) => {
  console.log("обновление цветом ", data);
  try {
    const response = await http.patch(`${server}/color/changeColor`, data);
    console.log("response ", response);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    //throw error;
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
    //throw error;
  }
};

//! получаем закрепленные
export const getAllAttaches = async () => {
  try {
    const response = await http.get(`${server}/attaches/getAllAttaches`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    //throw error;
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
    //throw error;
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
    //throw error;
  }
};

//! импорт файла
export const SubmitFileXLSX = async (constIdCafedra, file) => {
  console.log("constIdCafedra", constIdCafedra);
  try {
    const response = await http.post(
      `${server}/parser/parseWorkload/${constIdCafedra}`,
      file
    );
    console.log("response ", response);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    //throw error;
  }
};

//!Получение роли

export const GetRole = async () => {
  try {
    const response = await http.get(`${server}/user`);
    console.log("GetRole", response);
    return response;
  } catch (error) {
    console.error("Error:", error);
    //throw error;
  }
};

//!Получение кафелр
export const GetDepartment = async () => {
  try {
    const response = await http.get(`${server}/workload/get/usableDepartments`);
    return response;
  } catch (error) {
    console.error("Error:", error);
  }
};

//! блокировак таблицы нагрузок
export const WorkloadBlocked = async (idTable) => {
  try {
    const response = await http.patch(`${server}/workload/block/${idTable}`);
    return response;
  } catch (error) {
    console.error("Error:", error);
    //throw error;
  }
};

//! Удаление преподователя
export const DeleteTeacher = async (idTeacher) => {
  try {
    const response = await http.delete(`${server}/educator/${idTeacher}`);
    return response;
  } catch (error) {
    console.error("Error:", error);
    //throw error;
  }
};
//! Изменение шготово не готово из истории
export const apiCheckedUpdate = async (ids) => {
  try {
    const response = await http.patch(`${server}/history/check`, ids);
    return response;
  } catch (error) {
    console.error("Error:", error);
    //throw error;
  }
};

//! Редактирование преподователя
export const EditTeacher = async (idTeacher, data) => {
  try {
    const response = await http.patch(`${server}/educator/${idTeacher}`, data);
    return response;
  } catch (error) {
    console.error("Error:", error);
    //throw error;
  }
};
//! Получение списка кафедр доступного для изменения
export const GetUsibleDepartment = async () => {
  try {
    const response = await http.get(
      `${server}/workload/get/departmentsForDirectorate`
    );
    return response;
  } catch (error) {
    console.error("Error:", error);
    //throw error;
  }
};

//! Получение всех пользователей для супер юзера
export const GetAllUserss = async () => {
  try {
    const response = await http.get(`${server}/user/getAll`);
    return response;
  } catch (error) {
    console.error("Error:", error);
    //throw error;
  }
};

//! Получение всех кафедр
export const GetAllDepartments = async () => {
  try {
    const response = await http.get(`${server}/workload/get/departments`);
    return response;
  } catch (error) {
    console.error("Error:", error);
    //throw error;
  }
};

//! Разблокироование таблицы
export const ApiUnblockTable = async (indexTable) => {
  try {
    const response = await http.patch(
      `${server}/workload/unblock/${indexTable}`
    );
    return response;
  } catch (error) {
    console.error("Error:", error);
    //throw error;
  }
};

//!  Блокировака рассписания
export const apiBlockMaterials = async (indexTable) => {
  try {
    const response = await http.patch(`${server}/materials/block/`, {
      department: indexTable,
    });
    return response;
  } catch (error) {
    console.error("Error:", error);
    //throw error;
  }
};
//!  разБлокировака рассписания
export const apiUnblockMaterials = async (indexTable) => {
  try {
    const response = await http.patch(`${server}/materials/unblock/`, {
      department: indexTable,
    });
    return response;
  } catch (error) {
    console.error("Error:", error);
    //throw error;
  }
};

//! Добавить примечание в материалы к рассписанию
export const apiNotecAddMaterials = async (data) => {
  try {
    const response = await http.patch(`${server}/materials`, data);
    return response;
  } catch (error) {
    console.error("Error:", error);
    //throw error;
  }
};

//! Получение текущей суммы и остатка по нагрузкам для ЗК
export const getAllocatedAndUnallocatedWrokloadHours = async (
  indexDepartment
) => {
  try {
    const response = await http.get(
      `${server}/workload/getAllocatedAndUnallocatedWrokloadHours/${indexDepartment}`
    );
    return response;
  } catch (error) {
    console.error("Error:", error);
    //throw error;
  }
};

//! запрос на разблокирование таблицы
export const UnblockTablePlease = async (indexDepartment) => {
  const data = { department: indexDepartment };
  try {
    const response = await http.post(`${server}/workload/requestUnblock`, data);
    return response;
  } catch (error) {
    console.error("Error:", error);
    //throw error;
  }
};

//! Получение Данных для таблицы раасписания к материалам
export const getSchedule = async (param) => {
  try {
    const response = await http.get(`${server}/materials${param}`);
    return response;
  } catch (error) {
    console.error("Error:", error);
    //throw error;
  }
};

//! синхронизация
export const SyncTable = async () => {
  try {
    const response = await http.get(`${server}/materials/sync`);
    return response;
  } catch (error) {
    console.error("Error:", error);
    //throw error;
  }
};

//!удаление по Id строки из материалов
export const DeleteMaterials = async (materialId) => {
  try {
    const response = await http.delete(`${server}/materials/${materialId}`);
    return response;
  } catch (error) {
    console.error("Error:", error);
    //throw error;
  }
};

//! получение кафедр к материалам
export const GetDepartmentsMaterials = async () => {
  try {
    const response = await http.get(`${server}/materials/getUsableDepartments`);
    return response;
  } catch (error) {
    console.error("Error:", error);
    //throw error;
  }
};
