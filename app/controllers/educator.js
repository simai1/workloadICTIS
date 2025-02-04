import Educator from '../models/educator.js';
import EducatorDto from '../dtos/educator-dto.js';
import { AppErrorAlreadyExists, AppErrorForbiddenAction, AppErrorMissing, AppErrorNotExist } from '../utils/errors.js';
import { map as mapPositions } from '../config/position.js';
import associateEducator from '../utils/associate-educator.js';
import SummaryWorkload from '../models/summary-workload.js';
import EducatorListDto from '../dtos/educator-list-dto.js';
import User from '../models/user.js';
import EducatorProfileDto from '../dtos/educator-profile-dto.js';
import Workload from '../models/workload.js';
import departments from '../config/departments.js';
import WorkloadProfileDto from '../dtos/workload-profile-dto.js';
import { instituteDepartments } from '../config/institutional-affiliations.js';

const orderRule = [
    ['department', 'ASC'],
    ['name', 'ASC'],
];

export default {
    async getAll(req, res) {
        const _user = await User.findByPk(req.user);
        const { col, type } = req.query;
        let educators;
        if (_user.role === 4 || _user.role === 7) {
            if (!_user.institutionalAffiliation) {
                throw new Error('Нет привязки (institutionalAffiliation) к институту у директора');
            }
            const allowedDepartments = instituteDepartments[_user.institutionalAffiliation];
            // const allowedDepartments = [];

            // const start = _user.institutionalAffiliation === 1 ? 0 : _user.institutionalAffiliation === 2 ? 13 : 17;
            // const end = _user.institutionalAffiliation === 1 ? 12 : _user.institutionalAffiliation === 2 ? 16 : 24;
            //
            // for (let i = start; i <= end; i++) {
            //     allowedDepartments.push(i);
            // }

            educators = await Educator.findAll({
                where: {
                    department: allowedDepartments,
                },
                include: [
                    {
                        model: SummaryWorkload,
                    },
                ],
                order: orderRule,
            });
        } else if (_user.role === 6) {
            educators = await Educator.findAll({
                where: {
                    department: _user.allowedDepartments,
                },
                include: [
                    {
                        model: SummaryWorkload,
                    },
                ],
                order: orderRule,
            });
        } else {
            const allowedDepartments = [];

            const start = 0;
            const end = 35;

            for (let i = start; i <= end; i++) {
                allowedDepartments.push(i);
            }
            educators = await Educator.findAll({
                where: {
                    department: allowedDepartments,
                },
                include: [
                    {
                        model: SummaryWorkload,
                    },
                ],
                order: orderRule,
            });
        }

        const educatorDtos = [];
        for (const educator of educators) {
            const educatorDto = new EducatorListDto(educator);
            educatorDtos.push(educatorDto);
        }

        if (col && type) {
            educatorDtos.sort((a, b) => {
                if (a[col] > b[col]) {
                    return type === 'asc' ? 1 : -1;
                } else if (a[col] < b[col]) {
                    return type === 'asc' ? -1 : 1;
                }
                return 0;
            });
        }

        if (!educatorDtos.length) {
            // Если нет преподавателей, отправляем 404 и выходим из функции
            return res.status(404).json('Educator not found');
        }
        res.json(educatorDtos);
    },

    async getOne({ params: { educatorId } }, res) {
        if (!educatorId) throw new AppErrorMissing('educatorId');
        const educator = await Educator.findOne({
            where: { id: educatorId },
            include: {
                model: SummaryWorkload,
            },
        });
        if (!educator) throw new AppErrorNotExist('educator');
        const educatorProfileDto = new EducatorListDto(educator);

        res.json(educatorProfileDto);
    },

    async getOneByEmail({params: { email }}, res) {
        if (!email) throw new AppErrorMissing('email');
        const educator = await Educator.findOne({
            where: { email },
            include: [{
                model: SummaryWorkload,
            }],
        });
        if (!educator) throw new AppErrorNotExist('educator');
        const educatorProfileDto = new EducatorListDto(educator);

        res.json(educatorProfileDto);
    },

    async getOneLK({ params: { educatorId } }, res) {
        if (!educatorId) throw new AppErrorMissing('educatorId');
        const educator = await Educator.findOne({
            where: { id: educatorId },
            include: {
                model: SummaryWorkload,
            },
        });
        if (!educator) throw new AppErrorNotExist('educator');
        const educatorProfileDto = new EducatorProfileDto(educator);

        const workloads = await Workload.findAll({
            where: {
                educatorId,
            },
        });
        console.log(workloads.length);
        const workloadsDto = [];
        let flag;
        for (const workload of workloads) {
            flag = true;
            for (const workloadDto of workloadsDto) {
                if (
                    departments[workloadDto.department] === workload.department &&
                    workloadDto.discipline === workload.discipline &&
                    workloadDto.workload === workload.workload
                ) {
                    workloadDto.hoursFirstPeriod += workload.period === 1 ? workload.hours : 0;
                    workloadDto.hoursSecondPeriod += workload.period === 2 ? workload.hours : 0;
                    workloadDto.hoursWithoutPeriod += workload.period === 0 ? workload.hours : 0;

                    // ориентировочно часы это сумма 3 столбиков этих (уточнить)
                    workloadDto.hours = workloadDto.hoursFirstPeriod + workloadDto.hoursSecondPeriod + workloadDto.hoursWithoutPeriod;
                    flag = false;
                    break;
                }
            }
            if (flag) workloadsDto.push(new WorkloadProfileDto(workload));
        }

        educatorProfileDto.workloads.push(workloadsDto);

        res.json({
            ...educatorProfileDto,
            totalHours: educator.SummaryWorkload.totalHours,
            totalKafedralHours: educator.SummaryWorkload.totalKafedralHours,
            totalOidHours: educator.SummaryWorkload.totalOidHours,
            kafedralAdditionalWorkload: educator.SummaryWorkload.kafedralAdditionalWorkload,
        });
    },

    // Обновляем данные преподователя
    async update({ params: { educatorId }, body: { name, position, rate, email, department, typeOfEmployment } }, res) {
        if (!educatorId) throw new AppErrorMissing('educatorId');
        const educator = await Educator.findByPk(educatorId);
        if (!educator) throw new AppErrorNotExist('educator');
        if (!name && !position && !rate) throw new AppErrorMissing('body');
        if (!name) name = educator.name;
        if (!position) position = educator.position;
        if (!rate && rate !== 0) rate = educator.rate;
        if (!email) email = educator.email;
        if (!department && department !== 0) department = educator.department;
        if (!typeOfEmployment) typeOfEmployment = educator.typeOfEmployment;
        console.log(rate);
        await educator.update({
            name,
            position,
            rate,
            email,
            department,
            typeOfEmployment,
        });

        res.json(educator);
    },
    // Создаем преподователя
    async create({ body: { name, position, rate, email, department, typeOfEmployment }, user }, res) {
        if (!name) throw new AppErrorMissing('name');
        if (!position) throw new AppErrorMissing('position');
        if (!rate && rate !== 0) throw new AppErrorMissing('rate');
        if (!email) throw new AppErrorMissing('email');
        if (!department) throw new AppErrorMissing('department');
        if (!typeOfEmployment) throw new AppErrorMissing('typeOfEmployment');
        const checkEducator = await Educator.findOne({ where: { email } });
        if (checkEducator) throw new AppErrorAlreadyExists('educator');

        const educator = await Educator.create({
            name,
            email,
            position,
            rate,
            department,
            typeOfEmployment,
        });
        const educatorDto = new EducatorDto(educator);
        try {
            const _user = await User.findOne({ where: { email } });
            if (_user) await associateEducator(_user);
        } catch (e) {
            console.log('Educator is not associated');
        }
        res.json(educatorDto);
    },

    async getPositions(params, res) {
        res.json(mapPositions);
    },

    async deleteEducator({ params: { educatorId }, user }, res) {
        if (!educatorId) throw new AppErrorMissing('educatorId');

        const educator = await Educator.findByPk(educatorId);

        if (educator.userId === user) throw AppErrorForbiddenAction();

        if (!educator) {
            return res.status(404).json('Educator not found');
        }

        await educator.destroy({ force: true });

        res.status(200).json('Successfully deleted');
    },

    async getEducatorsByDepartment(req, res) {
        const userId = req.user;
        const educator = await Educator.findOne({
            where: { userId },
            include: [{ model: User }],
        });
        let educators;
        if (educator.User.role === 6) {
            educators = await Educator.findAll({
                where: { department: educator.User.allowedDepartments },
                include: [
                    {
                        model: SummaryWorkload,
                    },
                ],
                order: orderRule,
            });
        } else {
            const department = educator.department;

            educators = await Educator.findAll({
                where: { department },
                include: [
                    {
                        model: SummaryWorkload,
                    },
                ],
                order: orderRule,
            });
        }
        const educatorsDto = educators.map(educator => new EducatorListDto(educator));
        res.json(educatorsDto);
    },

    async getEducatorsByInstitute(req, res) {
        const userId = req.user;
        const educator = await Educator.findOne({
            where: { userId },
            include: [{ model: User }],
        });
        const educators = await Educator.findAll({
            where: { department: instituteDepartments[educator.User.institutionalAffiliation] },
            include: [
                {
                    model: SummaryWorkload,
                },
            ],
            order: [['name', 'ASC']],
        });
        const educatorsDto = educators.map(educator => new EducatorListDto(educator));
        res.json(educatorsDto);
    },
};
