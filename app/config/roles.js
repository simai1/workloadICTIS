import { mapObjectKeys } from '../utils/map.js';

const roles = {
    METHODIST: 1,
    LECTURER: 2,
    DEPARTMENT_HEAD: 3,
    DIRECTORATE: 4,
    EDUCATOR: 5,
};

export default roles;

export const map = mapObjectKeys(roles);
