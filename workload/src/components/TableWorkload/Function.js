//! функция замены преподавательского массива на его имя
export function funFixEducator(data) {
  return data.map((item) => ({
    ...item,
    educator: item.educator ? item.educator.name : "___",
  }));
}

//! фильтрация массива нагрузок
export function filteredWorkload(data, text) {
  const fd = [...data];
  return fd.filter((row) => {
    return Object.values(row).some(
      (value) =>
        value !== null &&
        value !== undefined &&
        value.toString().toLowerCase().includes(text.toLowerCase())
    );
  });
}

//! функция поднятия закрпепленных наверх таблицы
export function funSortedFastened(data, fastenedData) {
  const fd = [];
  fastenedData.map((item) => {
    fd.push(item.workloadId);
  });
  const sortedArray = data.sort((a, b) => {
    const isAInSecondArray = fd.includes(a.id);
    const isBInSecondArray = fd.includes(b.id);
    if (isAInSecondArray && !isBInSecondArray) {
      return -1; // Переместить a вперед
    }
    if (!isAInSecondArray && isBInSecondArray) {
      return 1; // Переместить b вперед
    }
    return 0; // Не изменять порядок, если оба элемента в secondArray или оба не в secondArray
  });
  return sortedArray;
}

//! функция разделения на кафедральный и общеинститутские и сортировки
export function funSplitData(data, isOid) {
  const origData = [...data];
  const sortedUsers = origData
    .slice()
    // .sort((a, b) => a.discipline.localeCompare(b.discipline));
  // закрепленные переносим в начало таблицы
  const filteredData = sortedUsers.filter((item) => item.isOid === isOid);
  return filteredData;
}

//! функция фильтрации на все измененные выделенные и тд
export function funFilterSelected(
  data,
  selectedFilter,
  colored,
  changedData,
  fastenedData
) {
  const origData = [...data];
  if (selectedFilter === "Выделенные" && colored.length > 0) {
    let fd = [];
    fd = origData.filter((item) =>
      colored.some((el) => el.workloadId === item.id)
    );
    if (fd.length > 0) {
      return fd;
    }
    return data;
  } else if (selectedFilter === "Измененные") {
    let fd = [];
    const massId = Object.values(changedData).flat();
    fd = origData.filter((item) => massId.some((el) => el === item.id));
    if (fd.length > 0) {
      return fd;
    } else {
      return data;
    }
  } else if (selectedFilter === "Закрепленные") {
    let fd = [];
    fd = origData.filter((item) =>
      fastenedData.some((el) => el.workloadId === item.id)
    );
    if (fd.length > 0) {
      return fd;
    } else {
      return data;
    }
  } else {
    return data;
  }
}

//! закрепленные строки поднимаем вверх
export function funfastenedDataSort(data, fastenedData) {
  let newData = [...data];
  let items = [];
  fastenedData.forEach((itemId) => {
    const index = newData.findIndex((el) => el.id === itemId);
    if (index !== -1) {
      items.push(newData.splice(index, 1)[0]);
    }
  });

  return [...items, ...newData];
}

//! функция удаления обьекта по id при нажатии на применить удаление
export function deleteItemBuffer(buff, itemId, type) {
  let itemData = null;
  let newBuffer = buff
    .map((item) => {
      if (item.request === type) {
        let p = { ...item };
        itemData = p;
        console.log(p.data.ids);
        p.data.ids = p.data.ids.filter((id) => id !== itemId);
        if (p.data.ids.length > 0) {
          return p;
        } else {
          return null;
        }
      } else {
        return item;
      }
    })
    .filter(Boolean);
  return { buffer: newBuffer, item: itemData };
}

//! функция опредления заблокирован ли tr, чтобы вывести кнопки отмены подтверждения
export const funGetConfirmation = (itemId, changedData, bufferAction) => {
  // при удалении строки
  if (changedData.deleted.find((el) => el === itemId)) {
    return { blocked: true, height: "150px", top: "0", type: 1 };
  }
  // при разделении строки
  else if (changedData.splitjoin.includes(itemId)) {
    let index = 0;
    let length = 0;
    bufferAction.map((item) => {
      if (item.request === "splitWorkload") {
        //при разделении в конец id добавляется index у первого 0 у втрого 1 и тд
        // Number(itemId[itemId.length - 1]) определяет этот индекс
        index = 0;
        if (Number(itemId[itemId.length - 1]) > index) {
          index = Number(itemId[itemId.length - 1]);
        }
        if (item.data.ids.some((e) => e === itemId.slice(0, -1))) {
          length = item.data.n;
        }
      }
    });
    if (index !== -1) {
      return {
        blocked: true,
        height: `${150 * length}px`,
        top: `${-150 * index}px`,
        type: 2,
      };
    } else {
      return { blocked: false, height: "150px", top: "0", type: 0 };
    }
  } else if (changedData.join?.includes(itemId)) {
    const buff = [...bufferAction].filter(
      (el) =>
        el.request === "joinWorkloads" && el.data.ids.some((e) => e === itemId)
    )[0];
    return {
      blocked: true,
      height: "150px",
      top: "0",
      type: 3,
      data: buff,
      workloadId: itemId,
    };
  } else return { blocked: false, height: "150px", top: "0", type: 0 };
};
