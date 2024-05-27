import User from "../models/user.js";
import Workload from "../models/workload.js";
import Educator from "../models/educator.js";

export default {
  async copy(req, res){
    const user = await User.findByPk(req.user, {
      include: {
        model: Educator,
      }
    });
    if (user.role === 3){
      const workloads = await Workload.findAll({
        where: {
          department: user,
        }
      })
    }
  }
}
