import XLSX from "xlsx";

export default {
    async parseFromXlsx(fileLocation, res){
        let workbook = XLSX.readFile(fileLocation);
        const dataWorkload = [];

        Object.keys(workbook.Sheets).forEach((name) => {
            const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[name], {header: 1});
            dataWorkload.push({ name, data: sheetData });
        });

        dataWorkload.forEach((element) =>{
            console.log(element.data[0])
            console.log(element.data[1])

        })

        return res.json(dataWorkload[0].data);
    }
}
