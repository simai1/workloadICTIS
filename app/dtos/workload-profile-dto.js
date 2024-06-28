import {map as departmentMap} from "../config/departments.js";
export default class WorkloadProfileDto {
    department;
    discipline;
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
        this.discipline = model.discipline;
        this.workload = model.workload;
        this.type = model.isOid? "ОИД" : "Общеинститутская";
        this.curriculumUnit = model.curriculumUnit;
        this.specialty = model.specialty;
        this.hours = model.hours;
        this.hoursFirstPeriod = model.period === 1? Math.round(model.hours * 100) / 100 : 0;
        this.hoursSecondPeriod = model.period === 2? Math.round(model.hours * 100) / 100 : 0;
        this.hoursWithoutPeriod = model.period === null? Math.round(model.hours * 100) / 100 : 0;
        this.audienceHours = Math.round(model.audienceHours * 100) / 100;
    }
}
