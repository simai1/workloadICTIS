import { AppErrorInvalid, AppErrorMissing } from '../utils/errors.js';
import departments from '../config/departments.js';
import Workload from '../models/workload.js';
import Educator from '../models/educator.js';

import WorkloadDto from '../dtos/workload-dto.js';
import { where } from 'sequelize';

export default {
    async getDepartment({ params: { department } }, res) {
        if (!department) throw new AppErrorMissing('department');
        if (typeof department !== 'number') department = parseInt(department);
        if (!Object.values(departments).includes(department)) throw new AppErrorInvalid(department);
        const workloads = await Workload.findAll({
            where: { department },
            include: { model: Educator },
        });
        // res.json(workloads);
        const workloadsDto = [];
        for (const workload of workloads) {
            const workloadDto = new WorkloadDto(workload);
            workloadsDto.push(workloadDto);
        }
        res.json(workloadsDto);
    },

    async splitRow({ params: { id }, body: { n } }, res) {
        try {
            // Проверяем, что параметры корректны
            if (!id) throw new Error('Укажите айди нагрузки');
            if (!n || isNaN(n) || n < 1) throw new Error('Укажите количество групп для разделения нагрузки');

            // Загружаем изначальную нагрузку
            const originalWorkload = await Workload.findByPk(id);
            if (!originalWorkload) throw new Error('Workload not found');

            // Проверяем, разделена ли уже нагрузка
            if (originalWorkload.isSplit === true) {
                throw new Error('Нагрузка уже разделена по группам или ее нельзя делить');
            } else {
                // Распределяем время равномерно между каждой из новых нагрузок
                const newWorkloads = [];
                const newHours = originalWorkload.hours / n;

                // Создаем и сохраняем новые нагрузки в базу данных
                for (let i = 0; i < n; i++) {
                    // Копируем изначальную нагрузку со всеми полями
                    const copyWorkload = { ...originalWorkload.get() };

                    // Устанавливаем новое время и флаг разделения для каждой новой нагрузки
                    copyWorkload.hours = newHours;
                    copyWorkload.isSplit = true;
                    copyWorkload.originalId = originalWorkload.id;

                    // Удаляем уникальный идентификатор для создания нового
                    delete copyWorkload.id;

                    // Сохраняем новую нагрузку в базу данных
                    const newWorkload = await Workload.create(copyWorkload);

                    // Добавляем новую нагрузку в массив новых нагрузок
                    newWorkloads.push(newWorkload);
                }

                // Помечаем изначальную нагрузку как разделенную
                originalWorkload.isSplit = true;
                await originalWorkload.save();

                res.json(newWorkloads);
            }
        } catch (error) {
            // Обработка ошибок
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async getOne({ params: { id } }, res) {
        // if(!workloadId) throw new Error('Не указан айди нагрузки');
        const workload = await Workload.findByPk(id);
        if (!workload) throw new Error('Нет такой нагрузки');
        const workloadDto = new WorkloadDto(workload);
        res.json(workloadDto);
    },

    async getEducators(res) {
        // Реализация метода получения списка преподавателей
    },

    async update({ params: { id }, body: { name, numberOfStudents, hours, comment } }, res) {
        try {
            const workload = await Workload.findByPk(id, {
                include: { model: Educator },
            });
            if (!numberOfStudents && !hours && !comment) {
                throw new Error('Не указаны обязательные поля');
            }

            if (!workload) {
                throw new Error('Нет такой нагрузки');
            }

            // Обновляем поля
            numberOfStudents = numberOfStudents || workload.numberOfStudents;
            hours = hours || workload.hours;
            comment = comment || workload.comment;

            // Если указано новое имя, обновляем его в таблице Educator
            // if (name) {
            //     if (!workload.Educator) {
            //         throw new Error('Нагрузка не связана с преподавателем');
            //     }

            //     await workload.Educator.update({ name });
            // }

            // Обновляем запись в таблице Workload
            await workload.update({
                numberOfStudents,
                hours,
                comment,
            });

            res.json({ status: 'OK' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    //TODO: Переписать назначение препода для нагрузки
    async facultyEducator({ body: { educatorId, workloadId } }, res) {
        if (!educatorId) throw new AppErrorMissing('educatorId');
        if (!workloadId) throw new AppErrorMissing('workloadId');
        const efw = await EducatorForWorkload.create({
            EducatorId: educatorId,
            WorkloadId: workloadId,
        });
        res.json({ status: 'OK' });
    },

    async mapRow({ body: { ids } }, res) {
        try {
            const workloads = await Workload.findAll({ where: { id: ids } });

            if (!id) {
                throw new AppErrorMissing('id');
            }
            const firstWorkload = workloads[0];
            if (
                workloads.some(
                    workload =>
                        workload.department !== firstWorkload.department ||
                        workload.workload !== firstWorkload.workload ||
                        workload.discipline !== firstWorkload.discipline
                )
            ) {
                return res
                    .status(400)
                    .json({
                        error: 'Invalid request. Department, workload, and discipline must be the same for all workloads.',
                    });
            }

            let totalStudents = 0;
            let totalHours = 0;

            workloads.forEach(workload => {
                totalStudents += workload.numberOfStudents;
                totalHours += workload.hours;
            });

            const mergeWorkload = await Workload.create({
                department: workloads[0].get('department'),
                discipline: workloads[0].get('discipline'),
                workload: workloads[0].get('workload'),
                groups: workloads[0].get('groups'),
                block: workloads[0].get('block'),
                semester: workloads[0].get('semester'),
                period: workloads[0].get('period'),
                curriculum: workloads[0].get('curriculum'),
                curriculumUnit: workloads[0].get('curriculumUnit'),
                formOfEducation: workloads[0].get('formOfEducation'),
                levelOfTraining: workloads[0].get('levelOfTraining'),
                specialty: workloads[0].get('specialty'),
                core: workloads[0].get('core'),
                numberOfStudents: totalStudents,
                hours: totalHours,
                audienceHours: workloads[0].get('audienceHours'),
                ratingControlHours: workloads[0].get('ratingControlHours'),
                comment: workloads[0].get('comment'),
                isSplit: false,
                originalId: null,
            });

            await Promise.allSettled(workloads.map(workload => workload.destroy()));

            res.status(200).json('Successfully merged');
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
};
