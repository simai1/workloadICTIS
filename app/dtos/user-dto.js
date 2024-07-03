import { map as rolesMap } from '../config/roles.js';
import { map as institutionalAffiliationMap} from '../config/institutional-affiliations.js';
import EducatorDto from "./educator-dto.js";
export default class UserDto {
  login;
  id;
  name;
  role;
  allowedDepartments;
  educator;
  institutionalAffiliation;

  constructor(model) {
    this.login = model.login;
    this.id = model.id;
    this.name = model.name;
    this.role = rolesMap[model.role];
    this.allowedDepartments = model.allowedDepartments;
    this.institutionalAffiliation = institutionalAffiliationMap[model.institutionalAffiliation];
    this.educator = model.Educator ? new EducatorDto(model.Educator) : null;
  }
}
