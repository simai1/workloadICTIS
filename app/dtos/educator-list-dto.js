import { map as positionsMap } from '../config/position.js';
import { map as departmentsMap } from '../config/departments.js';
import { map as typeOfEmploymentMap} from '../config/type-of-employment.js';

export default class EducatorListDto {
    id;
    name;
    position;
    department;
    rate;
    typeOfEmployment;
    maxHours;
    recommendedMaxHours;
    minHours;
    kafedralAutumnWorkload;
    kafedralSpringWorkload;
    kafedralAdditionalWorkload;
    instituteAutumnWorkload;
    instituteSpringWorkload;
    instituteManagementWorkload;
    totalKafedralHours;
    totalOidHours;
    totalHours;

    constructor(model) {
        this.id = model.id;
        this.name = model.name;
        this.position = positionsMap[model.position];
        this.department = departmentsMap[model.department];
        this.rate = model.rate;
        this.typeOfEmployment = typeOfEmploymentMap[model.typeOfEmployment];
        this.maxHours = model.maxHours;
        this.recommendedMaxHours = model.recommendedMaxHours;
        this.minHours = model.minHours;
        this.totalHours = Math.round(model.SummaryWorkload.totalHours * 100) / 100;
        this.kafedralAutumnWorkload = Math.round(model.SummaryWorkload.kafedralAutumnWorkload * 100) / 100;
        this.kafedralSpringWorkload = Math.round(model.SummaryWorkload.kafedralSpringWorkload * 100) / 100;
        this.kafedralAdditionalWorkload = this.hoursFirstPeriod =
            Math.round(model.SummaryWorkload.kafedralAdditionalWorkload * 100) / 100;
        this.instituteAutumnWorkload = Math.round(model.SummaryWorkload.instituteAutumnWorkload * 100) / 100;
        this.instituteSpringWorkload = Math.round(model.SummaryWorkload.instituteSpringWorkload * 100) / 100;
        this.instituteManagementWorkload = Math.round(model.SummaryWorkload.instituteManagementWorkload * 100) / 100;
        this.totalKafedralHours = Math.round(model.SummaryWorkload.totalKafedralHours * 100) / 100;
        this.totalOidHours = Math.round(model.SummaryWorkload.totalOidHours * 100) / 100;
    }
}
