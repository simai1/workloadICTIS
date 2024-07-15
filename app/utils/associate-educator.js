import Educator from '../models/educator.js';
import User from '../models/user.js';
import Workload from '../models/workload.js';

const user = async user => {
    const checkEducator = await Educator.findOne({ where: { email: user.login } });
    if (checkEducator) {
        await checkEducator.update({ userId: user.id });
    }
    if (
        await Workload.count({
            where: {
                educatorId: checkEducator.id,
                workload: 'Лекционные',
            },
        })
    ) {
        await User.update({ role: 2 }, { where: { id: user.id } });
    } else {
        await User.update({ role: 5 }, { where: { id: user.id } });
    }
};

export default user;
