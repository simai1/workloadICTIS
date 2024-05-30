import History from "../models/history.js";
import Workload from "../models/workload.js";
import {map as mapHistory} from "../config/history-type.js";
import Educator from "../models/educator.js";
import WorkloadDto from "../dtos/workload-dto.js";
import { AppErrorMissing, AppErrorNotExist } from "../utils/errors.js";

const convertToDto = (workloads) => {
  const workloadsDtos = [];
  for (const workload of workloads){
    workloadsDtos.push(new WorkloadDto(workload));
  }
  return workloadsDtos;
}
export default {
  async getAll(req, res){
      const histories = await History.findAll();
      const resArr = [];
      for (const history of histories){
        if (history.type === 1){
          const before = convertToDto(await Workload.findAll({ where: {id: history.before  }, include: {model: Educator},  paranoid: false }));
          const after = convertToDto(await Workload.findAll({ where: {id: history.after  }, include: {model: Educator}, paranoid: false }));
          resArr.push({
            id: history.id,
            type: mapHistory[1],
            before,
            after
          })
        } else if (history.type === 2){
          const before = convertToDto(await Workload.findAll({ where: {id: history.before  }, include: {model: Educator}, paranoid: false }));
          const after = convertToDto(await Workload.findAll({ where: {id: history.after  }, include: {model: Educator}, paranoid: false }));
          resArr.push({
            id: history.id,
            type: mapHistory[2],
            before,
            after
          })
        } else {
          const record = {
            id: history.id,
            type: mapHistory[3],
            before: [],
            after: []
          }
          if (history.before.length !== 0) {
            record.before = convertToDto(await Workload.findAll({
              where: { id: history.before },
              include: {model: Educator},
              paranoid: false
            }));
          }
          if (history.after.length !== 0) {
            record.after = convertToDto(await Workload.findAll({
              where: { id: history.after },
              include: {model: Educator},
              paranoid: false
            }));
          }
          resArr.push(record);
        }
      }
      res.json(resArr);
  },

  async delete({params: {historyId}}, res){
    if (!historyId) throw new AppErrorMissing(historyId);
    const history = await History.findByPk(historyId);
    if (!history) throw new AppErrorNotExist('History');

    await history.destroy();

    res.json({status: "OK"});
  }
}
