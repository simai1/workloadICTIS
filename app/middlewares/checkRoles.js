import roles from "../config/roles.js";

const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        const userRoles = req.user && req.user.roles;

        console.log('User Roles:', userRoles); // Добавим эту строку для отладки

        if (userRoles && (allowedRoles.some(role => userRoles.includes(role)) || userRoles.includes(roles.ADMIN))) {
            next();
        } else {
            res.status(403).json({ error: 'Access forbidden' });
        }
    };
};

module.exports = checkRole;
