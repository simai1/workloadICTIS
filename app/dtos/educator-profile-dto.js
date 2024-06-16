import { map as positionsMap } from '../config/position.js';
import { map as departmentsMap } from '../config/departments.js';

export default class EducatorProfileDto {
  id;
  name;
  position;
  department;
  rate;
  totalHours;
  workloads;
  maxHours;
  constructor(model) {
    this.id = model.id;
    this.name = model.name;
    this.position = positionsMap[model.position];
    this.department = departmentsMap[model.department];
    this.rate = model.rate;
    this.totalHours = model.SummaryWorkload.totalHours;
    this.maxHours = model.maxHours;
    this.workloads = [];
  }
}
