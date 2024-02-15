export default class UserDto {
  login;
  id;
  name;

  constructor(model) {
    this.login = model.login;
    this.id = model.id;
    this.name = model.name;
  }
}
