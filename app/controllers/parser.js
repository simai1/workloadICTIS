import XLSX from 'xlsx';
import Educator from '../models/educator.js';
import Workload from '../models/workload.js';
import FullNameDepartments from '../config/full-name-departments.js';
import SummaryWorkload from '../models/summary-workload.js';
import departments from '../config/departments.js';
import { sequelize } from '../models/index.js';
import HeaderTranslation from '../config/header_translation.js';
import HeaderTranslationEducators from '../config/header_translation_educators.js';
import positions from '../config/position.js';
import recommendHours from '../config/recommend-hours.js';
import fs from 'fs';

export default {
    async parseWorkload(req, res) {
        const numberDepartment = req.params.numberDepartment;
        console.log(req.file.path)
        const workbook = XLSX.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
            header: 1,
            defval: '',
            blankrows: true,
        });
        const headers = sheetData[0];
        const checkDepart = {};
        const checkRow = sheetData[1];
        headers.forEach((header, index) => {
            const englishHeader = HeaderTranslation[header];
            checkDepart[englishHeader] = checkRow[index];
        });
        checkDepart.department = checkDepart.department.trim();
        checkDepart.department = FullNameDepartments[checkDepart.department];
        if(checkDepart.department !== Number(numberDepartment))
            throw new Error('Загруженная нагрузка не совпадает с кафедрой, которую вы отправили');
        
        const recordsToDelete = await Workload.findAll({
            where: {
                department: numberDepartment,
            },
        });

        for (const record of recordsToDelete) {
            await Workload.destroy({
                where: {
                    id: record.id,
                },
                individualHooks: true,
            });
        }

        const isOid = numberDepartment == 0;
        console.log('Total rows after slice:', sheetData.slice(1).length);
        for (const row of sheetData.slice(1, sheetData.length - 1)) {
            try {
                const obj = {};
                headers.forEach((header, index) => {
                    const englishHeader = HeaderTranslation[header];
                    obj[englishHeader] = row[index];
                });
                obj.department = obj.department.trim();
                obj.department = FullNameDepartments[obj.department];
                obj.numberOfStudents = obj.numberOfStudents ? Number(obj.numberOfStudents.replace(',00', '')) : 0;
                obj.hours = obj.hours ? parseFloat(obj.hours.replace(',', '.')) : 0.0;
                obj.audienceHours = obj.audienceHours ? parseFloat(obj.audienceHours.replace(',', '.')) : 0.0;
                const ratingControlHours = obj.hours - obj.audienceHours;
                obj.ratingControlHours = parseFloat(ratingControlHours.toFixed(2));
                obj.period = Number(obj.period);

                const existEducator = await Educator.findOne({
                    where: {
                        name: obj.educator,
                    },
                });
                const educatorId = existEducator ? existEducator.id : null;
                const isSplit = false;

                delete obj.educator;
                delete obj.undefined;
                await Workload.create(
                    {
                        ...obj,
                        educatorId,
                        isSplit,
                        isOid,
                    },
                    { individualHooks: true }
                );
            } catch (e) {
                console.log(e);
            }
        }

        try {
            fs.unlinkSync(req.file.path); // Синхронное удаление файла
            console.log('Файл успешно удален.');
        } catch (error) {
            console.error('Ошибка при удалении файла:', error);
        }

        return res.json({ status: 'ok' });
    },

    async parseEducators(req, res) {
        const workbook = XLSX.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
            header: 1,
            defval: '',
            blankrows: true,
        });
        const headers = sheetData[0];
        // Только ассистенты, доценты, профессоры, зав кафедрой, директор, и научные сотрудники + старший преподаватель старший научный сотрудник
        const validPositions = [
            'Ассистент',
            'Доцент',
            'Ведущий научный сотрудник',
            'Главный научный сотрудник',
            'Научный сотрудник',
            'Старший преподаватель',
            'Профессор',
            'Старший научный сотрудник',
            'Заведующий кафедрой',
            'Директор',
            'Научный сотрудник',
            'Директор института',
        ];
        console.log(sheetData.length)
        for (const row of sheetData.slice(1)) {
            try {
                const newEducator = {};
                headers.forEach((header, index) => {
                    const englishHeader = HeaderTranslationEducators[header];
                    newEducator[englishHeader] = row[index];
                });
                const existEducator = await Educator.findOne({ where: { email: newEducator.email } });
                newEducator.department = FullNameDepartments[newEducator.department];
                if (!existEducator && validPositions.includes(newEducator.position) && newEducator.department) {
                    delete newEducator.undefined;
                    newEducator.position = positions[newEducator.position];
                    let newRate = newEducator.rate.trim().split(' ');
                    let numberPart = parseFloat(newRate[0].replace(',', '.'));
                    if (!Number(numberPart) || Number(numberPart)< 0.1) {
                        numberPart = 1;
                    }
                    newEducator.rate = numberPart
                    const resEducator = await Educator.create({
                        name: newEducator.name,
                        email: newEducator.email,
                        department: newEducator.department,
                        position: newEducator.position,
                        rate: newEducator.rate,
                    });
                    //console.log("resEducator", resEducator.dataValues)
                }
            } catch (e) {
                // Обработка ошибок
            }
        }

        try {
            fs.unlinkSync(req.file.path); // Синхронное удаление файла
            console.log('Файл успешно удален.');
        } catch (error) {
            console.error('Ошибка при удалении файла:', error);
        }

        return res.json({ status: 'ok' });
    },
};
