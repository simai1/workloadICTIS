import XLSX from "xlsx";
import Educator from "../models/educator.js";
import Workload from "../models/workload.js";
import FullNameDepartments from "../config/full-name-departments.js"
import { sequelize } from "../models/index.js";
import HeaderTranslation from "../config/header_translation.js";

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

        const headers = sheetData[0];

        sheetData.slice(1).map(async row => {
            try {
                if(Number(row[0])){
                    console.log(row[0])
                    const obj = {};
                    headers.forEach((header, index) => {
                        const englishHeader = HeaderTranslation[header];
                        obj[englishHeader] = row[index];
                    });

                    obj.department = FullNameDepartments[obj.department];
                    obj.numberOfStudents = obj.numberOfStudents ? Number(obj.numberOfStudents.replace(',00','')) : 0;
                    obj.hours = obj.hours ? parseFloat(obj.hours.replace(',','.')) : 0.00;
                    obj.audienceHours = obj.audienceHours ? parseFloat(obj.audienceHours.replace(',','.')) : 0.00;
                    const ratingControlHours = obj.hours - obj.audienceHours;
                    obj.ratingControlHours = parseFloat(ratingControlHours.toFixed(2));
                    obj.period = Number(obj.period);
                    
                    const existEducator = await Educator.findOne({
                        where: {
                            name: obj.educator,
                        }
                    });
                    const educatorId = existEducator ? existEducator.id : null;
                    const isSplit = false;
    
                    delete obj.educator;
                    delete obj.undefined;
                    await Workload.create({
                        ...obj,
                        educatorId,
                        isSplit,
                    })
                }
            } catch (e) {
                console.log(e)
            }
        });

        return res.json({status: "ok"});
    }
    
}
