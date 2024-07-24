import {CronJob} from "cron";
import Educator from "../models/educator.js";
import Workload from "../models/workload.js";
import SummaryWorkload from "../models/summary-workload.js";
import checkHours from "../utils/notification.js";

export default {
  checkHours: new CronJob('0 4 * * *', async () => {
    console.log('[CRON] Start checkHours');
    const educators = await Educator.findAll({
      include: { model: Workload },
    });
    const educatorsWithCleanedWorkloads = educators.map(educator => ({
      ...educator.dataValues,
      Workloads: educator.Workloads.map(workload => workload.dataValues),
    }));
    for (const educator of educatorsWithCleanedWorkloads) {
      const summaryWorkload = await SummaryWorkload.findOne({ where: { educatorId: educator.id } });
      if (educator.Workloads.length !== 0) {
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
          const existWorkloads = educator.Workloads;
          for (const workload of existWorkloads) {
              if (!workload.isOid && workload.period === 1) hours.kafedralAutumnWorkload += workload.hours;
              if (!workload.isOid && workload.period === 2) hours.kafedralSpringWorkload += workload.hours;
              if (!workload.isOid && workload.period === 0) hours.kafedralAdditionalWorkload += workload.hours;
              if (workload.isOid && workload.period === 1) hours.instituteAutumnWorkload += workload.hours;
              if (workload.isOid && workload.period === 2) hours.instituteSpringWorkload += workload.hours;
              if (workload.isOid && workload.period === 0) hours.instituteManagementWorkload += workload.hours;

              hours.totalKafedralHours =
                  hours.kafedralAutumnWorkload + hours.kafedralSpringWorkload + hours.kafedralAdditionalWorkload;
              hours.totalOidHours =
                  hours.instituteAutumnWorkload +
                  hours.instituteSpringWorkload +
                  hours.instituteManagementWorkload;
              hours.totalHours = hours.totalKafedralHours + hours.totalOidHours;
          }

          summaryWorkload.kafedralAutumnWorkload = hours.kafedralAutumnWorkload;
          summaryWorkload.kafedralSpringWorkload = hours.kafedralSpringWorkload;
          summaryWorkload.kafedralAdditionalWorkload = hours.kafedralAdditionalWorkload;
          summaryWorkload.instituteAutumnWorkload = hours.instituteAutumnWorkload;
          summaryWorkload.instituteSpringWorkload = hours.instituteSpringWorkload;
          summaryWorkload.instituteManagementWorkload = hours.instituteManagementWorkload;
          summaryWorkload.totalKafedralHours = hours.totalKafedralHours;
          summaryWorkload.totalOidHours = hours.totalOidHours;
          summaryWorkload.totalHours = hours.totalHours;
          await summaryWorkload.save();
          await checkHours(summaryWorkload);
      } else {
          summaryWorkload.kafedralAutumnWorkload = 0;
          summaryWorkload.kafedralSpringWorkload = 0;
          summaryWorkload.kafedralAdditionalWorkload = 0;
          summaryWorkload.instituteAutumnWorkload = 0;
          summaryWorkload.instituteSpringWorkload = 0;
          summaryWorkload.instituteManagementWorkload = 0;
          summaryWorkload.totalKafedralHours = 0;
          summaryWorkload.totalOidHours = 0;
          summaryWorkload.totalHours = 0;
          await summaryWorkload.save();
          await checkHours(summaryWorkload);
      }
    }
    console.log('[CRON] End checkHours');
  })
}
