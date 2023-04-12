import express from 'express';
import passport from 'passport';

import {
  googleLoginFailed,
  googleLogout,
  checkGoogleLogin,
  googleLoginSuccess,
  getOtp,
  verify,
  signUp,
} from '../controllers/authController.js';

const router = express.Router();

router
  .route('/google')
  .get(passport.authenticate('google', { scope: ['profile'] }));
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.HOST_URL}/api/v1/auth/google/failed`,
  }),
  googleLoginSuccess
);
router.route('/google/failed').get(googleLoginFailed);
router.route('/google/logout').delete(googleLogout);
router.route('/google/success').get(checkGoogleLogin);
router.route('/otp').post(getOtp);
router.route('/verify').post(verify);
router.route('/sign-up').post(signUp);

export default router;
