import EducatorDto from './educator-dto.js';
import { map as departmentsMap } from '../config/departments.js';

export default class MaterialsModelDto {
  id;
  number;
  fields;
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
  numberOfStudents;
  hours;
  audienceHours;
  ratingControlHours;
  isSplit;
  isMerged;
  educator;
  createdAt;
  audiences;
  isBlocked;
  notes;

  constructor(model) {
    this.id = model.id;
    this.number = model.number;
    this.department = departmentsMap[model.department];
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
    this.numberOfStudents = model.numberOfStudents;
    this.hours = model.hours;
    this.audienceHours = model.audienceHours;
    this.ratingControlHours = model.ratingControlHours;
    this.isSplit = model.isSplit;
    this.isMerged = model.isMerged;
    this.educator = model.Educator ? new EducatorDto(model.Educator) : null;
    this.createdAt = model.createdAt;
    this.audiences = model.audiences;
    this.isBlocked = model.isBlocked;
    this.notes = model.notes;
  }
}
