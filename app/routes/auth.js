import { Router } from 'express';
import authController from '../controllers/auth.js';
import { asyncRoute } from '../utils/errors.js';
import passport from 'passport';

const router = Router();

router.route('/test').get(asyncRoute(authController.test));
router.get(
    '/loginSfedu',
    passport.authenticate('azure_ad_oauth2', {
        failureRedirect: '/client',
        scope: ['profile'],
    }),
    (req, res) => {
        res.redirect('/');
    }
);

router.get('/login', passport.authenticate('azure_ad_oauth2', { failureRedirect: '/' }), (req, res) => {
    res.redirect(`${process.env.WEB_URL}/HomePage`);
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect(`${process.env.WEB_URL}`);
});
export default router;
