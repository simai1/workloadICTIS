const historyType = {
  Разделенная: 1,
  Объединенная: 2,
  Обновленная: 3,
};

export default historyType;
export const map = Object.keys(historyType).reduce(
  (acc, k) => ({
    ...acc,
    [historyType[k]]: k,
  }),
  {}
);
