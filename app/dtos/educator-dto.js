import { map as positionsMap } from '../config/position.js';
import { map as typeMap } from '../config/type-of-employment.js';
import { map as departmentsMap } from '../config/departments.js';

export default class EducatorDto {
    id;
    name;
    position;
    typeOfEmployment;
    department;
    rate;
    maxHours;
    recommendedMaxHours;
    minHours;

    constructor(model) {
        this.id = model.id;
        this.name = model.name;
        this.position = positionsMap[model.position];
        this.typeOfEmployment = typeMap[model.typeOfEmployment];
        this.rate = model.rate;
        this.maxHours = model.maxHours;
        this.recommendedMaxHours = model.recommendedMaxHours;
        this.minHours = model.minHours;
        this.department = departmentsMap[model.department];
    }
}
