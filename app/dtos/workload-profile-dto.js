import {map as departmentMap} from "../config/departments.js";
export default class WorkloadProfileDto {
    department;
    workload;
    type;
    curriculumUnit;
    specialty;
    hours;
    hoursFirstPeriod;
    hoursSecondPeriod;
    hoursWithoutPeriod;
    audienceHours;

    constructor(model) {
        this.department = departmentMap[model.department];
        this.workload = model.workload;
        this.type = model.isOid? "ОИД" : "Общеинститутская";
        this.curriculumUnit = model.curriculumUnit;
        this.specialty = model.specialty;
        this.hours = model.hours;
        this.hoursFirstPeriod = model.period === 1? model.hours : 0;
        this.hoursSecondPeriod = model.period === 2? model.hours : 0;
        this.hoursWithoutPeriod = model.period === null? model.hours : 0;
        this.audienceHours = model.audienceHours;
    }
}
