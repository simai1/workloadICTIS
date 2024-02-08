import { AppErrorInvalid, AppErrorMissing } from '../utils/errors.js';
import departments from '../config/departments.js';
import Workload from '../models/workload.js';
import WorkloadDto from '../dtos/workloadDto.js';

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
     //Разделить одну нагруозку на несколько подгрупп. !Сумма часов не совпадает
     async splitRow(){},
     //Получить список преподов
     async getEducators(){},
     //Обновить поля все
     async update(){},
     //...?
     async sort(){},

};
