import { AppErrorForbiddenAction, AppErrorInvalid, AppErrorMissing, AppErrorNotExist } from '../utils/errors.js';
// eslint-disable-next-line import/no-duplicates
import departments from '../config/departments.js';
import Workload from '../models/workload.js';
import Educator from '../models/educator.js';
import Notification from '../models/notifications.js';
import User from '../models/user.js';
// eslint-disable-next-line import/no-duplicates
import { map as mapDepartments } from '../config/departments.js';
import WorkloadDto from '../dtos/workload-dto.js';
import SummaryWorkload from '../models/summary-workload.js';
import checkHours from '../utils/notification.js';
import History from '../models/history.js';
import sendMail from '../services/email.js';
import { Op, Sequelize } from 'sequelize';

const getIds = modelsArr => {
    const arr = [];
    for (const el of modelsArr) {
        arr.push(el.id);
    }
    return arr;
};

const orderRule = [
    ['discipline', 'ASC'],
    ['workload', 'ASC'],
    ['specialty', 'ASC'],
    ['core', 'ASC'],
];

export default {
    // Получение нагрузки
    async getAllWorkload({ query: { isOid, department }, user }, res) {
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
                        order: orderRule,
                    });
                } else {
                    workloads = await Workload.findAll({
                        where: { isOid },
                        include: { model: Educator },
                        order: orderRule,
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
                        order: orderRule,
                    });
                } else if (_user.role === 2) {
                    workloads = await Workload.findAll({
                        where: {
                            isOid: false,
                            department,
                        },
                        include: { model: Educator },
                        order: orderRule,
                    });
                } else {
                    workloads = await Workload.findAll({
                        where: {
                            isOid: false,
                            department,
                        },
                        include: { model: Educator },
                        order: orderRule,
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
                        order: orderRule,
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
                        order: orderRule,
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
                            order: orderRule,
                        })),
                        ...ownWorkloads,
                    ];
                } else if (_user.role === 3 || _user.role === 8) {
                    workloads = await Workload.findAll({
                        where: {
                            department: _user.Educator.department,
                        },
                        include: { model: Educator },
                        order: orderRule,
                    });
                } else if (_user.role === 6) {
                    // UNIT_ADMIN HANDLER
                    workloads = await Workload.findAll({
                        where: {
                            department: _user.allowedDepartments,
                        },
                        include: { model: Educator },
                        order: orderRule,
                    });
                } else if (_user.role === 4 || _user.role === 7) {
                    if (!_user.institutionalAffiliation) {
                        throw new Error('Нет привязки (institutionalAffiliation) к институту у директора');
                    }
                    const allowedDepartments = [];

                    const start =
                        _user.institutionalAffiliation === 1 ? 0 : _user.institutionalAffiliation === 2 ? 13 : 17;
                    const end =
                        _user.institutionalAffiliation === 1 ? 12 : _user.institutionalAffiliation === 2 ? 16 : 24;

                    for (let i = start; i <= end; i++) {
                        allowedDepartments.push(i);
                    }
                    workloads = await Workload.findAll({
                        where: {
                            department: allowedDepartments,
                            isOid: false,
                            isBlocked: false,
                        },
                        include: { model: Educator },
                        order: orderRule,
                    });
                } else {
                    workloads = await Workload.findAll({
                        where: {
                            isBlocked: false,
                            isOid: false,
                        },
                        include: { model: Educator },
                        order: orderRule,
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
        const departmentsObj = Object.entries(departments).map(([name, id]) => ({
            name,
            id,
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

    async splitRow({ body: { ids, n }, user }, res) {
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            throw new Error('Укажите идентификаторы нагрузок для разделения');
        }
        if (!n || isNaN(n) || n < 1) {
            throw new Error('Укажите количество групп для разделения нагрузки');
        }
        if (n > 4) {
            throw new Error('Максимальное количество групп для разделения нагрузки - 4');
        }

        // Проверяем существование всех нагрузок
        const existingWorkloads = await Workload.findAll({ where: { id: ids } });

        for (const workload of existingWorkloads) {
            if (workload.isSplit) throw new AppErrorForbiddenAction();
        }

        if (existingWorkloads.length !== ids.length) {
            const existingIds = existingWorkloads.map(workload => workload.id);
            const nonExistingIds = ids.filter(id => !existingIds.includes(id));
            res.status(404).json({ error: `Нагрузки с идентификаторами ${nonExistingIds.join(', ')} не найдены` });
            return;
        }

        // Разделяем нагрузки
        const newWorkloads = [];
        for (const workload of existingWorkloads) {
            const studentsCount = workload.numberOfStudents;
            const studentsPerGroup = Math.floor(studentsCount / n);
            const remainder = studentsCount % n;
            // Создаем и сохраняем новые нагрузки в базу данных
            for (let i = 0; i < n; i++) {
                const copyWorkload = {
                    ...workload.get(),
                    isMerged: false,
                };
                copyWorkload.isSplit = true;
                copyWorkload.originalId = workload.id;
                delete copyWorkload.id;
                delete copyWorkload.educatorId;
                delete copyWorkload.EducatorId;
                // Распределение студентов между группами
                if (i < remainder) {
                    // Если индекс группы меньше остатка, добавляем по одному студенту
                    copyWorkload.numberOfStudents = studentsPerGroup + 1;
                } else {
                    // В остальных случаях добавляем студентов равномерно
                    copyWorkload.numberOfStudents = studentsPerGroup;
                }

                const newWorkload = await Workload.create(copyWorkload);
                newWorkloads.push(newWorkload);
            }

            // Удаляем изначальную нагрузку
            await workload.destroy();
        }

        await History.create({
            type: 1,
            department: existingWorkloads[0].department,
            before: getIds(existingWorkloads),
            after: getIds(newWorkloads),
        });

        res.json(newWorkloads);
    },

    // Получение нагрузки
    async getOne({ params: { id } }, res) {
        const workload = await Workload.findByPk(id);
        if (!workload) throw new Error('Нет такой нагрузки');
        const workloadDto = new WorkloadDto(workload);
        res.json(workloadDto);
    },

    async update({ params: { id }, body: { numberOfStudents, hours, comment } }, res) {
        try {
            const workload = await Workload.findByPk(id, {
                include: { model: Educator },
            });

            if (!id) throw new AppErrorMissing('id');
            if (!workload) throw new AppErrorNotExist('workload');

            if (!numberOfStudents) numberOfStudents = workload.numberOfStudents;
            if (!hours) hours = workload.hours;
            if (!comment) comment = workload.comment;
            // Обновляем запись в таблице Workload
            await workload.update({
                numberOfStudents,
                hours,
                comment,
            });

            await History.create({
                type: 3,
                department: workload[0].department,
                before: [],
                after: [workload.id],
            });

            res.json(workload);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async facultyEducator({ body: { educatorId, workloadIds } }, res) {
        if (!educatorId) throw new AppErrorMissing('educatorIds');
        if (!workloadIds) throw new AppErrorMissing('workloadIds');
        if (!Array.isArray(workloadIds)) throw new AppErrorInvalid('workloadIds');

        const checkWorkloads = await Workload.findAll({ where: { id: workloadIds } });
        if (checkWorkloads.some(workload => !workload)) throw new AppErrorNotExist('workload');

        await Workload.update(
            { educatorId },
            {
                where: { id: workloadIds },
                individualHooks: true,
            }
        );
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

    async unfacultyEducator({ body: { workloadId } }, res) {
        if (!workloadId) throw new AppErrorMissing('workloadId');
        const workload = await Workload.findByPk(workloadId);
        if (!workload) throw new AppErrorInvalid('workload');
        const educatorId = workload.educatorId;
        await workload.update({ educatorId: null });

        const remainingWorkloads = await Workload.count({ where: { educatorId } });
        console.log(remainingWorkloads);

        if (remainingWorkloads === 0) {
            // Если нет нагрузок, удаляем предупреждение
            await Notification.destroy({ where: { educatorId } }); // Предположим, что у вас есть метод для удаления summaryWorkload по educatorId
        } else {
            // Если остались нагрузки, все равно вызываем проверку часов
            const summaryWorkload = await SummaryWorkload.findOne({ where: { educatorId } });
            await checkHours(summaryWorkload); // Передаем summaryWorkload в функцию checkHours
        }

        await History.create({
            type: 3,
            department: workload.department,
            before: [workloadId],
            after: [],
        });

        res.json({ status: 'OK' });
    },

    async mapRow({ body: { ids }, user }, res) {
        const workloads = await Workload.findAll({ where: { id: ids } }, { include: { model: Educator } });

        if (!ids) {
            throw new AppErrorMissing('id');
        }
        // Проверка массива нагрузок на идентичность полей для соединения
        const firstWorkload = workloads[0];
        if (
            workloads.some(
                workload =>
                    workload.department !== firstWorkload.department ||
                    workload.workload !== firstWorkload.workload ||
                    workload.discipline !== firstWorkload.discipline ||
                    workload.core !== firstWorkload.core ||
                    workload.specialty !== firstWorkload.specialty ||
                    workload.hours !== firstWorkload.hours
            )
        ) {
            return res.status(400).json({
                error: 'Invalid request. Department, workload, and discipline must be the same for all workloads.',
            });
        }

        // Совмещаем часы
        let totalStudents = 0;

        workloads.forEach(workload => {
            totalStudents += workload.numberOfStudents;
        });

        // Создаем совмещенную нагрузку
        const mergeWorkload = {
            department: firstWorkload.get('department'),
            discipline: firstWorkload.get('discipline'),
            workload: firstWorkload.get('workload'),
            groups: firstWorkload.get('groups'),
            block: firstWorkload.get('block'),
            semester: firstWorkload.get('semester'),
            period: firstWorkload.get('period'),
            curriculum: firstWorkload.get('curriculum'),
            curriculumUnit: firstWorkload.get('curriculumUnit'),
            formOfEducation: firstWorkload.get('formOfEducation'),
            levelOfTraining: firstWorkload.get('levelOfTraining'),
            specialty: firstWorkload.get('specialty'),
            core: firstWorkload.get('core'),
            numberOfStudents: totalStudents,
            hours: firstWorkload.get('hours'),
            audienceHours: firstWorkload.get('audienceHours'),
            ratingControlHours: firstWorkload.get('ratingControlHours'),
            comment: firstWorkload.get('comment'),
            isSplit: false,
            isMerged: true,
            originalId: null,
            isOid: firstWorkload.get('isOid'),
            kafedralAutumnWorkload: firstWorkload.get('kafedralAutumnWorkload'),
            kafedralSpringWorkload: firstWorkload.get('kafedralSpringWorkload'),
            kafedralAdditionalWorkload: firstWorkload.get('kafedralAdditionalWorkload'),
            instituteAutumnWorkload: firstWorkload.get('instituteAutumnWorkload'),
            instituteSpringWorkload: firstWorkload.get('instituteSpringWorkload'),
            instituteManagementWorkload: firstWorkload.get('instituteManagementWorkload'),
        };

        const createdWorkload = await Workload.create(mergeWorkload);

        // Удаляем записи которые учавствовали в совмещении
        workloads.reduce((chain, workload) => {
            return chain.then(() => workload.destroy());
        }, Promise.resolve());

        await History.create({
            type: 2,
            department: workloads[0].department,
            before: getIds(workloads),
            after: [createdWorkload.id],
        });

        const responseData = {
            id: createdWorkload.id,
            ...mergeWorkload,
        };
        res.json(responseData);
    },

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
                sendMail(process.env.EMAIL_RECIEVER, 'blocking', 'Общеинститутская нагрузка');
            } catch (e) {
                console.log('Email bad creditionals');
            }
        } else {
            if (!Object.values(departments).includes(department)) throw new AppErrorInvalid('department');
            await Workload.update({ isBlocked: true }, { where: { department } });
            try {
                sendMail(process.env.EMAIL_RECIEVER, 'blocking', `Нагрузка кафедры ${mapDepartments[department]}`);
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
            const filteredDepartmentsNew = [];
            const allowed = _user.allowedDepartments;
            for (const x of filteredDepartments) {
                if (allowed.includes(departments[x.name])) {
                    filteredDepartmentsNew.push(x);
                }
            }
            res.json(filteredDepartmentsNew);
        } else if (_user.role === 1) {
            filteredDepartments = Object.entries(departments).map(([name, id]) => ({
                name,
                id,
            }));
            console.log(filteredDepartments);
        }
        res.json(filteredDepartments);
    },
};
