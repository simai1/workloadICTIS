import User from '../models/user.js';

const educator = async educator => {
    const checkUser = await User.findOne({ where: { login: educator.email } });
    if (checkUser && educator.userId === null) {
        await educator.update({ userId: checkUser.id })
    }
};

export default educator;