import { map as positionsMap } from '../config/position.js';
import { map as departmentsMap } from '../config/departments.js';
import { map as typeOfEmploymentMap} from '../config/type-of-employment.js';

export default class EducatorDto {
    id;
    name;
    position;
    department;
    rate;
    typeOfEmployment;
    maxHours;
    recommendedMaxHours;
    minHours;

    constructor(model) {
        this.id = model.id;
        this.name = model.name;
        this.position = positionsMap[model.position];
        this.rate = model.rate;
        this.typeOfEmployment = typeOfEmploymentMap[model.typeOfEmployment];
        this.maxHours = model.maxHours;
        this.recommendedMaxHours = model.recommendedMaxHours;
        this.minHours = model.minHours;
        this.department = departmentsMap[model.department];
    }
}
