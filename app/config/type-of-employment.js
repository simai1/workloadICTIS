import { mapObjectKeys } from '../utils/map.js';

const typeOfEmployments = {
    'Внешнее совместительство': 1,
    'Внутреннее совместительство': 2,
    'Основное место работы': 3,
    'Почасовая оплата труда': 4,
};

export default typeOfEmployments;

export const map = mapObjectKeys(typeOfEmployments);