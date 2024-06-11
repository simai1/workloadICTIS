import { map as positionsMap } from '../config/position.js';
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
        this.hoursFirstPeriod =
            Math.round(
                (model.SummaryWorkload.kafedralAutumnWorkload +
                    model.SummaryWorkload.instituteAutumnWorkload +
                    Number.EPSILON) *
                    100
            ) / 100;
        this.hoursSecondPeriod =
            Math.round(
                (model.SummaryWorkload.kafedralSpringWorkload +
                    model.SummaryWorkload.instituteSpringWorkload +
                    Number.EPSILON) *
                    100
            ) / 100;
        this.hoursWithoutPeriod =
            Math.round(
                (model.SummaryWorkload.kafedralAdditionalWorkload +
                    model.SummaryWorkload.instituteManagementWorkload +
                    Number.EPSILON) *
                    100
            ) / 100;
    }
}
