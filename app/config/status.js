import { mapObjectKeys } from '../utils/map.js';

const status = {
    pending: 1,
    introduced: 2,
    decline: 3,
    confirmed: 4,
    reject: 5,
};

export default status;

export const map = mapObjectKeys(status);
