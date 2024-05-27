import Educator from '../models/educator.js';

export default async user => {
    const checkEducator = await Educator.findOne({ where: { email: user.login } });
    if (checkEducator) {
        await checkEducator.update({ userId: user.id });
    }
};
