import { AppErrorInvalid, AppErrorMissing, AppErrorNotExist } from '../utils/errors.js';
import Workload from '../models/workload.js';
import Educator from '../models/educator.js';
import Notification from '../models/notifications.js';
import User from '../models/user.js';
import departments, { map as mapDepartments } from '../config/departments.js';
import WorkloadDto from '../dtos/workload-dto.js';
import SummaryWorkload from '../models/summary-workload.js';
import checkHours from '../utils/notification.js';
import History from '../models/history.js';
import sendMail from '../services/email.js';
import { Op, Sequelize } from 'sequelize';
import {instituteDepartments} from "../config/institutional-affiliations.js";

const getIds = modelsArr => {
    const arr = [];
    for (const el of modelsArr) {
        arr.push(el.id);
    }
    return arr;
};

const orderRule = [
    ['department', 'ASC'],
    ['discipline', 'ASC'],
    ['workload', 'ASC'],
    ['specialty', 'ASC'],
    ['core', 'ASC'],
];

export default {
    // Получение нагрузки
    async getAllWorkload({ query: { isOid, department, col, type }, user }, res) {
        const _user = await User.findByPk(user, { include: Educator });
        let workloadsDto;
        try {
            let workloads;
            if (!(typeof isOid === 'undefined')) {
                if (_user.role === 5 || _user.role === 2) {
                    workloads = await Workload.findAll({
                        where: {
                            isOid,
                            educatorId: _user.Educator.id,
                        },
                        include: { model: Educator },
                        order: col && type ? [[col, type.toUpperCase()]] : orderRule,
                    });
                } else {
                    workloads = await Workload.findAll({
                        where: { isOid },
                        include: { model: Educator },
                        order: col && type ? [[col, type.toUpperCase()]] : orderRule,
                    });
                }
                workloadsDto = workloads.map(workload => new WorkloadDto(workload));
            } else if (department) {
                if (_user.role === 5) {
                    workloads = await Workload.findAll({
                        where: {
                            isOid: false,
                            department,
                            educatorId: _user.Educator.id,
                        },
                        include: { model: Educator },
                        order: col && type ? [[col, type.toUpperCase()]] : orderRule,
                    });
                } else if (_user.role === 2) {
                    workloads = await Workload.findAll({
                        where: {
                            isOid: false,
                            department,
                        },
                        include: { model: Educator },
                        order: col && type ? [[col, type.toUpperCase()]] : orderRule,
                    });
                } else {
                    workloads = await Workload.findAll({
                        where: {
                            isOid: false,
                            department,
                        },
                        include: { model: Educator },
                        order: col && type ? [[col, type.toUpperCase()]] : orderRule,
                    });
                }
                workloadsDto = workloads.map(workload => new WorkloadDto(workload));
            } else {
                if (_user.role === 5) {
                    workloads = await Workload.findAll({
                        where: {
                            educatorId: _user.Educator.id,
                        },
                        include: { model: Educator },
                        order: col && type ? [[col, type.toUpperCase()]] : orderRule,
                    });
                } else if (_user.role === 2) {
                    // LECTURER HANDLER
                    const ownWorkloads = await Workload.findAll({
                        where: {
                            educatorId: _user.Educator.id,
                        },
                        include: [
                            {
                                model: Educator,
                            },
                        ],
                        order: col && type ? [[col, type.toUpperCase()]] : orderRule,
                    });

                    const disciplines = [];
                    for (const wrkld of ownWorkloads) {
                        if (!Object.values(disciplines).includes(wrkld.discipline) && wrkld.workload === 'Лекционные') {
                            disciplines.push(wrkld.discipline);
                        }
                    }

                    workloads = [
                        ...(await Workload.findAll({
                            where: {
                                discipline: disciplines,
                                workload: { [Op.in]: ['Лабораторные', 'Практические'] },
                            },
                            include: { model: Educator },
                            order: col && type ? [[col, type.toUpperCase()]] : orderRule,
                        })),
                        ...ownWorkloads,
                    ];
                } else if (_user.role === 3 || _user.role === 8) {
                    workloads = await Workload.findAll({
                        where: {
                            department: _user.Educator.department,
                        },
                        include: { model: Educator },
                        order: col && type ? [[col, type.toUpperCase()]] : orderRule,
                    });
                } else if (_user.role === 6) {
                    // UNIT_ADMIN HANDLER
                    workloads = await Workload.findAll({
                        where: {
                            department: _user.allowedDepartments,
                        },
                        include: { model: Educator },
                        order: col && type ? [[col, type.toUpperCase()]] : orderRule,
                    });
                } else if (_user.role === 4 || _user.role === 7) {
                    if (!_user.institutionalAffiliation) {
                        throw new Error('Нет привязки (institutionalAffiliation) к институту у директора');
                    }
                    const allowedDepartments = instituteDepartments[_user.institutionalAffiliation];

                    // const start =
                    //     _user.institutionalAffiliation === 1 ? 0 : _user.institutionalAffiliation === 2 ? 13 : 17;
                    // const end =
                    //     _user.institutionalAffiliation === 1 ? 12 : _user.institutionalAffiliation === 2 ? 16 : 24;
                    //
                    // for (let i = start; i <= end; i++) {
                    //     allowedDepartments.push(i);
                    // }
                    workloads = await Workload.findAll({
                        where: {
                            department: allowedDepartments,
                            isOid: false,
                            isBlocked: false,
                        },
                        include: { model: Educator },
                        order: col && type ? [[col, type.toUpperCase()]] : orderRule,
                    });
                } else {
                    workloads = await Workload.findAll({
                        where: {
                            isBlocked: false,
                            isOid: false,
                        },
                        include: { model: Educator },
                        order: col && type ? [[col, type.toUpperCase()]] : orderRule,
                    });
                }
                workloadsDto = workloads.map(workload => new WorkloadDto(workload));
            }
            res.json(workloadsDto);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getAllDepartment(req, res) {
        const filteredKeys = Object.keys(departments).filter(key => key !== 'ДИР');
        const departmentsObj = filteredKeys.map(key => ({
            name: key,
            id: departments[key],
        }));
        res.json(departmentsObj);
    },

    async getDepartment({ params: { department } }, res) {
        if (!department) throw new AppErrorMissing('department');
        if (typeof department !== 'number') department = parseInt(department);
        if (!Object.values(departments).includes(department)) throw new AppErrorInvalid(department);
        const workloads = await Workload.findAll({
            where: { department },
            include: { model: Educator },
            order: ['name', 'ASC'],
        });
        // res.json(workloads);
        const workloadsDto = [];
        for (const workload of workloads) {
            const workloadDto = new WorkloadDto(workload);
            workloadsDto.push(workloadDto);
        }
        res.json(workloadsDto);
    },

    async splitByHours({ body: { workloadId, workloadsData } }, res) {
        if (!workloadId) throw new AppErrorMissing('workloadId');
        if (!workloadsData) throw new AppErrorMissing('workloadsData');
        const originalWorkload = await Workload.findByPk(workloadId);
        const newWorkloadsData = [];
        workloadsData.map(w =>
            newWorkloadsData.push({
                department: originalWorkload.department,
                discipline: originalWorkload.discipline,
                workload: originalWorkload.workload,
                groups: originalWorkload.groups,
                block: originalWorkload.block,
                semester: originalWorkload.semester,
                period: originalWorkload.period,
                curriculum: originalWorkload.curriculum,
                curriculumUnit: originalWorkload.curriculumUnit,
                formOfEducation: originalWorkload.formOfEducation,
                levelOfTraining: originalWorkload.levelOfTraining,
                specialty: originalWorkload.specialty,
                core: originalWorkload.core,
                numberOfStudents: w.numberOfStudents,
                hours: w.hours,
                audienceHours: w.audienceHours,
                ratingControlHours: w.ratingControlHours,
                comment: w.comment ? w.comment : null,
                isSplit: true,
                originalId: originalWorkload.id,
                educatorId: null,
                isOid: originalWorkload.isOid,
            })
        );
        const newWorkloads = await Workload.bulkCreate(newWorkloadsData);
        await originalWorkload.destroy();
        const workloadsDto = [];
        newWorkloads.map(w => workloadsDto.push(new WorkloadDto(w)));

        await History.create({
            type: 1,
            department: originalWorkload.department,
            before: getIds([originalWorkload]),
            after: getIds(newWorkloads),
        });

        res.json(newWorkloads);
    },

    async splitBySubgroups({ body: { workloads } }, res) {
        if (!workloads) throw new AppErrorMissing('workloads');
        let workloadId, workloadsData, originalWorkload;
        const newWorkloadsData = [];
        const ids = [];
        for (const workload of workloads) {
            workloadId = workload.workloadId;
            workloadsData = workload.workloadsData;
            if (!workloadId) throw new AppErrorMissing('workloadId');
            if (!workloadsData) throw new AppErrorMissing('workloadsData');
            ids.push(workloadId);
            originalWorkload = await Workload.findByPk(workloadId);
            workloadsData.map(w =>
                newWorkloadsData.push({
                    department: originalWorkload.department,
                    discipline: originalWorkload.discipline,
                    workload: originalWorkload.workload,
                    groups: originalWorkload.groups,
                    block: originalWorkload.block,
                    semester: originalWorkload.semester,
                    period: originalWorkload.period,
                    curriculum: originalWorkload.curriculum,
                    curriculumUnit: originalWorkload.curriculumUnit,
                    formOfEducation: originalWorkload.formOfEducation,
                    levelOfTraining: originalWorkload.levelOfTraining,
                    specialty: originalWorkload.specialty,
                    core: originalWorkload.core,
                    numberOfStudents: w.numberOfStudents,
                    hours: w.hours,
                    audienceHours: w.audienceHours,
                    ratingControlHours: w.ratingControlHours,
                    comment: w.comment ? w.comment : null,
                    isSplit: true,
                    originalId: originalWorkload.id,
                    educatorId: null,
                    isOid: originalWorkload.isOid,
                })
            );
            await originalWorkload.destroy();
        }
        const newWorkloads = await Workload.bulkCreate(newWorkloadsData);
        const workloadsDto = [];
        newWorkloads.map(w => workloadsDto.push(new WorkloadDto(w)));

        let after;
        for (const id of ids) {
            after = newWorkloads.filter(w => w.originalId === id);
            await History.create({
                type: 1,
                department: after[0].department,
                before: [id],
                after: getIds(after),
            });
        }

        // ids.forEach(async id => await History.create({
        //     type: 1,
        //     department: originalWorkload.department,
        //     before: [id,],
        //     after: getIds(newWorkloads),
        // }));

        res.json(workloadsDto);
    },

    // async splitBySubgroups({ body: { ids, n }, user }, res) {
    //     if (!ids || !Array.isArray(ids) || ids.length === 0) {
    //         throw new Error('Укажите идентификаторы нагрузок для разделения');
    //     }
    //     if (!n || isNaN(n) || n < 1) {
    //         throw new Error('Укажите количество групп для разделения нагрузки');
    //     }
    //     if (n > 4) {
    //         throw new Error('Максимальное количество групп для разделения нагрузки - 4');
    //     }
    //
    //     const existingWorkloads = await Workload.findAll({ where: { id: ids } });
    //
    //     for (const workload of existingWorkloads) {
    //         if (workload.isSplit) throw new AppErrorForbiddenAction();
    //     }
    //
    //     if (existingWorkloads.length !== ids.length) {
    //         const existingIds = existingWorkloads.map(workload => workload.id);
    //         const nonExistingIds = ids.filter(id => !existingIds.includes(id));
    //         res.status(404).json({ error: `Нагрузки с идентификаторами ${nonExistingIds.join(', ')} не найдены` });
    //         return;
    //     }
    //
    //     // Разделяем нагрузки
    //     const newWorkloads = [];
    //     for (const workload of existingWorkloads) {
    //         const studentsCount = workload.numberOfStudents;
    //         const studentsPerGroup = Math.floor(studentsCount / n);
    //         const remainder = studentsCount % n;
    //         // Создаем и сохраняем новые нагрузки в базу данных
    //         for (let i = 0; i < n; i++) {
    //             const copyWorkload = {
    //                 ...workload.get(),
    //                 isMerged: false,
    //             };
    //             copyWorkload.isSplit = true;
    //             copyWorkload.originalId = workload.id;
    //             delete copyWorkload.id;
    //             delete copyWorkload.educatorId;
    //             delete copyWorkload.EducatorId;
    //             // Распределение студентов между группами
    //             if (i < remainder) {
    //                 // Если индекс группы меньше остатка, добавляем по одному студенту
    //                 copyWorkload.numberOfStudents = studentsPerGroup + 1;
    //             } else {
    //                 // В остальных случаях добавляем студентов равномерно
    //                 copyWorkload.numberOfStudents = studentsPerGroup;
    //             }
    //
    //             const newWorkload = await Workload.create(copyWorkload);
    //             newWorkloads.push(newWorkload);
    //         }
    //
    //         // Удаляем изначальную нагрузку
    //         await workload.destroy();
    //     }
    //
    //     await History.create({
    //         type: 1,
    //         department: existingWorkloads[0].department,
    //         before: getIds(existingWorkloads),
    //         after: getIds(newWorkloads),
    //     });
    //
    //     res.json(newWorkloads);
    // },

    // Получение нагрузки
    async getOne({ params: { id } }, res) {
        const workload = await Workload.findByPk(id);
        if (!workload) throw new Error('Нет такой нагрузки');
        const workloadDto = new WorkloadDto(workload);
        res.json(workloadDto);
    },

    async update({ params: { id }, body: { numberOfStudents, hours, comment, audienceHours, notes } }, res) {
        try {
            const workload = await Workload.findByPk(id, {
                include: { model: Educator },
            });

            if (!id) throw new AppErrorMissing('id');
            if (!workload) throw new AppErrorNotExist('workload');

            if (!numberOfStudents) numberOfStudents = workload.numberOfStudents;
            if (!hours) hours = workload.hours;
            if (!comment) comment = workload.comment;
            if (!audienceHours) audienceHours = workload.audienceHours;
            if (!notes) notes = workload.notes;
            // Обновляем запись в таблице Workload
            await workload.update({
                numberOfStudents,
                hours,
                comment,
                audienceHours,
                notes,
            });

            await History.create({
                type: 3,
                department: workload[0].department,
                before: [],
                after: [workload.id],
            });

            res.json(workload);
        } catch (error) {
            res.status(500).json({ error });
        }
    },

    async facultyEducator({ body: { educatorId, workloadIds } }, res) {
        if (!educatorId) throw new AppErrorMissing('educatorIds');
        if (!workloadIds) throw new AppErrorMissing('workloadIds');
        if (!Array.isArray(workloadIds)) throw new AppErrorInvalid('workloadIds');

        const checkWorkloads = await Workload.findAll({ where: { id: workloadIds } });
        if (checkWorkloads.some(workload => !workload)) throw new AppErrorNotExist('workload');

        checkWorkloads.reduce((chain, workload) => {
            return chain.then(() => workload.update({ educatorId }));
        }, Promise.resolve());

        // email section
        if (checkWorkloads[0].workload === 'Лекционные' && checkWorkloads[0].department === 0) {
            const educator = await Educator.findOne({
                where: { id: educatorId },
                include: [{ model: User }],
            });
            if (!educator.User) sendMail(educator.email, 'lectorInvite');
        }

        // history creation section
        const historyData = [];
        for (let i = 0; i < workloadIds.length; i++) {
            historyData.push({
                type: 3,
                department: checkWorkloads[i].department,
                before: [],
                after: [workloadIds[i]],
            });
        }
        await History.bulkCreate(historyData);

        res.json({ status: 'OK' });
    },

    async unfacultyEducator({ body: { workloadIds } }, res) {
        if (!workloadIds) throw new AppErrorMissing('workloadIds');
        if (!Array.isArray(workloadIds)) throw new AppErrorInvalid('workloadIds');
        const workloads = await Workload.findAll({ where: { id: workloadIds } });
        if (!workloads) throw new AppErrorInvalid('workload');
        const educatorIds = [];
        workloads.map(workload => educatorIds.push(workload.educatorId));
        // await Workload.update({ educatorId: null }, {where: {id: workloadIds}});

        workloads.reduce((chain, workload) => {
            return chain.then(() => workload.update({ educatorId: null }));
        }, Promise.resolve());

        let remainingWorkloads;
        let summaryWorkload;
        for (const educatorId of educatorIds) {
            remainingWorkloads = await Workload.count({ where: { educatorId } });
            console.log(remainingWorkloads);
            if (remainingWorkloads === 0) {
                // Если нет нагрузок, удаляем предупреждение
                await Notification.destroy({ where: { educatorId } }); // Предположим, что у вас есть метод для удаления summaryWorkload по educatorId
            } else {
                // Если остались нагрузки, все равно вызываем проверку часов
                summaryWorkload = await SummaryWorkload.findOne({ where: { educatorId } });
                await checkHours(summaryWorkload); // Передаем summaryWorkload в функцию checkHours
            }
        }
        const historyData = [];
        for (let i = 0; i < workloadIds.length; i++) {
            historyData.push({
                type: 3,
                department: workloads[i].department,
                before: [workloadIds[i]],
                after: [],
            });
        }
        await History.bulkCreate(historyData);
        res.json({ status: 'OK' });
    },

    async merge(req, res) {
        const { ids, curriculum, semester, groups, block, core} = req.body;
        const { type } = req.query;
        if (!ids) throw new AppErrorMissing('ids');
        if (!core) throw new AppErrorMissing('core');
        if (!curriculum) throw new AppErrorMissing('curriculum');
        if (!semester) throw new AppErrorMissing('semester');
        if (!groups) throw new AppErrorMissing('groups');
        if (!block) throw new AppErrorMissing('block');
        try{
            const workloads = await Workload.findAll({ where: { id: ids } });
            const audienceHours = workloads[0].audienceHours;
            const numberOfStudents = workloads[0].numberOfStudents;
            const first = workloads[0];
            let newWorkloadData;
            if (type === 'g' && workloads.every(w => w.audienceHours === audienceHours)) {
                // Объединение по подгруппам
                const newNumberOfStudents = workloads.reduce(
                    (accumulator, currentValue) => accumulator + currentValue.numberOfStudents,
                    0
                );
                newWorkloadData = {
                    department: first.department,
                    discipline: first.discipline,
                    workload: first.workload,
                    groups,
                    block,
                    semester,
                    period: first.period,
                    curriculum,
                    curriculumUnit: first.curriculumUnit,
                    formOfEducation: first.formOfEducation,
                    levelOfTraining: first.levelOfTraining,
                    specialty: first.specialty,
                    core,
                    numberOfStudents: newNumberOfStudents,
                    hours: Math.round((newNumberOfStudents * first.audienceHours * 0.01 + first.audienceHours) * 100) / 100,
                    audienceHours: first.audienceHours,
                    ratingControlHours: Math.round(newNumberOfStudents * first.audienceHours * 0.01 * 100) / 100,
                    comment: first.comment ? first.comment : null,
                    isSplit: false,
                    isMerged: true,
                    originalId: null,
                    educatorId: null,
                    isOid: first.isOid,
                };

            } else if (type === 'h' && workloads.every(w => w.numberOfStudents === numberOfStudents && w.isSplit)) {
                // Объединение по часам
                newWorkloadData = {
                    department: first.department,
                    discipline: first.discipline,
                    workload: first.workload,
                    groups,
                    block,
                    semester,
                    period: first.period,
                    curriculum,
                    curriculumUnit: first.curriculumUnit,
                    formOfEducation: first.formOfEducation,
                    levelOfTraining: first.levelOfTraining,
                    specialty: first.specialty,
                    core,
                    numberOfStudents: first.numberOfStudents,
                    hours: workloads.reduce((accumulator, currentValue) => accumulator + currentValue.hours, 0),
                    audienceHours: workloads.reduce(
                        (accumulator, currentValue) => accumulator + currentValue.audienceHours,
                        0
                    ),
                    ratingControlHours: workloads.reduce(
                        (accumulator, currentValue) => accumulator + currentValue.ratingControlHours,
                        0
                    ),
                    comment: first.comment ? first.comment : null,
                    isSplit: false,
                    isMerged: true,
                    originalId: null,
                    educatorId: null,
                    isOid: first.isOid,
                };
            } else if (type === 'vkr') {
                newWorkloadData = {
                    department: first.department,
                    discipline: first.discipline,
                    workload: first.workload,
                    groups,
                    block,
                    semester,
                    period: first.period,
                    curriculum,
                    curriculumUnit: first.curriculumUnit,
                    formOfEducation: first.formOfEducation,
                    levelOfTraining: first.levelOfTraining,
                    specialty: first.specialty,
                    core,
                    numberOfStudents: first.numberOfStudents,
                    hours: first.hours,
                    audienceHours: first.audienceHours,
                    ratingControlHours: first.ratingControlHours,
                    comment: first.comment ? first.comment : null,
                    isSplit: false,
                    isMerged: true,
                    originalId: null,
                    educatorId: null,
                    isOid: first.isOid,
                };
            } else {
                throw new AppErrorInvalid('type');
            }
            const newWorkload = await Workload.create(newWorkloadData);
            workloads.reduce((chain, workload) => {
                return chain.then(() => workload.destroy());
            }, Promise.resolve());

            await History.create({
                type: 2,
                department: first.department,
                before: ids,
                after: [newWorkload.id],
            });

            res.json({
                id: newWorkloadData.id,
                ...newWorkload,
            });
        } catch(err){
            console.log(err);
            res.status(500).json({ message: err.message });
        }

    },

    async mergeReadyData({ body: { workloadData, ids } }, res) {
        if (!ids) throw new AppErrorMissing('ids');
        if (!workloadData) throw new AppErrorMissing('workloadData');
        const workloads = await Workload.findAll({ where: { id: ids } });
        const first = workloads[0];
        const newWorkloadData = {
            department: first.department,
            discipline: first.discipline,
            workload: first.workload,
            groups: first.groups,
            block: first.block,
            semester: first.semester,
            period: first.period,
            curriculum: first.curriculum,
            curriculumUnit: first.curriculumUnit,
            formOfEducation: first.formOfEducation,
            levelOfTraining: first.levelOfTraining,
            specialty: first.specialty,
            core: first.core,
            numberOfStudents: workloadData.numberOfStudents,
            hours: Math.round(workloadData.hours * 100) / 100,
            audienceHours: workloadData.audienceHours,
            ratingControlHours: Math.round(workloadData.ratingControlHours * 100) / 100,
            comment: first.comment ? first.comment : null,
            isSplit: false,
            isMerged: true,
            originalId: null,
            educatorId: null,
            isOid: first.isOid,
        };
        const newWorkload = await Workload.create(newWorkloadData);
        workloads.reduce((chain, workload) => {
            return chain.then(() => workload.destroy());
        }, Promise.resolve());

        await History.create({
            type: 2,
            department: first.department,
            before: ids,
            after: [newWorkload.id],
        });

        res.json({
            id: newWorkloadData.id,
            ...newWorkload,
        });
    },

    // async mapRow({ body: { ids }, user }, res) {
    //     const workloads = await Workload.findAll({ where: { id: ids } }, { include: { model: Educator } });
    //
    //     if (!ids) {
    //         throw new AppErrorMissing('id');
    //     }
    //     // Проверка массива нагрузок на идентичность полей для соединения
    //     const firstWorkload = workloads[0];
    //     if (
    //         workloads.some(
    //             workload =>
    //                 workload.department !== firstWorkload.department ||
    //                 workload.workload !== firstWorkload.workload ||
    //                 workload.discipline !== firstWorkload.discipline ||
    //                 workload.core !== firstWorkload.core ||
    //                 workload.specialty !== firstWorkload.specialty ||
    //                 workload.hours !== firstWorkload.hours
    //         )
    //     ) {
    //         return res.status(400).json({
    //             error: 'Invalid request. Department, workload, and discipline must be the same for all workloads.',
    //         });
    //     }
    //
    //     // Совмещаем часы
    //     let totalStudents = 0;
    //
    //     workloads.forEach(workload => {
    //         totalStudents += workload.numberOfStudents;
    //     });
    //
    //     // Создаем совмещенную нагрузку
    //     const mergeWorkload = {
    //         department: firstWorkload.get('department'),
    //         discipline: firstWorkload.get('discipline'),
    //         workload: firstWorkload.get('workload'),
    //         groups: firstWorkload.get('groups'),
    //         block: firstWorkload.get('block'),
    //         semester: firstWorkload.get('semester'),
    //         period: firstWorkload.get('period'),
    //         curriculum: firstWorkload.get('curriculum'),
    //         curriculumUnit: firstWorkload.get('curriculumUnit'),
    //         formOfEducation: firstWorkload.get('formOfEducation'),
    //         levelOfTraining: firstWorkload.get('levelOfTraining'),
    //         specialty: firstWorkload.get('specialty'),
    //         core: firstWorkload.get('core'),
    //         numberOfStudents: totalStudents,
    //         hours: firstWorkload.get('hours'),
    //         audienceHours: firstWorkload.get('audienceHours'),
    //         ratingControlHours: firstWorkload.get('ratingControlHours'),
    //         comment: firstWorkload.get('comment'),
    //         isSplit: false,
    //         isMerged: true,
    //         originalId: null,
    //         isOid: firstWorkload.get('isOid'),
    //         kafedralAutumnWorkload: firstWorkload.get('kafedralAutumnWorkload'),
    //         kafedralSpringWorkload: firstWorkload.get('kafedralSpringWorkload'),
    //         kafedralAdditionalWorkload: firstWorkload.get('kafedralAdditionalWorkload'),
    //         instituteAutumnWorkload: firstWorkload.get('instituteAutumnWorkload'),
    //         instituteSpringWorkload: firstWorkload.get('instituteSpringWorkload'),
    //         instituteManagementWorkload: firstWorkload.get('instituteManagementWorkload'),
    //     };
    //
    //     const createdWorkload = await Workload.create(mergeWorkload);
    //
    //     // Удаляем записи которые учавствовали в совмещении
    //     workloads.reduce((chain, workload) => {
    //         return chain.then(() => workload.destroy());
    //     }, Promise.resolve());
    //
    //     await History.create({
    //         type: 2,
    //         department: workloads[0].department,
    //         before: getIds(workloads),
    //         after: [createdWorkload.id],
    //     });
    //
    //     const responseData = {
    //         id: createdWorkload.id,
    //         ...mergeWorkload,
    //     };
    //     res.json(responseData);
    // },

    async deleteWorkload({ params: { id } }, res) {
        if (!id) throw new AppErrorMissing('id');

        const workload = await Workload.findByPk(id);

        if (!workload) {
            return res.status(404).json('Workload not found');
        }

        // Delete the instance from the database
        await workload.destroy({ force: true });

        res.status(200).json('Successfully deleted');
    },

    async deleteSeveralWorkloads({ body: { ids } }, res) {
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            throw new Error('Укажите идентификаторы нагрузок для удаления');
        }

        // Проверяем существование всех нагрузок
        const existingWorkloads = await Workload.findAll({ where: { id: ids } });

        if (existingWorkloads.length !== ids.length) {
            const existingIds = existingWorkloads.map(workload => workload.id);
            const nonExistingIds = ids.filter(id => !existingIds.includes(id));
            res.status(404).json({ error: `Нагрузки с идентификаторами ${nonExistingIds.join(', ')} не найдены` });
            return;
        }

        // Удаляем нагрузки
        await Promise.allSettled(existingWorkloads.map(workload => workload.destroy({ force: true })));

        res.status(200).json('Successfully deleted');
    },

    async getDepartmentWorkload(req, res) {
        const userId = req.user;
        const educator = await Educator.findOne({ where: { userId } });

        const department = educator.department;

        const workloads = await Workload.findAll({
            where: {
                department,
                isOid: false,
            },
            order: [
                ['discipline', 'ASC'],
                ['workload', 'ASC'],
                ['updatedAt', 'ASC'],
            ],
            include: { model: Educator },
        });
        const workloadsDto = workloads.map(workload => new WorkloadDto(workload));
        res.json(workloadsDto);
    },

    async getUsableDepartments(req, res) {
        const userId = req.user;
        const checkUser = await User.findByPk(userId);
        if (!checkUser) throw new AppErrorNotExist('User');
        const role = checkUser.role;
        const usableDepartments = [];

        if (role === 2 || role === 3 || role === 5 || role === 8) {
            const educator = await Educator.findOne({ where: { userId } });
            const department = educator.department;
            const workload = await Workload.findOne({ where: { department } });
            if (workload?.isBlocked === true) {
                usableDepartments.push({
                    id: department,
                    name: mapDepartments[department],
                    blocked: true,
                });
            } else {
                usableDepartments.push({
                    id: department,
                    name: mapDepartments[department],
                    blocked: false,
                });
            }
        } else if (role === 6) {
            const allowedDepartments = checkUser.allowedDepartments;
            const departments = await Workload.findAll({
                attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('department')), 'department']],
                order: [['department', 'ASC']],
            });
            for (const usableDepartment of departments) {
                if (allowedDepartments.includes(usableDepartment.department)) {
                    const department = mapDepartments[usableDepartment.department];
                    const workload = await Workload.findOne({ where: { department: usableDepartment.department } });
                    if (workload.isBlocked === true) {
                        usableDepartments.push({
                            id: usableDepartment.department,
                            name: department,
                            blocked: true,
                        });
                    } else {
                        usableDepartments.push({
                            id: usableDepartment.department,
                            name: department,
                            blocked: false,
                        });
                    }
                }
            }
        } else if (role === 4 || role === 7) {
            let departments;
            if (checkUser.institutionalAffiliation === 1) {
                departments = await Workload.findAll({
                    attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('department')), 'department']],
                    where: {
                        department: {
                            [Sequelize.Op.between]: [0, 12],
                        },
                    },
                    order: [['department', 'ASC']],
                });
            } else if (checkUser.institutionalAffiliation === 2) {
                departments = await Workload.findAll({
                    attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('department')), 'department']],
                    where: {
                        department: {
                            [Sequelize.Op.between]: [13, 16],
                        },
                    },
                    order: [['department', 'ASC']],
                });
            } else if (checkUser.institutionalAffiliation === 3) {
                departments = await Workload.findAll({
                    attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('department')), 'department']],
                    where: {
                        department: {
                            [Sequelize.Op.between]: [17, 24],
                        },
                    },
                    order: [['department', 'ASC']],
                });
            } else if (checkUser.institutionalAffiliation === 4) {
                departments = await Workload.findAll({
                    attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('department')), 'department']],
                    where: {
                        department: {
                            [Sequelize.Op.between]: [25, 31],
                        },
                    },
                    order: [['department', 'ASC']],
                });
            } else if (checkUser.institutionalAffiliation === 5) {
                departments = await Workload.findAll({
                    attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('department')), 'department']],
                    where: {
                        department: 32,
                    },
                    order: [['department', 'ASC']],
                });
            } else if (checkUser.institutionalAffiliation === 6) {
                departments = await Workload.findAll({
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
                const workload = await Workload.findOne({ where: { department: usableDepartment.department } });
                if (workload.isBlocked === true) {
                    usableDepartments.push({
                        id: usableDepartment.department,
                        name: department,
                        blocked: true,
                    });
                } else {
                    usableDepartments.push({
                        id: usableDepartment.department,
                        name: department,
                        blocked: false,
                    });
                }
            }
        } else {
            const departments = await Workload.findAll({
                attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('department')), 'department']],
                order: [['department', 'ASC']],
            });
            for (const usableDepartment of departments) {
                const department = mapDepartments[usableDepartment.department];
                const workload = await Workload.findOne({ where: { department: usableDepartment.department } });
                if (workload.isBlocked === true) {
                    usableDepartments.push({
                        id: usableDepartment.department,
                        name: department,
                        blocked: true,
                    });
                } else {
                    usableDepartments.push({
                        id: usableDepartment.department,
                        name: department,
                        blocked: false,
                    });
                }
            }
        }
        res.json(usableDepartments);
    },

    async changeColorWorkload(req, res) {},

    async blockWorkload({ params: { department } }, res) {
        if (!department) throw new AppErrorMissing('department');
        department = parseInt(department);
        if (department === 0) {
            const checkWorkload = await Workload.findOne({ where: { isOid: true } });
            if (checkWorkload.isBlocked === true) throw new Error('Already blocked');
            await Workload.update({ isBlocked: true }, { where: { isOid: true } });
            try {
                if (process.env.NODE_ENV === 'production') {
                    const methodists = await User.findAll({ where: { role: 1 } });
                    for (const methodist of methodists) {
                        sendMail(methodist.login, 'blocking', 'Общеинститутская нагрузка');
                    }
                } else {
                    sendMail(process.env.EMAIL_RECIEVER, 'blocking', 'Общеинститутская нагрузка');
                }
            } catch (e) {
                console.log('Email bad creditionals');
            }
        } else {
            if (!Object.values(departments).includes(department)) throw new AppErrorInvalid('department');
            await Workload.update({ isBlocked: true }, { where: { department } });
            try {
                if (process.env.NODE_ENV === 'production') {
                    const methodists = await User.findAll({ where: { role: 1 } });
                    for (const methodist of methodists) {
                        sendMail(methodist.login, 'blocking', `${mapDepartments[department]}`);
                    }
                } else {
                    sendMail(process.env.EMAIL_RECIEVER, 'blocking', `${mapDepartments[department]}`);
                }
            } catch (e) {
                console.log('Email bad creditionals');
            }
        }
        res.json({ status: 'OK' });
    },

    async unblockWorkload({ params: { department } }, res) {
        if (!department) throw new AppErrorMissing('department');
        department = parseInt(department);
        if (department === 0) {
            const checkWorkload = await Workload.findOne({ where: { isOid: true } });
            if (checkWorkload.isBlocked === false) throw new Error('Already unblocked');
            await Workload.update({ isBlocked: false }, { where: { isOid: true } });
        } else {
            if (!Object.values(departments).includes(department)) throw new AppErrorInvalid('department');
            await Workload.update({ isBlocked: false }, { where: { department } });
        }

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
                sendMail(reciever.login, 'unblocking');
            }
        } else {
            sendMail(process.env.EMAIL_RECIEVER, 'unblocking');
        }

        res.json({ status: 'OK' });
    },

    async getDepartmentsForDirectorate(req, res) {
        const _user = await User.findByPk(req.user);
        let filteredDepartments;
        if (_user.role === 4 || _user.role === 7) {
            if (!_user.institutionalAffiliation) {
                throw new Error('Нет привязки (institutionalAffiliation) к институту у директора');
            }

            if (_user.institutionalAffiliation === 1) {
                filteredDepartments = Object.entries(departments)
                    .slice(0, 13)
                    .map(([name, id]) => ({
                        name,
                        id,
                    }));
            } else if (_user.institutionalAffiliation === 2) {
                filteredDepartments = Object.entries(departments)
                    .slice(13, 17)
                    .map(([name, id]) => ({
                        name,
                        id,
                    }));
            } else if (_user.institutionalAffiliation === 3) {
                filteredDepartments = Object.entries(departments)
                    .slice(17, 25)
                    .map(([name, id]) => ({
                        name,
                        id,
                    }));
            } else {
                throw new Error('Такого института не добавленно');
            }
        } else if (_user.role === 6) {
            const allDepartments = Object.entries(departments).map(([name, id]) => ({
                name,
                id,
            }));
            const allowed = _user.allowedDepartments;
            filteredDepartments = allDepartments.filter(item => allowed.includes(item.id));
        } else if (_user.role === 1) {
            filteredDepartments = Object.entries(departments).map(([name, id]) => ({
                name,
                id,
            }));
            console.log(filteredDepartments);
        }
        res.json(filteredDepartments);
    },

    async checkHoursByAllEducators(req, res) {
        const educators = await Educator.findAll({
            include: { model: Workload },
        });
        const educatorsWithCleanedWorkloads = educators.map(educator => ({
            ...educator.dataValues,
            Workloads: educator.Workloads.map(workload => workload.dataValues),
        }));
        for (const educator of educatorsWithCleanedWorkloads) {
            const summaryWorkload = await SummaryWorkload.findOne({ where: { educatorId: educator.id } });
            if (educator.Workloads.length !== 0) {
                const hours = {
                    kafedralAutumnWorkload: 0,
                    kafedralSpringWorkload: 0,
                    kafedralAdditionalWorkload: 0,
                    instituteAutumnWorkload: 0,
                    instituteSpringWorkload: 0,
                    instituteManagementWorkload: 0,
                    totalKafedralHours: 0,
                    totalOidHours: 0,
                    totalHours: 0,
                };
                const existWorkloads = educator.Workloads;
                for (const workload of existWorkloads) {
                    if (!workload.isOid && workload.period === 1) hours.kafedralAutumnWorkload += workload.hours;
                    if (!workload.isOid && workload.period === 2) hours.kafedralSpringWorkload += workload.hours;
                    if (!workload.isOid && !workload.period) hours.kafedralAdditionalWorkload += workload.hours;
                    if (workload.isOid && workload.period === 1) hours.instituteAutumnWorkload += workload.hours;
                    if (workload.isOid && workload.period === 2) hours.instituteSpringWorkload += workload.hours;
                    if (workload.isOid && !workload.period) hours.instituteManagementWorkload += workload.hours;

                    hours.totalKafedralHours =
                        hours.kafedralAutumnWorkload + hours.kafedralSpringWorkload + hours.kafedralAdditionalWorkload;
                    hours.totalOidHours =
                        hours.instituteAutumnWorkload +
                        hours.instituteSpringWorkload +
                        hours.instituteManagementWorkload;
                    hours.totalHours = hours.totalKafedralHours + hours.totalOidHours;
                }

                summaryWorkload.kafedralAutumnWorkload = hours.kafedralAutumnWorkload;
                summaryWorkload.kafedralSpringWorkload = hours.kafedralSpringWorkload;
                summaryWorkload.kafedralAdditionalWorkload = hours.kafedralAdditionalWorkload;
                summaryWorkload.instituteAutumnWorkload = hours.instituteAutumnWorkload;
                summaryWorkload.instituteSpringWorkload = hours.instituteSpringWorkload;
                summaryWorkload.instituteManagementWorkload = hours.instituteManagementWorkload;
                summaryWorkload.totalKafedralHours = hours.totalKafedralHours;
                summaryWorkload.totalOidHours = hours.totalOidHours;
                summaryWorkload.totalHours = hours.totalHours;
                await summaryWorkload.save();
                await checkHours(summaryWorkload);
            } else {
                summaryWorkload.kafedralAutumnWorkload = 0;
                summaryWorkload.kafedralSpringWorkload = 0;
                summaryWorkload.kafedralAdditionalWorkload = 0;
                summaryWorkload.instituteAutumnWorkload = 0;
                summaryWorkload.instituteSpringWorkload = 0;
                summaryWorkload.instituteManagementWorkload = 0;
                summaryWorkload.totalKafedralHours = 0;
                summaryWorkload.totalOidHours = 0;
                summaryWorkload.totalHours = 0;
                await summaryWorkload.save();
                await checkHours(summaryWorkload);
            }
        }
        res.json({ status: 'OK' });
    },

    async checkHoursEducators() {
        const educators = await Educator.findAll({
            include: { model: Workload },
        });
        console.log(educators.length);
        const educatorsWithCleanedWorkloads = educators.map(educator => ({
            ...educator.dataValues,
            Workloads: educator.Workloads.map(workload => workload.dataValues),
        }));
        for (const educator of educatorsWithCleanedWorkloads) {
            const summaryWorkload = await SummaryWorkload.findOne({ where: { educatorId: educator.id } });
            if (educator.Workloads.length !== 0) {
                const hours = {
                    kafedralAutumnWorkload: 0,
                    kafedralSpringWorkload: 0,
                    kafedralAdditionalWorkload: 0,
                    instituteAutumnWorkload: 0,
                    instituteSpringWorkload: 0,
                    instituteManagementWorkload: 0,
                    totalKafedralHours: 0,
                    totalOidHours: 0,
                    totalHours: 0,
                };
                const existWorkloads = educator.Workloads;
                for (const workload of existWorkloads) {
                    if (!workload.isOid && workload.period === 1) hours.kafedralAutumnWorkload += workload.hours;
                    if (!workload.isOid && workload.period === 2) hours.kafedralSpringWorkload += workload.hours;
                    if (!workload.isOid && !workload.period) hours.kafedralAdditionalWorkload += workload.hours;
                    if (workload.isOid && workload.period === 1) hours.instituteAutumnWorkload += workload.hours;
                    if (workload.isOid && workload.period === 2) hours.instituteSpringWorkload += workload.hours;
                    if (workload.isOid && !workload.period) hours.instituteManagementWorkload += workload.hours;

                    hours.totalKafedralHours =
                        hours.kafedralAutumnWorkload + hours.kafedralSpringWorkload + hours.kafedralAdditionalWorkload;
                    hours.totalOidHours =
                        hours.instituteAutumnWorkload +
                        hours.instituteSpringWorkload +
                        hours.instituteManagementWorkload;
                    hours.totalHours = hours.totalKafedralHours + hours.totalOidHours;
                }

                summaryWorkload.kafedralAutumnWorkload = hours.kafedralAutumnWorkload;
                summaryWorkload.kafedralSpringWorkload = hours.kafedralSpringWorkload;
                summaryWorkload.kafedralAdditionalWorkload = hours.kafedralAdditionalWorkload;
                summaryWorkload.instituteAutumnWorkload = hours.instituteAutumnWorkload;
                summaryWorkload.instituteSpringWorkload = hours.instituteSpringWorkload;
                summaryWorkload.instituteManagementWorkload = hours.instituteManagementWorkload;
                summaryWorkload.totalKafedralHours = hours.totalKafedralHours;
                summaryWorkload.totalOidHours = hours.totalOidHours;
                summaryWorkload.totalHours = hours.totalHours;
                await summaryWorkload.save();
                await checkHours(summaryWorkload);
            } else {
                summaryWorkload.kafedralAutumnWorkload = 0;
                summaryWorkload.kafedralSpringWorkload = 0;
                summaryWorkload.kafedralAdditionalWorkload = 0;
                summaryWorkload.instituteAutumnWorkload = 0;
                summaryWorkload.instituteSpringWorkload = 0;
                summaryWorkload.instituteManagementWorkload = 0;
                summaryWorkload.totalKafedralHours = 0;
                summaryWorkload.totalOidHours = 0;
                summaryWorkload.totalHours = 0;
                await summaryWorkload.save();
                await checkHours(summaryWorkload);
            }
        }
    },

    async requestUnblock(req, res) {
        const { department } = req.body;
        if (process.env.NODE_ENV === 'production') {
            const methodists = await User.findAll({ where: { role: 1 } });
            for (const methodist of methodists) {
                sendMail(methodist.login, 'requestUnblocking', mapDepartments[department]);
            }
        } else {
            sendMail(process.env.EMAIL_RECIEVER, 'requestUnblocking', mapDepartments[department]);
        }
        res.json({ status: 'OK' });
    },
    async getWorkloadOwnForDepartHead({ query: { col, type }, user }, res){
        try{
            const _user = await User.findByPk(user, { include: Educator });
            const ownWorkloads = await Workload.findAll({
                where: {
                    educatorId: _user.Educator.id,
                },
                include: [
                    {
                        model: Educator,
                    },
                ],
                order: col && type ? [[col, type.toUpperCase()]] : orderRule,
            });

            const disciplines = [];
            for (const wrkld of ownWorkloads) {
                if (!Object.values(disciplines).includes(wrkld.discipline) && wrkld.workload === 'Лекционные') {
                    disciplines.push(wrkld.discipline);
                }
            }

            const workloads = [
                ...(await Workload.findAll({
                    where: {
                        discipline: disciplines,
                        workload: { [Op.in]: ['Лабораторные', 'Практические'] },
                    },
                    include: { model: Educator },
                    order: col && type ? [[col, type.toUpperCase()]] : orderRule,
                })),
                ...ownWorkloads,
            ];
            const workloadsDto = workloads.map(workload => new WorkloadDto(workload));
            res.json(workloadsDto);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async getAllocatedAndUnallocatedWrokloadHours({ params: { department } }, res) {
        const educators = await Educator.findAll({
            where: {
                name: {
                    [Sequelize.Op.like]: '%Вакансия%',
                },
                department,
            },
        });
        let hoursWorkloadWithoutEducators = 0;
        let hoursAllWorkload = 0;
        if (educators.length > 0) {
            for (const educator of educators) {
                const workloadWithoutEducators = await Workload.findAll({
                    where: {
                        educatorId: educator.id,
                    },
                });
                for (const workload of workloadWithoutEducators) {
                    hoursWorkloadWithoutEducators += workload.hours;
                }
            }
        }
        const workloadWithoutEducators = await Workload.findAll({
            where: {
                educatorId: null,
                department,
            },
        });
        for (const wrkl of workloadWithoutEducators) {
            hoursWorkloadWithoutEducators += wrkl.hours;
        }
        const workloadAll = await Workload.findAll({
            where: {
                department,
            },
        });
        for (const wrkl of workloadAll) {
            hoursAllWorkload += wrkl.hours;
        }

        hoursWorkloadWithoutEducators = hoursWorkloadWithoutEducators.toFixed(2);
        hoursAllWorkload = hoursAllWorkload.toFixed(2);
        res.json({
            hoursWorkloadWithoutEducators,
            hoursAllWorkload,
        });
    },
};
