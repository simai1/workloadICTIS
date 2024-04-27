//! функция замены преподавательского массива на его имя
export function funFixEducator(data) {
  return data.map((item) => ({
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

export function funSplitData(data, isOid) {
  const origData = [...data];
  return origData.filter((item) => item.isOid === isOid);
}
