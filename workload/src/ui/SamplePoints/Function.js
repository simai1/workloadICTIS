//! функция фильтрующая данные
export function FilteredSample(data, isChecked, itemKey) {
  if (isChecked.length === 0) {
    return [...data];
  }
  return data.filter((item) => !isChecked.includes(item[itemKey]));
}
