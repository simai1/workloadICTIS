import { asyncRoute } from '../utils/errors.js';


async function general(req, res, next) {
    if (!req.user) {
        res.redirect('/auth/loginSfedu');
    } else {
        next();
    }
}

// function combine(...verifications) {
//     return asyncRoute(async (req, res, next) => {
//         const results = await Promise.all(
//             verifications.map(v =>
//                 v(req, res, () => {}).then(
//                     () => 1,
//                     () => undefined
//                 )
//             )
//         );
//
//         if (results.filter(Boolean).length) {
//             next();
//         } else {
//             throw new AppErrorForbiddenAction();
//         }
//     });
// }



export default {
    general: asyncRoute(general),
};
