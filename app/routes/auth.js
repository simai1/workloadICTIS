import { Router } from 'express';
import authController from '../controllers/auth.js';
import { asyncRoute } from '../utils/errors.js';
import passport from 'passport';

const router = Router();

router.route('/test').get(asyncRoute(authController.test));
router.get(
    '/loginSfedu',
    passport.authenticate('azure_ad_oauth2', {
        failureRedirect: '/',
        scope: ['profile'],
    }),
    (req, res) => {
        console.log('1234');
        res.redirect('/');
    }
);

router.get('/login', passport.authenticate('azure_ad_oauth2'), (req, res) => {
    // res.send('redirect URI')
    res.redirect(`${process.env.WEB_URL}/client/HomePage`);
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});
export default router;
