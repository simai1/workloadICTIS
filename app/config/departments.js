import { mapObjectKeys } from '../utils/map.js';

const departments = {
    ОИД: 0,
    БИТ: 1,
    ВМ: 2,
    ВТ: 3,
    ИАСБ: 4,
    ИБТКС: 5,
    ИМС: 6,
    'МОП ЭВМ': 7,
    ПиБЖ: 8,
    САИТ: 9,
    САПР: 10,
    СиПУ: 11,
    ФМОИО: 12,
};

export default departments;

export const map = mapObjectKeys(departments);
