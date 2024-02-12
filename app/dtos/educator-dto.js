export default class EducatorDto {
  id;
  name;
  position;
  typeOfEmployment;
  rate;
  maxHours;
  recommendedMaxHours;
  minHours;
  constructor(model) {
    this.id = model.id;
    this.name = model.name;
    this.position = model.position;
    this.typeOfEmployment = model.typeOfEmployment;
    this.rate = model.rate;
    this.maxHours = model.maxHours;
    this.recommendedMaxHours = model.recommendedMaxHours;
    this.minHours = model.minHours;
  }
}
