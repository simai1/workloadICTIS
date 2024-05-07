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
  return origData.filter((item) => item.isOid === isOid);
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
