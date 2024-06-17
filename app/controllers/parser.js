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
        const workbook = XLSX.readFile(req.file.path);
        
        const recordsToDelete = await Workload.findAll({
            where: {
                department: numberDepartment,
            },
        });

        for (const record of recordsToDelete) {
            console.log(record.id)
            await this.deleteHours(record); // Прямой вызов deleteHours
            await Workload.destroy({
                where: {
                    id: record.id,
                },
            });
        }

        const sheetName = workbook.SheetNames[0];
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
            header: 1,
            defval: '',
            blankrows: true,
        });
        const isOid = numberDepartment == 0;
        const headers = sheetData[0];
        console.log('Total rows after slice:', sheetData.slice(1).length);
        for (const row of sheetData.slice(1, sheetData.length - 1)) {
            try {
                const obj = {};
                headers.forEach((header, index) => {
                    const englishHeader = HeaderTranslation[header];
                    obj[englishHeader] = row[index];
                });
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
            'Профессор',
            'Заведующий кафедрой',
            'Директор',
            'Научный сотрудник',
            'Директор института',
        ];
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
                    const newRate = newEducator.rate.trim().split(' ');
                    let numberPart = parseFloat(newRate[0].replace(',', '.'));
                    if (!Number(numberPart)) {
                        numberPart = 0;
                    }
                    newEducator.rate = numberPart;
                    await Educator.create(newEducator);
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
    
    async deleteHours(newWorkload) {
        const previousWorkload = newWorkload._previousDataValues;
        if (previousWorkload.educatorId === null) return;
        const summaryWorkload = await SummaryWorkload.findOne({ where: { educatorId: previousWorkload.educatorId } });

        const hours = {
            kafedralAutumnWorkload: 0,
            kafedralSpringWorkload: 0,
            kafedralAdditionalWorkload: 0,
            instituteAutumnWorkload: 0,
            instituteSpringWorkload: 0,
            instituteManagementWorkload: 0,
            totalKafedralHours: 0,
            totalOidHours: 0,
            totalHours: 0,
        };

        // Проверяем предмет на общеинститутский ли он и период и устанавливаем часы для кафедральных или институтских дисциплин
        if (!newWorkload.isOid && newWorkload.period === 1)
            hours.kafedralAutumnWorkload += parseFloat(previousWorkload.hours);
        if (!newWorkload.isOid && newWorkload.period === 2)
            hours.kafedralSpringWorkload += parseFloat(previousWorkload.hours);
        if (!newWorkload.isOid && !newWorkload.period)
            hours.kafedralAdditionalWorkload += parseFloat(previousWorkload.hours);
        if (newWorkload.isOid && newWorkload.period === 1)
            hours.instituteAutumnWorkload += parseFloat(previousWorkload.hours);
        if (newWorkload.isOid && newWorkload.period === 2)
            hours.instituteSpringWorkload += parseFloat(previousWorkload.hours);
        if (newWorkload.isOid && !newWorkload.period)
            hours.instituteManagementWorkload += parseFloat(previousWorkload.hours);

        hours.totalKafedralHours +=
            hours.kafedralAutumnWorkload + hours.kafedralSpringWorkload + hours.kafedralAdditionalWorkload;
        hours.totalOidHours +=
            hours.instituteAutumnWorkload + hours.instituteSpringWorkload + hours.instituteManagementWorkload;
        hours.totalHours += hours.totalKafedralHours + hours.totalOidHours;

        summaryWorkload.kafedralAutumnWorkload -= hours.kafedralAutumnWorkload;
        summaryWorkload.kafedralSpringWorkload -= hours.kafedralSpringWorkload;
        summaryWorkload.kafedralAdditionalWorkload -= hours.kafedralAdditionalWorkload;
        summaryWorkload.instituteAutumnWorkload -= hours.instituteAutumnWorkload;
        summaryWorkload.instituteSpringWorkload -= hours.instituteSpringWorkload;
        summaryWorkload.instituteManagementWorkload -= hours.instituteManagementWorkload;
        summaryWorkload.totalKafedralHours -= hours.totalKafedralHours;
        summaryWorkload.totalOidHours -= hours.totalOidHours;
        summaryWorkload.totalHours -= hours.totalHours;
        await summaryWorkload.save();
    }
};
