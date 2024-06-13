import { mapObjectKeys } from '../utils/map.js';

const colors = {
    'Без цвета': 1,
    Желтый: 2,
    Синий: 3,
    Зеленый: 4,
    Разделенная: 5,
    Объединенная: 6,
};

export default colors;

export const map = mapObjectKeys(colors);
