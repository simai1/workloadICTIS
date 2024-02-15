import HoursDto from "../dtos/hours-dto.js";
import SummaryWorkload from "../models/summary-workload.js";
async function getHours(id) {
    const summaryWorkload = await SummaryWorkload.findByPk(id);

    //получаем dto

    const hoursDto = new HoursDto(summaryWorkload);
    return hoursDto;
    
} 
export default getHours