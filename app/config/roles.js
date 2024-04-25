import { mapObjectKeys } from '../utils/map.js';

const roles = {
    Методист: 1,
    Лектор: 2,
    'Заведующий кафедрой': 3,
    Дирекция: 4,
    Преподаватель: 5,
};

export default roles;

export const map = mapObjectKeys(roles);
