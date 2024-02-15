import getHours from "./get-hours.js";
async function getSumHours(summaryWorkload) {
    const hours = await getHours(summaryWorkload.id);

    //Нужно получить сумму часов у workloads по кафедральным предметам и сумму часов по институтским предметам
    summaryWorkload.totalKafedralHours =
        hours.kafedralAdditionalWorkload + hours.kafedralAutumnWorkload + hours.kafedralSpringWorkload;
    summaryWorkload.totalOIDHours =
        hours.instituteAutumnWorkload + hours.instituteSpringWorkload + hours.instituteManagementWorkload;
    summaryWorkload.totalHours = kafedralSummary + instututeSummary;


    summaryWorkload.save(totalKafedralHours, totalOIDHours, totalHours);
}
export default getSumHours;
