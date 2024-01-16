import XLSX from "xlsx";

export default {
    async parseFromXlsx(fileLocation, res){
        console.log('SSSSSSSSSSSSS')
        let workbook = XLSX.readFile(fileLocation);
        let sheet_name_list = workbook.SheetNames;
        console.log('PPPPPPPPPP')
        return res.json({
            json: XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]])
        });
    },
}
