import React from "react";
import {
  AcceptOffer,
  addEducatorWorkload,
  createComment,
  createOffer,
  deleteComment,
  deleteWorkload,
  joinWorkloads,
  removeEducatorinWorkload,
  splitWorkload,
  workloadUpdata,
} from "./api/services/ApiRequest";

//! обработка всех запрсов с буффера
export async function bufferRequestToApi(buffer) {
  let count = 0;
  for (let i = buffer.length - 1; i >= 0; i--) {
    // добаление преподавателя
    if (buffer[i].request === "addEducatorWorkload") {
      await addEducatorWorkload(buffer[i].data);
      count++;
    }
    // разделения нагрузки
    else if (buffer[i].request === "splitWorkload") {
      await splitWorkload(buffer[i].data);
      count++;
    }

    // соединение нагрузки
    else if (buffer[i].request === "joinWorkloads") {
      await joinWorkloads(buffer[i].data);
      count++;
    }

    // принятие предложения
    else if (buffer[i].request === "AcceptOffer") {
      await AcceptOffer(buffer[i].data);
      count++;
    }

    // удаление нагрузки
    else if (buffer[i].request === "deleteWorkload") {
      await deleteWorkload(buffer[i].data);
      count++;
    }

    // удаление преподавателья с нагрузки
    else if (buffer[i].request === "removeEducatorinWorkload") {
      await removeEducatorinWorkload(buffer[i].data);
      count++;
    }

    // удаление комментариев
    else if (buffer[i].request === "deleteComment") {
      await deleteComment(buffer[i].data);
      count++;
    }

    // добавление комментариев
    else if (buffer[i].request === "createComment") {
      await createComment(buffer[i].data);
      count++;
    }

    // добавление предложения преподавателя к нагрузке
    else if (buffer[i].request === "createOffer") {
      await createOffer(buffer[i].data);
      count++;
    }

    // изменени данных нагрузки
    else if (buffer[i].request === "workloadUpdata") {
      await workloadUpdata(buffer[i].data);
      count++;
    }
  }
  return count === buffer.length - 1;
}
/////////////////////////////////////////////////
//! возвращение предыдущего стостояния таблицы
export async function returnPrevState(buffer, data) {
  let prev = buffer[0].prevState;
  if (buffer[0].prevState === null) {
    prev = 0;
  }
  //! добавление удаление преподавателя
  if (
    buffer[0].request === "removeEducatorinWorkload" ||
    buffer[0].request === "addEducatorWorkload"
  ) {
    const newUpdatedData = data.map((item) => {
      if (item.id === buffer[0].data.workloadId) {
        return { ...item, educator: prev };
      }
      return item;
    });
    return newUpdatedData;
  }
  //! изменение данных нагрузки
  else if (buffer[0].request === "workloadUpdata") {
    const newUpdatedData = data.map((item) => {
      if (item.id === buffer[0].data.id) {
        return { ...item, [buffer[0].data.key]: prev };
      }
      return item;
    });
    return newUpdatedData;
  }
}

//! функция прокида буффера для разделения соединения и удаления нагрузок

export function fixDataBuff(data, bufferAction) {
  let newData = [...data];
  //! проходим по элементам буфера
  bufferAction.map((bufferItem) => {
    //! если запрос на разделение
    if (bufferItem.request === "splitWorkload") {
      newData = newData.flatMap((item) => {
        if (bufferItem.data.ids.some((e) => e === item.id)) {
          const newEl = bufferItem.newState.filter(
            (el) => el.id.slice(0, -1) === item.id
          );
          return newEl;
        } else {
          return [item];
        }
      });
    }
    //! если запрос на обьединение
    if (bufferItem.request === "joinWorkloads") {
      newData = newData.flatMap((item) => {
        if (bufferItem.data.ids.includes(item.id)) {
          return item.id === bufferItem.newState.id
            ? [bufferItem.newState]
            : [];
        } else {
          return [item];
        }
      });
    }
  });
  return newData;
}
