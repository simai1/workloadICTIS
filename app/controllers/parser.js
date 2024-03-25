import XLSX from "xlsx";
import Educator from "../models/educator.js";
import {DataTypes} from "sequelize";
import EnumDepartments from "../config/departments.js";
import {AppErrorNotExist} from "../utils/errors.js";
import Workload from "../models/workload.js";

export default {
    //departmen
    //
    async parseFromXlsx(fileLocation, res){
        let workbook = XLSX.readFile(fileLocation);
        const workload = [];

        Object.keys(workbook.Sheets).forEach((name) => {
            const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[name], {header: 1});
            workload.push({ name, data: sheetData });
        });

        const dataWorkload = workload[0].data;
        for (const element of dataWorkload) {
            console.log("--------------------------------------------------------")
            console.log(element)
            const id = element[0];
            if(Number(id)) {
                try {
                    const discipline = element[2];
                    const workload = element[3];
                    const groups = element[4];
                    const block = element[5];
                    const semester = element[6];
                    const period = element[7];
                    const curriculum = element[8];
                    const curriculumUnit = element[9];
                    const formOfEducation = element[11];
                    const levelOfTraining = element[12];
                    const specialty = element[13];
                    const core = element[14];
                    const numberOfStudents = Number(element[16].replace(',00',''));
                    const hours = parseFloat(element[17].replace(',','.'));
                    const audienceHours = parseFloat(element[18].replace(',','.'));
                    const ratingControlHours = hours - audienceHours;
                    const nameEducator = element[21];
                    //
                    const department = 2;
                    const isSplit = false;

                    console.log('nameEducator')
                    console.log(nameEducator)
                    const existEducator = await Educator.findOne({
                        where: {
                            name: nameEducator,
                        }
                    });
                    console.log(existEducator?.dataValues)
                    if(!existEducator) throw new AppErrorNotExist('educator');
                    const newWorkload = await Workload.create({
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
                    })
                    console.log(newWorkload.dataValues)


                } catch (e) {
                    console.log(e)
                }

            }
            console.log("--------------------------------------------------------")
        }

        return res.json(dataWorkload);
    }
}
