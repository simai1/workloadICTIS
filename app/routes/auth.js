import { Router } from 'express';
import authController from '../controllers/auth.js';
import { asyncRoute } from '../utils/errors.js';
import passport from "passport";

const router = Router();

router.route('/test').get(asyncRoute(authController.test));
router.get('/loginSfedu', passport.authenticate('azure_ad_oauth2', {
    failureRedirect: '/',
    scope: ['profile']
  }),
  (req, res) => {
    res.redirect('/');
  });

router.get('/login', passport.authenticate('azure_ad_oauth2'),(req, res) => {
  res.redirect('/');
})

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
})
export default router;
