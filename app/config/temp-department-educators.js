import { mapObjectKeys } from "../utils/map.js";

const tempDepartmentEducators = {
    'Вакансия БИТ 0': 1,
    'Вакансия ИИТиС 0': 2,
    'Вакансия ВТ 0': 3,
    'Вакансия ИАСБ 0': 4,
    'Вакансия ИБТКС 0': 5,
    'Вакансия ИМС 0': 6,
    'Вакансия МОПЭВМ 0': 7,
    'Вакансия ПиБЖ 0': 8,
    'Вакансия САИТ 0': 9,
    'Вакансия САПР 0': 10,
    'Вакансия СиПУ 0': 11,
    'Вакансия ФМОИО 0': 12,
}

export default tempDepartmentEducators;

export const map = mapObjectKeys(tempDepartmentEducators);