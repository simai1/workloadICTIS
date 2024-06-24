import { mapObjectKeys } from '../utils/map.js';

const institutionalAffiliation = {
    ИКТИБ: 1,
    ИНЕП: 2,
    ИРТСУ: 3,
};

export default institutionalAffiliation;

export const map = mapObjectKeys(institutionalAffiliation);
