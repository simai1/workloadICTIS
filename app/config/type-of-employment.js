const typeOfEmployments = {
    'Внешнее совместительство': 1,
    'Внутреннее совместительство': 2,
    'Основное место работы': 3,
    'Почасовая оплата труда': 4,
};

export default typeOfEmployments;
export const map = Object.keys(typeOfEmployments).reduce(
    (acc, k) => ({
        ...acc,
        [typeOfEmployments[k]]: k,
    }),
    {}
);
