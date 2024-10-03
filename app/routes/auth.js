import { Router } from 'express';
import authController from '../controllers/auth.js';
import { asyncRoute } from '../utils/errors.js';
import passport from 'passport';
import associateEducator from "../utils/associate-educator.js";
import User from "../models/user.js";

const router = Router();

router.route('/test').get(asyncRoute(authController.test));
router.get(
    '/loginSfedu',
    passport.authenticate('azure_ad_oauth2', {
        failureRedirect: '/client',
        scope: ['profile'],
    }),
    async (req, res) => {
        const user = User.findByPk(req.user);
        await associateEducator(user);
        res.redirect('/');
    }
);

router.get('/login', passport.authenticate('azure_ad_oauth2', { failureRedirect: '/' }), (req, res) => {
    res.redirect(`${process.env.WEB_URL}/HomePage`);
});

router.route('/loginForTest').post(asyncRoute(authController.loginForTest));

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect(`${process.env.WEB_URL}`);
});
export default router;
