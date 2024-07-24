import Workload from '../models/workload.js';
import { Sequelize, Op } from 'sequelize';
import Educator from '../models/educator.js';
import MaterialsDto from '../dtos/materials-dto.js';
import Materials from '../models/materials.js';
import { map as mapDepartments } from '../config/departments.js';
import { AppErrorMissing, AppErrorNotExist } from '../utils/errors.js';
import MaterialsModelDto from '../dtos/materialModel-dto.js';
import User from '../models/user.js';

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
                    notes: w.notes,
                })
            ),
            { ignoreDuplicates: true }
        );
        res.json({ status: 'OK' });
    },

    async deleteMaterial(req, res) {
        const { materialId } = req.params;
        if (!materialId) throw new AppErrorMissing('materialId');
        await Materials.destroy({ where: { id: materialId } });
        res.json({ status: 'OK' });
    },

    async getAll(req, res) {
        let { departments } = req.query;
        let materials;
        if (!departments) {
            materials = await Materials.findAll({ order: orderRule });
        } else {
            departments = departments.split(',').map(d => parseInt(d));
            materials = await Materials.findAll({
                where: { department: departments },
                attributes: { exclude: ['fields'] },
                order: orderRule,
            });
        }
        const materialsDto = materials.map(m => new MaterialsModelDto(m));
        res.json(materialsDto);
    },

    async setNote(req, res) {
        const { notes } = req.body;
        const { materialId } = req.params;
        if (!notes) throw new AppErrorMissing('notes');
        if (!materialId) throw new AppErrorMissing('materialId');
        await Materials.update({ notes }, { where: { id: materialId } });
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
            } else {
                throw new Error('Такого института не добавленно');
            }
            for (const usableDepartment of departments) {
                const department = mapDepartments[usableDepartment.department];
                const materials = await Materials.findOne({ where: { department: usableDepartment.department } });
                if (materials) {
                    usableDepartments.push({
                        id: usableDepartment.department,
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
                        name: department,
                    });
                }
            }
        }
        res.json(usableDepartments);
    },
};
