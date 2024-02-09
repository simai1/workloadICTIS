import { AppErrorInvalid, AppErrorMissing } from '../utils/errors.js';
import departments from '../config/departments.js';
import Workload from '../models/workload.js';
import WorkloadDto from '../dtos/workloadDto.js';
import { AppErrorAlreadyExists} from '../utils/errors.js';
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
    // todo: Написать запросы
    async splitRow({ params: { id }, body: { n } }, res) {
        try {
            // Проверяем, что параметры корректны
            if (!id) throw new AppErrorMissing('id');
            if (!n || isNaN(n) || n < 1) throw new AppErrorMissing('Valid n value');
        
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
    
        
        // Отправляем результат в формате JSON
      
          
     //Получить список преподов
     async getEducators(){},
     //Обновить поля все
     async update(){},
     //...?
     async sort(){},

};
