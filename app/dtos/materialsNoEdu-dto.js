export default class MaterialsNoEduDto {
    department;
    discipline;
    workload;
    groups;
    block;
    semester;
    period;
    curriculum;
    curriculumUnit;
    formOfEducation;
    levelOfTraining;
    specialty;
    core;
    hours;
    audienceHours;
    ratingControlHours;

    constructor(model) {
        this.department = model.department;
        this.discipline = model.discipline;
        this.workload = model.workload;
        this.groups = model.groups;
        this.block = model.block;
        this.semester = model.semester;
        this.period = model.period;
        this.curriculum = model.curriculum;
        this.curriculumUnit = model.curriculumUnit;
        this.formOfEducation = model.formOfEducation;
        this.levelOfTraining = model.levelOfTraining;
        this.specialty = model.specialty;
        this.core = model.core;
        this.hours = model.hours;
        this.audienceHours = model.audienceHours;
        this.ratingControlHours = model.ratingControlHours;
    }
}
