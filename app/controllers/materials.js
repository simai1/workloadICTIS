import Workload from '../models/workload.js';
import { Sequelize, Op } from 'sequelize';
import Educator from '../models/educator.js';
import MaterialsDto from '../dtos/materials-dto.js';
import Materials from '../models/materials.js';
import { map as mapDepartments } from '../config/departments.js';
import { AppErrorInvalid, AppErrorMissing, AppErrorNotExist } from '../utils/errors.js';
import MaterialsModelDto from '../dtos/materialModel-dto.js';
import User from '../models/user.js';
import { instituteDepartments } from '../config/institutional-affiliations.js';
import sendMail from '../services/email.js';
import prepare from '../utils/prepare.js';
import pick from '../utils/pick.js';
import MaterialsNoEduDto from '../dtos/materialsNoEdu-dto.js';

const orderRule = [['number', 'ASC']];

export default {
    async sync(req, res) {
        let { departments } = req.query;
        let workloads;
        if (!departments) {
            workloads = await Workload.findAll({
                where: {
                    audienceHours: { [Op.ne]: 0 },
                    educatorId: { [Op.ne]: null },
                },
                include: [{ model: Educator }],
            });
        } else {
            departments = departments.split(',').map(d => parseInt(d));
            workloads = await Workload.findAll({
                where: {
                    audienceHours: { [Op.ne]: 0 },
                    educatorId: { [Op.ne]: null },
                    department: departments,
                },
                include: [{ model: Educator }],
            });
        }
        const materials = [...new Set(workloads.map(w => JSON.stringify(new MaterialsDto(w))))];
        const uniqueWorkloads = [];
        let wmat;
        workloads.forEach(w => {
            wmat = JSON.stringify(new MaterialsDto(w));
            if (materials.includes(wmat)) {
                uniqueWorkloads.push(w);
                delete materials[materials.indexOf(wmat)];
            }
        });
        await Materials.bulkCreate(
            uniqueWorkloads.map(w =>
                Object({
                    fields: JSON.stringify(new MaterialsDto(w)),
                    department: w.department,
                    discipline: w.discipline,
                    workload: w.workload,
                    groups: w.groups,
                    block: w.block,
                    semester: w.semester,
                    period: w.period,
                    curriculum: w.curriculum,
                    curriculumUnit: w.curriculumUnit,
                    formOfEducation: w.formOfEducation,
                    levelOfTraining: w.levelOfTraining,
                    specialty: w.specialty,
                    core: w.core,
                    numberOfStudents: w.numberOfStudents,
                    hours: w.hours,
                    audienceHours: w.audienceHours,
                    ratingControlHours: w.ratingControlHours,
                    isSplit: w.isSplit,
                    isMerged: w.isMerged,
                    educatorId: w.educatorId,
                    notes: w.notes ? w.notes : '',
                })
            ),
            { ignoreDuplicates: true }
        );

        // check actual
        const materialsDB = await Materials.findAll({});
        const wmatsDB = [...workloads.map(w => new MaterialsNoEduDto(w))];
        for (const wmatDB of wmatsDB) {
            const matchMaterials = materialsDB.filter(m =>
                Object.keys(wmatDB).every(key => {
                    return (
                        m[key] === wmatDB[key] && ['Практические', 'Лекционные', 'Лабораторные'].includes(m.workload)
                    );
                })
            );
            if (matchMaterials.length >= 2) {
                matchMaterials.sort((a, b) => {
                    return new Date(b.createdAt).getTime() + new Date(a.createdAt).getTime();
                });
                // matchMaterials.forEach(m => process.stdout.write(`${new Date(m.createdAt).getTime()}; `))
                for (const m of matchMaterials) {
                    // process.stdout.write(`'${m.id}', `);
                    if (
                      (new Date(m.createdAt).getTime()) <
                      (new Date(matchMaterials[matchMaterials.length - 1].createdAt).getTime())
                    ) {
                        m.isActual = false;
                        await m.save();
                    }
                }
                // console.log();
            }
        }

        res.json({ status: 'OK' });
    },

    async deleteMaterial(req, res) {
        const { materialId } = req.params;
        if (!materialId) throw new AppErrorMissing('materialId');
        await Materials.destroy({ where: { id: materialId } });
        res.json({ status: 'OK' });
    },

    async getAll(req, res) {
        let { departments, col, type } = req.query;
        const filter = prepare(
            pick(req.query, [
                'number',
                'department',
                'discipline',
                'workload',
                'groups',
                'block',
                'semester',
                'period',
                'curriculum',
                'curriculumUnit',
                'formOfEducation',
                'levelOfTraining',
                'specialty',
                'core',
                'numberOfStudents',
                'hours',
                'audienceHours',
                'ratingControlHours',
                'educator',
                'notes',
                'audiences',
                'createdAt',
                'isActual',
            ])
        );

        const whereParams = {};
        Object.keys(filter).forEach(k =>
            k !== 'educator' ? (whereParams[k] = filter[k]) : (whereParams['$Educator.name$'] = filter[k])
        );
        console.log(whereParams);
        const { limit, offset } = req.body;
        const pagination = {
            limit,
            offset,
        };
        const user = await User.findByPk(req.user, { include: [{ model: Educator }] });
        let materials;
        if ([1, 9, 10].includes(user.role)) {
            // METHODIST & GOD & GIGA_ADMIN
            if (!departments) {
                materials = await Materials.findAll({
                    order: col && type ? [[col, type.toUpperCase()]] : orderRule,
                    attributes: { exclude: ['fields'] },
                    include: [{ model: Educator }],
                    ...(limit && offset ? pagination : {}),
                    where: whereParams,
                });
            } else {
                departments = departments.split(',').map(d => parseInt(d));
                materials = await Materials.findAll({
                    where: { [Op.and]: [{ department: departments }, whereParams] },
                    attributes: { exclude: ['fields'] },
                    include: [{ model: Educator }],
                    order: col && type ? [[col, type.toUpperCase()]] : orderRule,
                    ...(limit && offset ? pagination : {}),
                });
            }
        } else if ([4, 7].includes(user.role)) {
            // DIRECTORATE & DEPUTY_DIRECTORATE
            if (!departments) {
                materials = await Materials.findAll({
                    where: {
                        [Op.and]: [{ department: instituteDepartments[user.institutionalAffiliation] }, whereParams],
                    },
                    order: col && type ? [[col, type.toUpperCase()]] : orderRule,
                    attributes: { exclude: ['fields'] },
                    include: [{ model: Educator }],
                    ...(limit && offset ? pagination : {}),
                });
            } else {
                departments = departments.split(',').map(d => parseInt(d));
                if (!departments.every(d => instituteDepartments[user.institutionalAffiliation].includes(d))) {
                    throw new AppErrorInvalid('departments');
                }
                materials = await Materials.findAll({
                    where: { [Op.and]: [{ department: departments }, whereParams] },
                    attributes: { exclude: ['fields'] },
                    include: [{ model: Educator }],
                    order: col && type ? [[col, type.toUpperCase()]] : orderRule,
                    ...(limit && offset ? pagination : {}),
                });
            }
        } else if ([3, 8].includes(user.role)) {
            // DEPARTMENT_HEAD & DEPUTY_DEPARTMENT_HEAD
            materials = await Materials.findAll({
                where: {
                    [Op.and]: [
                        { [Op.or]: [{ department: user.Educator.department }, { educatorId: user.Educator.id }] },
                        whereParams,
                    ],
                },
                attributes: { exclude: ['fields'] },
                include: [{ model: Educator }],
                order: col && type ? [[col, type.toUpperCase()]] : orderRule,
                ...(limit && offset ? pagination : {}),
            });
        } else if (user.role === 6) {
            // UNIT_ADMIN
            materials = await Materials.findAll({
                where: { [Op.and]: [{ department: user.allowedDepartments }, whereParams] },
                attributes: { exclude: ['fields'] },
                include: [{ model: Educator }],
                order: col && type ? [[col, type.toUpperCase()]] : orderRule,
                ...(limit && offset ? pagination : {}),
            });
            if (!departments) {
                materials = await Materials.findAll({
                    where: { [Op.and]: [{ department: user.allowedDepartments }, whereParams] },
                    attributes: { exclude: ['fields'] },
                    order: col && type ? [[col, type.toUpperCase()]] : orderRule,
                    include: [{ model: Educator }],
                    ...(limit && offset ? pagination : {}),
                });
            } else {
                departments = departments.split(',').map(d => parseInt(d));
                if (!departments.every(d => user.allowedDepartments.includes(d))) {
                    throw new AppErrorInvalid('departments');
                }
                materials = await Materials.findAll({
                    where: { [Op.and]: [{ department: departments }, whereParams] },
                    attributes: { exclude: ['fields'] },
                    include: [{ model: Educator }],
                    order: col && type ? [[col, type.toUpperCase()]] : orderRule,
                    ...(limit && offset ? pagination : {}),
                });
            }
        } else if ([2, 5].includes(user.role)) {
            // LECTURER & EDUCATOR
            materials = await Materials.findAll({
                where: { [Op.and]: [{ educatorId: user.Educator.id }, whereParams] },
                attributes: { exclude: ['fields'] },
                include: [{ model: Educator }],
                order: col && type ? [[col, type.toUpperCase()]] : orderRule,
                ...(limit && offset ? pagination : {}),
            });
        }
        const materialsDto = materials.map(m => new MaterialsModelDto(m));
        res.json(materialsDto);
    },

    async update(req, res) {
        const { notes, groups, audiences, ids } = req.body;
        if (!ids) throw new AppErrorMissing('materialId');
        // if (!notes && !groups) throw new AppErrorMissing('body');
        await Materials.update(
            {
                notes,
                groups,
                audiences,
            },
            { where: { id: ids } }
        );
        res.json({ status: 'OK' });
    },

    async blockMaterials(req, res) {
        const { department } = req.body;
        await Materials.update(
            { isBlocked: true },
            {
                where: {
                    department,
                },
            }
        );
        if (process.env.NODE_ENV === 'production') {
            const methodists = await User.findAll({ where: { role: 1 } });
            for (const methodist of methodists) {
                sendMail(
                    methodist.login,
                    'blockingMaterials',
                    department === 0 ? 'Общеинститутская нагрузка' : `${mapDepartments[department]}`
                );
            }
        } else {
            sendMail(
                process.env.EMAIL_RECIEVER,
                'blockingMaterials',
                department === 0 ? 'Общеинститутская нагрузка' : `${mapDepartments[department]}`
            );
        }

        res.json({ status: 'OK' });
    },

    async unblockMaterials(req, res) {
        const { department } = req.body;
        await Materials.update(
            { isBlocked: false },
            {
                where: {
                    department,
                },
            }
        );

        if (process.env.NODE_ENV === 'production') {
            const recievers = await User.findAll({
                where: {
                    role: { [Op.in]: [3, 8] },
                },
                include: [
                    {
                        model: Educator,
                        where: {
                            department,
                        },
                    },
                ],
            });
            for (const reciever of recievers) {
                sendMail(reciever.login, 'unblockingMaterials');
            }
        } else {
            sendMail(process.env.EMAIL_RECIEVER, 'unblockingMaterials');
        }

        res.json({ status: 'OK' });
    },

    async getUsableDepartments(req, res) {
        const userId = req.user;
        console.log(userId);
        const checkUser = await User.findByPk(userId);
        if (!checkUser) throw new AppErrorNotExist('User');
        const role = checkUser.role;
        const usableDepartments = [];

        if (role === 2 || role === 3 || role === 5 || role === 8) {
            const educator = await Educator.findOne({ where: { userId } });
            const department = educator.department;
            const materials = await Materials.findOne({ where: { department } });
            if (materials) {
                usableDepartments.push({
                    id: department,
                    isBlocked: materials.isBlocked,
                    name: mapDepartments[department],
                });
            }
        } else if (role === 6) {
            const allowedDepartments = checkUser.allowedDepartments;
            const departments = await Materials.findAll({
                attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('department')), 'department']],
                order: [['department', 'ASC']],
            });
            for (const usableDepartment of departments) {
                if (allowedDepartments.includes(usableDepartment.department)) {
                    const department = mapDepartments[usableDepartment.department];
                    const materials = await Materials.findOne({ where: { department: usableDepartment.department } });
                    if (materials) {
                        usableDepartments.push({
                            id: usableDepartment.department,
                            isBlocked: materials.isBlocked,
                            name: department,
                        });
                    }
                }
            }
        } else if (role === 4 || role === 7) {
            let departments;
            if (checkUser.institutionalAffiliation === 1) {
                departments = await Materials.findAll({
                    attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('department')), 'department']],
                    where: {
                        department: {
                            [Sequelize.Op.between]: [0, 12],
                        },
                    },
                    order: [['department', 'ASC']],
                });
            } else if (checkUser.institutionalAffiliation === 2) {
                departments = await Materials.findAll({
                    attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('department')), 'department']],
                    where: {
                        department: {
                            [Sequelize.Op.between]: [13, 16],
                        },
                    },
                    order: [['department', 'ASC']],
                });
            } else if (checkUser.institutionalAffiliation === 3) {
                departments = await Materials.findAll({
                    attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('department')), 'department']],
                    where: {
                        department: {
                            [Sequelize.Op.between]: [17, 24],
                        },
                    },
                    order: [['department', 'ASC']],
                });
            } else if (checkUser.institutionalAffiliation === 4) {
                departments = await Materials.findAll({
                    attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('department')), 'department']],
                    where: {
                        department: {
                            [Sequelize.Op.between]: [25, 31],
                        },
                    },
                    order: [['department', 'ASC']],
                });
            } else if (checkUser.institutionalAffiliation === 5) {
                departments = await Materials.findAll({
                    attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('department')), 'department']],
                    where: {
                        department: 32,
                    },
                    order: [['department', 'ASC']],
                });
            } else if (checkUser.institutionalAffiliation === 6) {
                departments = await Materials.findAll({
                    attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('department')), 'department']],
                    where: {
                        department: {
                            [Sequelize.Op.between]: [33, 35],
                        },
                    },
                    order: [['department', 'ASC']],
                });
            } else {
                throw new Error('Такого института не добавленно');
            }
            for (const usableDepartment of departments) {
                const department = mapDepartments[usableDepartment.department];
                const materials = await Materials.findOne({ where: { department: usableDepartment.department } });
                if (materials) {
                    usableDepartments.push({
                        id: usableDepartment.department,
                        isBlocked: materials.isBlocked,
                        name: department,
                    });
                }
            }
        } else {
            const departments = await Materials.findAll({
                attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('department')), 'department']],
                order: [['department', 'ASC']],
            });
            for (const usableDepartment of departments) {
                const department = mapDepartments[usableDepartment.department];
                const materials = await Materials.findOne({ where: { department: usableDepartment.department } });
                if (materials) {
                    usableDepartments.push({
                        id: usableDepartment.department,
                        isBlocked: materials.isBlocked,
                        name: department,
                    });
                }
            }
        }
        res.json(usableDepartments);
    },
};
