import User from '../models/user.js';
import { AppErrorInvalid, AppErrorMissing, AppErrorNotExist } from '../utils/errors.js';
import UserDto from '../dtos/user-dto.js';
import Educator from '../models/educator.js';
import departments from '../config/departments.js';
import roles, { map as mapRoles } from '../config/roles.js';
import institutionalAffiliations from '../config/institutional-affiliations.js';

export default {
    async getUser(req, res) {
        if (req.user == null) res.redirect('/');
        const user = await User.findByPk(req.user, { include: Educator });
        if (!user) throw new AppErrorNotExist('user');
        const userDto = new UserDto(user);
        if (user.role !== 1) {
            userDto.educator.departmentId = user.Educator.department;
        }
        res.json(userDto);
    },

    async setUnitAdminDepartments({ body: { userID, departmentsArr }, user }, res) {
        if (!departmentsArr) throw new AppErrorMissing('departmentsArr');
        if (!departmentsArr.every(elem => Object.values(departments).includes(elem))) {
            throw new AppErrorInvalid('departmentsArr');
        }

        const _user = await User.findByPk(userID, { include: Educator }).then(_user =>
            _user.update({ allowedDepartments: departmentsArr })
        );
        const userDto = new UserDto(_user);
        res.json(userDto);
    },

    async updateUser(req, res) {
        const { role, allowedDepartments, institutionalAffiliation, rate, position, department } = req.body;
        if (!role && !allowedDepartments && !institutionalAffiliation && !rate && !position && !department) throw new AppErrorMissing('body');
        if (role && !Object.values(roles).includes(role)) throw new AppErrorInvalid('role');
        if (allowedDepartments && allowedDepartments.some(d => !Object.values(departments).includes(d))) {
            throw new AppErrorInvalid('allowedDepartments');
        }
        if (institutionalAffiliation && !Object.values(institutionalAffiliations).includes(institutionalAffiliation)) {
            throw new AppErrorInvalid('institutionalAffiliation');
        }
        await User.update(
            {
                role,
                allowedDepartments,
                institutionalAffiliation,
            },
            {
                where: { id: req.params.id },
            }
        );
        await Educator.update({ rate, position, department }, { where: { userId: req.params.id } });
        res.json({ status: 'OK' });
    },

    async getAll(req, res) {
        const users = await User.findAll({ include: [{ model: Educator }] });
        const usersDtos = users.map(user => new UserDto(user));
        res.json(usersDtos);
    },

    async getRoles(req, res){
        res.json(mapRoles);
    }
};
