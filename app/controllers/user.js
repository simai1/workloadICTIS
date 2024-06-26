import User from "../models/user.js";
import { AppErrorInvalid, AppErrorMissing, AppErrorNotExist } from "../utils/errors.js";
import UserDto from "../dtos/user-dto.js";
import Educator from "../models/educator.js";
import departments from "../config/departments.js";
import roles from "../config/roles.js";
import {institutionalAffiliation as instAf} from "../config/institutional-affiliation.js";


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

    async updateUser(req, res){
      const {role, allowedDepartments, institutionalAffiliation} = req.body;
      if (!role && !allowedDepartments && !institutionalAffiliation) throw new AppErrorMissing('body');
      if (!Object.values(roles).includes(role)) throw new AppErrorInvalid('role');
      if (allowedDepartments.some(d => !Object.values(departments).includes(d))) throw new AppErrorInvalid('allowedDepartments');
      if (!Object.values(instAf).includes(institutionalAffiliation)) throw new AppErrorInvalid('institutionalAffiliation');
      const user = User.update({role, allowedDepartments, institutionalAffiliation}, {where: { id: req.user }});
      const userDto = new UserDto(user);
      res.json(userDto);
    },

    async getAll(req, res){
      const users = await User.findAll();
      const usersDtos = users.map(user => new UserDto(user));
      res.json(usersDtos);
    },
};
