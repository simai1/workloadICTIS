import User from "../models/user.js";
import { AppErrorInvalid, AppErrorMissing, AppErrorNotExist } from "../utils/errors.js";
import UserDto from "../dtos/user-dto.js";
import Educator from "../models/educator.js";
import departments from "../config/departments.js";


export default {
    async getUser(req, res) {
      if (req.user == null) res.redirect('/');
      const user = await User.findByPk(req.user, { include: Educator });
      if (!user) throw new AppErrorNotExist('user');
      const userDto = new UserDto(user);
      res.json(userDto);
    },

    async setUnitAdminDepartments({ body: { userID, departmentsArr }, user }, res) {
      if (!departmentsArr) throw new AppErrorMissing('departmentsArr');
      if (!departmentsArr.every(elem => Object.values(departments).includes(elem))) throw new AppErrorInvalid('departmentsArr');

      const _user = await User.findByPk(userID, {include: Educator}).then(_user => _user.update({ allowedDepartments: departmentsArr }));
      const userDto = new UserDto(_user);
      res.json(userDto);
    },
};
