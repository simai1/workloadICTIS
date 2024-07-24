import Workload from '../models/workload.js';
import { Op } from 'sequelize';
import Educator from '../models/educator.js';
import MaterialsDto from '../dtos/materials-dto.js';
import Materials from '../models/materials.js';
import { AppErrorMissing } from '../utils/errors.js';
import MaterialsModelDto from '../dtos/materialModel-dto.js';

const orderRule = [
    // ['department', 'ASC'],
    // ['discipline', 'ASC'],
    // ['workload', 'ASC'],
    // ['notes', 'ASC'],
    ['number', "ASC"]
];

export default {
    async sync(req, res) {
        const workloads = await Workload.findAll({
            where: {
                audienceHours: { [Op.ne]: 0 },
                educatorId: { [Op.ne]: null },
            },
            include: [{ model: Educator }],
        });
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
            { ignoreDuplicates: true, individualHooks: true }
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
            materials = await Materials.findAll();
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
};
