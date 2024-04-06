import Educator from '../models/educator.js';

export default async user => {
    const checkEducator = await Educator.findOne({ where: { name: user.name } });
    if (checkEducator) {
        await checkEducator.update({ userId: user.id });
    }
};
