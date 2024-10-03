import roles from '../config/roles.js';
import User from '../models/user.js';
import jwt from '../utils/jwt.js';
// import { asyncRoute } from '../utils/errors.js';

const checkRole = allowedRoles => {
    return async (req, res, next) => {
        console.log("req", req.cookies.refreshToken)
        console.log(jwt.decode(req.cookies.refreshToken))
        const existUser = jwt.decode(req.cookies.refreshToken)
        const user = await User.findByPk(existUser.id);

        if (user.role && (allowedRoles.some(role => user.role === role) || user.role === roles.DIRECTORATE)) {
            next();
        } else {
            res.status(403).json({ error: 'Access forbidden' });
        }
    };
};

export default checkRole;
