//! функция замены преподавательского массива на его имя
export function funFixEducator(data) {
  return data.map((item, index) => ({
    ...item,
    educator: item.educator ? item.educator.name : "0",
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

//! функция разделения на кафедральный и общеинститутские
export function funSplitData(data, isOid) {
  const origData = [...data];
  const sortedUsers = origData
    .slice()
    .sort((a, b) => a.discipline.localeCompare(b.discipline));
  return sortedUsers.filter((item) => item.isOid === isOid);
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
    fd = origData.filter((item) => colored.some((el) => el.id === item.id));
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
    fd = origData.filter((item) => fastenedData.some((el) => el === item.id));
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
    let length = 1;
    bufferAction.map((item) => {
      if (item.request === "splitWorkload") {
        //при разделении в конец id добавляется index у первого 0 у втрого 1 и тд
        // Number(itemId[itemId.length - 1]) определяет этот индекс
        if (Number(itemId[itemId.length - 1]) > index) {
          index = Number(itemId[itemId.length - 1]);
        }
        length = item.data.n;
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
  } else return { blocked: false, height: "150px", top: "0", type: 0 };
};
