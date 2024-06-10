import {addHoursForEducator} from './summary-workload.js';

function promiseForAddHoursForEducator(workload) {
    return new Promise((resolve, reject) => {
        try {
            addHoursForEducator(workload);
            resolve(true); // Если операция прошла успешно
        } catch (error) {
            reject(error); // Если произошла ошибка
        }
    });
}

export {promiseForAddHoursForEducator};