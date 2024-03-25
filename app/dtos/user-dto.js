import { map as rolesMap } from '../config/roles.js';
export default class UserDto {
  login;
  id;
  name;
  role;

  constructor(model) {
    this.login = model.login;
    this.id = model.id;
    this.name = model.name;
    this.role = rolesMap[model.role];
  }
}
