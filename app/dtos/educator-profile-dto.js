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
    this.position = model.position;
    this.typeOfEmployment = model.typeOfEmployment;
    this.department = model.department;
    this.rate = model.rate;
    this.totalHours = model.SummaryWorkload.totalHours;
    this.workloads = [];
  }
}
