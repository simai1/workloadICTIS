import User from '../models/user.js';

export default {
    async changeRole(req, res) {
        const existUser = jwt.decode(req.cookies.refreshToken)
        const userId = existUser.id;
        const user = await User.findByPk(userId);
        user.update({ role: req.body.role });
        res.json({ user });
    },
    async changeInstitutionalAffiliation(req, res) {
        const existUser = jwt.decode(req.cookies.refreshToken)
        const userId = existUser.id;
        const user = await User.findByPk(userId);
        user.update({ role: req.body.institutionalAffiliation });
        res.json({ user });
    },
};
