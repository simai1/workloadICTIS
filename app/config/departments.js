import { mapObjectKeys } from '../utils/map.js';

const departments = {
    // ИКТИБ
    ОИД: 0,
    БИТ: 1,
    ВМ: 2,
    ВТ: 3,
    ИАСБ: 4,
    ИБТКС: 5,
    ИМС: 6,
    'МОП ЭВМ': 7,
    ПиБЖ: 8,
    САИТ: 9,
    САПР: 10,
    СиПУ: 11,
    ФМОИО: 12,
    // ИНЕП
    НТМСТ: 13,
    РТЭН: 14,
    ТБХ: 15,
    ЭГАиМТ: 16,
    // ИРТСУ
    АиРПУ: 17,
    ТОР: 18,
    РТС: 19,
    ВиРС: 20,
    ЛА: 21,
    ИГиКД: 22,
    САУ: 23,
    ЭиМ: 24,
};

export default departments;

export const map = mapObjectKeys(departments);
