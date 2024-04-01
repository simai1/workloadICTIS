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
  console.log("buffer", buffer);
  let count = 0;
  for (let i = buffer.length - 1; i >= 0; i--) {
    console.log(buffer[i].request);
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
  return count === buffer.length;
}

//! возвращение предыдущего стостояния таблицы
export async function returnPrevState(buffer, data) {
  console.log("пред сост буфера", buffer[0]);
  if ("removeEducatorinWorkload") {
    let prevState = null;
    const newFilteredData = data.map((item) => {
      if (item.id === buffer.data.workloadId) {
        prevState = item.educator;
        return { ...item, educator: buffer.prevState };
      }
      return item;
    });
    return newFilteredData;
  }
}
