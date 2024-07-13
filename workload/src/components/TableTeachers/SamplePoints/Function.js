//! функция фильтрующая данные
export function FilteredSample(data, isChecked) {
  if (isChecked?.length === 0) {
    return [...data];
  }
  return data.filter(
    (item) => !isChecked?.some((el) => el.value === item[el.itemKey]) && item
  );
}
