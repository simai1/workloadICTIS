import { map as positionsMap } from '../config/position.js';
import { map as typeMap } from '../config/type-of-employment.js';
import { map as departmentsMap } from '../config/departments.js';

export default class EducatorListDto {
    id;
    name;
    position;
    department;
    rate;
    totalHours;
    hoursFirstPeriod;
    hoursSecondPeriod;
    hoursWithoutPeriod;
    constructor(model) {
        this.id = model.id;
        this.name = model.name;
        this.position = positionsMap[model.position];
        this.department = departmentsMap[model.department];
        this.rate = model.rate;
        this.totalHours = model.SummaryWorkload.totalHours;
        this.hoursFirstPeriod = model.SummaryWorkload.kafedralAutumnWorkload + model.SummaryWorkload.instituteAutumnWorkload;
        this.hoursSecondPeriod = model.SummaryWorkload.kafedralSpringWorkload + model.SummaryWorkload.instituteSpringWorkload;
        this.hoursWithoutPeriod = model.SummaryWorkload.kafedralAdditionalWorkload + model.SummaryWorkload.instituteManagementWorkload;
    }
}
