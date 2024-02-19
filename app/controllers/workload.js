import { AppErrorInvalid, AppErrorMissing } from '../utils/errors.js';
import departments from '../config/departments.js';
import Workload from '../models/workload.js';
import Educator from '../models/educator.js';

import WorkloadDto from '../dtos/workload-dto.js';

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
    },

    //Получение нагрузки
    async getOne({ params: { id } }, res) {
        const workload = await Workload.findByPk(id);
        if (!workload) throw new Error('Нет такой нагрузки');
        const workloadDto = new WorkloadDto(workload);
        res.json(workloadDto);
    },

    async getEducators(res) {
        // Реализация метода получения списка преподавателей
    },

    async update({ params: { id }, body: { name, numberOfStudents, hours, comment } }, res) {
        const workload = await Workload.findByPk(id, {
            include: { model: Educator },
        });

        if (!id) throw new Error('Не указан ID');
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

        // Обновляем запись в таблице Workload
        await workload.update({
            numberOfStudents,
            hours,
            comment,
        });

        res.json({ status: 'OK' });
    },

    async facultyEducator({ body: { educatorId, workloadId } }, res) {
        if (!educatorId) throw new AppErrorMissing('educatorId');
        if (!workloadId) throw new AppErrorMissing('workloadId');
        await Workload.update(
            { educatorId },
            {
                where: { id: workloadId },
                individualHooks: true,
            }
        );
        res.json({ status: 'OK' });
    },

    async mapRow({ body: { ids } }, res) {
        const workloads = await Workload.findAll({ where: { id: ids } });

        if (!ids) {
            throw new AppErrorMissing('id');
        }
        //Проверка массива нагрузок на идентичность полей для соединения
        const firstWorkload = workloads[0];
        if (
            workloads.some(
                workload =>
                    workload.department !== firstWorkload.department ||
                    workload.workload !== firstWorkload.workload ||
                    workload.discipline !== firstWorkload.discipline
            )
        ) {
            return res.status(400).json({
                error: 'Invalid request. Department, workload, and discipline must be the same for all workloads.',
            });
        }

        //Совмещаем часы
        let totalStudents = 0;
        let totalHours = 0;

        workloads.forEach(workload => {
            totalStudents += workload.numberOfStudents;
            totalHours += workload.hours;
        });

        //Создаем совмещенную нагрузку
        const mergeWorkload = await Workload.create({
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
            hours: totalHours,
            audienceHours: firstWorkload.get('audienceHours'),
            ratingControlHours: firstWorkload.get('ratingControlHours'),
            comment: firstWorkload.get('comment'),
            isSplit: false,
            originalId: null,
            isOid: firstWorkload.get('isOid'),
            kafedralAutumnWorkload: firstWorkload.get('kafedralAutumnWorkload'),
            kafedralSpringWorkload: firstWorkload.get('kafedralSpringWorkload'),
            kafedralAdditionalWorkload: firstWorkload.get('kafedralAdditionalWorkload'),
            instituteAutumnWorkload: firstWorkload.get('instituteAutumnWorkload'),
            instituteSpringWorkload: firstWorkload.get('instituteSpringWorkload'),
            instituteManagementWorkload: firstWorkload.get('instituteManagementWorkload'),
        });

        //Удаляем записи которые учавствовали в совмещении
        await Promise.allSettled(workloads.map(workload => workload.destroy()));

        res.status(200).json('Successfully merged');
    },

    async deleteWorkload({ params: { id } }, res) {
        if (!id) throw new AppErrorMissing('id');

        const workload = await Workload.findByPk(id);

        if (!workload) {
            return res.status(404).json('Workload not found');
        }

        // Delete the instance from the database
        await workload.destroy({force: true});

        res.status(200).json('Successfully deleted');
    },

    // Нужен метод, который будет просчитывать часы у конкретного препода
};
