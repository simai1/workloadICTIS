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
  totalHours;
  workloads;
  constructor(model) {
    this.id = model.id;
    this.name = model.name;
    this.position = positionsMap[model.position];
    this.typeOfEmployment = typeMap[model.typeOfEmployment];
    this.department = departmentsMap[model.department];
    this.rate = model.rate;
    this.totalHours = model.SummaryWorkload.totalHours;
    this.workloads = [];
  }
}
