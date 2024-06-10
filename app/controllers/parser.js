import XLSX from "xlsx";
import Educator from "../models/educator.js";
import Workload from "../models/workload.js";
import FullNameDepartments from "../config/full-name-departments.js"
import { sequelize } from "../models/index.js";
import HeaderTranslation from "../config/header_translation.js";
import HeaderTranslationEducators from "../config/header_translation_educators.js";
import positions from "../config/position.js";
import recommendHours from "../config/recommend-hours.js";

export default {
    async parseWorkload(req, res){
        const numberDepartment  = req.params.numberDepartment;
        console.log()
        await sequelize.query(`DELETE FROM workloads where department=${numberDepartment}`, null);

        const workbook = XLSX.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
            header: 1,
            defval: '',
            blankrows: true
        });
        const isOid = (numberDepartment == 0);
        const headers = sheetData[0];

        for (const row of sheetData.slice(1)) {
            try {
                if (Number(row[0])) {
                    const obj = {};
                    headers.forEach((header, index) => {
                        const englishHeader = HeaderTranslation[header];
                        obj[englishHeader] = row[index];
                    });
        
                    obj.department = FullNameDepartments[obj.department];
                    obj.numberOfStudents = obj.numberOfStudents? Number(obj.numberOfStudents.replace(',00', '')) : 0;
                    obj.hours = obj.hours? parseFloat(obj.hours.replace(',', '.')) : 0.00;
                    obj.audienceHours = obj.audienceHours? parseFloat(obj.audienceHours.replace(',', '.')) : 0.00;
                    const ratingControlHours = obj.hours - obj.audienceHours;
                    obj.ratingControlHours = parseFloat(ratingControlHours.toFixed(2));
                    obj.period = Number(obj.period);
        
                    const existEducator = await Educator.findOne({
                        where: {
                            name: obj.educator,
                        }
                    });
                    const educatorId = existEducator? existEducator.id : null;
                    const isSplit = false;
        
                    delete obj.educator;
                    delete obj.undefined;
                    await Workload.create({
                       ...obj,
                        educatorId,
                        isSplit,
                        isOid,
                    }, { individualHooks: true }); // Убедитесь, что включили индивидуальные хуки
                }
            } catch (e) {
                console.log(e);
            }
        }

        return res.json({status: "ok"});
    },

    async parseEducators(req, res){
        const workbook = XLSX.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
            header: 1,
            defval: '',
            blankrows: true
        });
        const headers = sheetData[0];
        // Только ассистенты, доценты, профессоры, зав кафедрой, директор, и научные сотрудники
        const validPositions = ["Ассистент", "Доцент", "Профессор", "Заведующий кафедрой", "Директор", "Научный сотрудник", "Директор института"];
        sheetData.slice(1).map(async row => {
            try {
                const newEducator = {};
                headers.forEach((header, index) => {
                    const englishHeader = HeaderTranslationEducators[header];
                    newEducator[englishHeader] = row[index];
                });
                const existEducator = await Educator.findOne({where: 
                    {email:newEducator.email}}
                )
                newEducator.department = FullNameDepartments[newEducator.department];
                if (!existEducator && validPositions.includes(newEducator.position) && newEducator.department) {
                    delete newEducator.undefined;
                    newEducator.position = positions[newEducator.position];
                    const newRate = newEducator.rate.trim().split(' ');
                    let numberPart = parseFloat(newRate[0].replace(',', '.'));
                    if(!Number(numberPart)){
                        numberPart = 0;
                    }
                    newEducator.rate = numberPart;
                    newEducator.typeOfEmployment = 3;
                    await Educator.create(newEducator);
                }
                
            } catch (e) {
                //console.log(e)
            }
        });

        return res.json({status: "ok"});
    }
    
}
