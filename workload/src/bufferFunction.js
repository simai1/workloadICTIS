import React from "react";
import {
  AcceptOffer,
  addEducatorWorkload,
  apiSplitByHours,
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
      const data = {
        workloads: buffer[i].hoursData,
      };
      await splitWorkload(data);
      count++;
    }
    // разделения по часам
    else if (buffer[i].request === "splitByHours") {
      const data = {
        workloadId: buffer[i].workloadId,
        workloadsData: buffer[i].data.hoursData,
      };
      // запрос на разделение
      await apiSplitByHours(data);
      count++;
    }

    // соединение нагрузки
    else if (buffer[i].request === "joinWorkloads") {
      await joinWorkloads(buffer[i].data, buffer[i].action);
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
  console.log(count, buffer.length);
  return count === buffer.length;
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
      if (buffer[0].data.workloadIds.some((e) => e === item.id)) {
        return {
          ...item,
          educator: prev.find((el) => el.workloadId === item.id).state,
        };
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
    else if (bufferItem.request === "joinWorkloads") {
      newData = newData.flatMap((item) => {
        if (bufferItem.data.ids.includes(item.id)) {
          return item.id === bufferItem.newState.id
            ? [bufferItem.newState]
            : [];
        } else {
          return [item];
        }
      });
    } else if (bufferItem.request === "splitByHours") {
      newData = handleSplitWorkload(newData, bufferItem, bufferItem.data.n - 1);
    }
  });
  return newData;
}

//! функция для разделения строк при нажатии сохранить
const handleSplitWorkload = (newData, bufdat, inpValueHoursPopup) => {
  let updatedData = newData;
  //! находим индекс строки которую будем делить
  const indexWorkload = updatedData.findIndex(
    (el) => el.id === bufdat.workloadId
  );
  //! создадим массив который необходимо вставить в существующий
  if (indexWorkload !== -1) {
    const newValue = [];
    for (let i = 0; i < Number(inpValueHoursPopup); i++) {
      const origHours = {
        ...updatedData[indexWorkload],
        ...bufdat.data.hoursData[i],
        id: updatedData[indexWorkload].id + (i + 1),
        isMerged: false,
      };
      newValue.push(origHours);
    }
    //! вставляем в массив новые данные
    updatedData = [
      ...updatedData.slice(0, indexWorkload),
      {
        ...updatedData[indexWorkload],
        id: updatedData[indexWorkload].id + 0,
        isSplit: true,
        isSplitArrow: true,
        isMerged: false,
      },
      ...newValue,
      ...updatedData.slice(indexWorkload + 1),
    ];
  }

  return updatedData;
};
