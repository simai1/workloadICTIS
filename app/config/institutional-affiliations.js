import { mapObjectKeys } from '../utils/map.js';

const institutionalAffiliations = {
    ИКТИБ: 1,
    ИНЭП: 2,
    ИРТСУ: 3,
};

export const instituteDepartments = {
    1: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    2: [13, 14, 15, 16],
    3: [17, 18, 19, 20, 21, 22, 23, 24],
};

export default institutionalAffiliations;

export const map = mapObjectKeys(institutionalAffiliations);
