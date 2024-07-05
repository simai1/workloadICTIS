import { mapObjectKeys } from '../utils/map.js';

const institutionalAffiliations = {
    ИКТИБ: 1,
    ИНЭП: 2,
    ИРТСУ: 3,
};

export default institutionalAffiliations;

export const map = mapObjectKeys(institutionalAffiliations);
