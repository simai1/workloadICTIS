import XLSX from "xlsx";
import Educator from "../models/educator.js";
import Workload from "../models/workload.js";
import FullNameDepartments from "../config/full-name-departments.js"
import { sequelize } from "../models/index.js";


export default {
    async parseFromXlsx(req, res){
        const numberDepartment  = req.params.numberDepartment;
        await sequelize.query(`DELETE FROM workloads where department=${numberDepartment}`, null);
        
        const workbook = XLSX.readFile(req.file.path);
        const workload = [];

        Object.keys(workbook.Sheets).forEach((name) => {
            const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[name], {header: 1});
            workload.push({ name, data: sheetData });
        });

        const dataWorkload = workload[0].data;
        for (const element of dataWorkload) {
            const id = element[0];
            if(Number(id)) {
                console.log(id)
                try {
                    let department = element[2];
                    const discipline = element[4] ?? '';
                    const workload = element[8];
                    const groups = element[9] ?? '';
                    const block = element[10] ?? '';
                    const semester = element[11] ?? '';
                    const period = element[12] ?? 0;
                    const curriculum = element[13] ?? '';
                    const curriculumUnit = element[14] ?? '';
                    const formOfEducation = element[16] ?? '';
                    const levelOfTraining = element[17] ?? '';
                    const specialty = element[18] ?? '';
                    const core = element[19] ?? '';
                    const numberOfStudents = element[21] ? Number(element[21].replace(',00','')) : 0;
                    const hours = element[22] ? parseFloat(element[22].replace(',','.')) : 0.00;
                    const audienceHours = element[25] ? parseFloat(element[25].replace(',','.')): 0.00;
                    const ratingControlHours = hours - audienceHours;
                    const nameEducator = element[28] ?? '';
                    const isSplit = false;
                    console.log(nameEducator)
                    department = FullNameDepartments[department];

                    const existEducator = await Educator.findOne({
                        where: {
                            name: nameEducator,
                        }
                    });
                    const educatorId = existEducator ? existEducator.id : null;

                    await Workload.create({
                        discipline,
                        department,
                        workload,
                        groups,
                        block,
                        semester,
                        period,
                        curriculum,
                        curriculumUnit,
                        formOfEducation,
                        levelOfTraining,
                        specialty,
                        core,
                        numberOfStudents,
                        hours,
                        audienceHours,
                        ratingControlHours,
                        isSplit,
                        educatorId,
                    })

                } catch (e) {
                    console.log(e)
                    return res.status(400).json({status: "error", message: e.message});
                }
            }
            else console.log(id);
        }
        return res.json({status: "ok"});
    }
}
