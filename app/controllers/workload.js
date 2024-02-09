import { AppErrorInvalid, AppErrorMissing, AppErrorAlreadyExists, AppErrorNotFound } from '../utils/errors.js';
import departments from '../config/departments.js';
import Workload from '../models/workload.js';
import WorkloadDto from '../dtos/workloadDto.js';
import _ from 'lodash';

export default {
    async getDepartment({ params: { department } }, res) {
        if (!department) throw new AppErrorMissing('department');
        if (typeof department !== 'number') department = parseInt(department);
        if (!Object.values(departments).includes(department)) throw new AppErrorInvalid(department);
        const workloads = await Workload.findAll({ where: { department } });
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
            if (!originalWorkload) throw new AppErrorNotFound('Workload not found');
        
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

    async getOne({params: {workloadId}}, res) {
        if(!workloadId) throw new Error('Не указан айди нагрузки');
        const workload = await Workload.findByPk(workloadId);
        if(!workload) throw new Error('Нет такой нагрузки');
        const workloadDto = new WorkloadDto(workload);
        res.json(workloadDto);
    },

    async getEducators(res) {
        // Реализация метода получения списка преподавателей
    },

    async update({params: {workloadId}, body: {numberOfStudents, hours, comment}}, res) {
        if(!workloadId) throw new Error('Не указан айди нагрузки');
        const workload = await Workload.findByPk(workloadId);
        if (!numberOfStudents && !hours && !comment) throw new Error('Не указаны обязательные поля');
        if(!numberOfStudents) numberOfStudents = workload.numberOfStudents;
        if(!hours) hours = workload.hours;
        if(!comment) comment = workload.comment;
        if (!workload) throw new Error('Нет такой нагрузки');
        await workload.update({
            numberOfStudents,
            hours,
            comment,
        });
        res.json({status: 'OK'});
    },

    async sort(res) {
        // Реализация метода сортировки
    },
};
