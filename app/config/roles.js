import { mapObjectKeys } from '../utils/map.js';

const roles = {
    METHODIST: 1,
    LECTURER: 2,
    DEPARTMENT_HEAD: 3,
    DIRECTORATE: 4,
    EDUCATOR: 5,
    UNIT_ADMIN: 6,
    DEPUTY_DIRECTORATE: 7,
    DEPUTY_DEPARTMENT_HEAD: 8,
    
};

export default roles;

export const map = mapObjectKeys(roles);
