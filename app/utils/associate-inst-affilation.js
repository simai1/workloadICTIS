import Educator from '../models/educator.js';
import User from '../models/user.js';
import Workload from '../models/workload.js';

function getDepartmentByNumber(number) {
    return number >= 1 && number <= 12 ? 1 :
           number >= 13 && number <= 16 ? 2 :
           number >= 17 && number <= 24 ? 3 : 1;
}

const user = async user => {
    const checkEducator = await Educator.findOne({ where: { email: user.login } });
    if (checkEducator) {
        const institutionalAffiliation = getDepartmentByNumber(checkEducator.department);
        await User.update({ institutionalAffiliation: institutionalAffiliation }, { where: { id: user.id } });
    }
};

export default user;
