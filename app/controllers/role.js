import User from '../models/user.js';

export default {
    async changeRole(req, res) {
        const userId = req.user;
        const user = await User.findByPk(userId);
        user.update({ role: req.body.role });
        res.json({ user });
    },
};
