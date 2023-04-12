import { StatusCodes } from 'http-status-codes';

import CustomError from '../errors/index.js';
import customUtils from '../utils/index.js';

import User from '../models/User.js';

const googleLoginFailed = (req, res) => {
  throw new CustomError.UnauthenticatedError('Google login failed');
};

const googleLogout = async (req, res) => {
  await req.logout();
  res.redirect(process.env.FRONT_END_ORIGIN);
};

const googleLoginSuccess = (req, res) => {
  res.redirect(process.env.FRONT_END_SUCCESS_ORIGIN);
};

const checkGoogleLogin = (req, res) => {
  if (req.user) {
    return res.status(StatusCodes.OK).send({ msg: 'Logged in successfully' });
  }
  throw new CustomError.UnauthorizedError('Not authorized');
};

const getOtp = async (req, res) => {
  const { mobile } = req.body;
  const user = await User.findOne({
    mobile,
  });

  if (!user) {
    throw new CustomError.NotFoundError(
      `${mobile} does not exist, please register`
    );
  }

  const otp = customUtils.generateOtp();
  if (process.env === 'production') {
    await customUtils.sendSms({
      numbers: mobile,
      message: `Your login OTP for Unthread is ${otp}`,
    });
  }
  user.verificationCode = otp;
  await user.save();

  res.status(StatusCodes.OK).json({ msg: `OTP sent to ${user.mobile}` });
};

const verify = async (req, res) => {
  const { mobile, verificationCode } = req.body;

  if (!mobile || !verificationCode) {
    throw new CustomError.UnauthenticatedError('Verification failed');
  }

  const user = await User.findOne({ mobile, verificationCode });

  if (!user) {
    throw new CustomError.UnauthenticatedError('Verification failed');
  }

  user.verificationCode = null;
  await user.save();
  const tokenUser = customUtils.createTokenUser(user);
  const refreshToken = customUtils.createRandomBytes();
  customUtils.attachCookiesToResponse({ res, user: tokenUser, refreshToken });
  res.status(StatusCodes.OK).json({
    msg: 'Logged in successfully',
  });
};

const signUp = async (req, res) => {
  const { firstName, lastName, mobile } = req.body;
  if (!firstName || !lastName || !mobile) {
    throw new CustomError.BadRequestError('Please provide required fields');
  }

  const user = await User.create({ firstName, lastName, mobile });

  const otp = customUtils.generateOtp();
  if (process.env === 'production') {
    await customUtils.sendSms({
      numbers: mobile,
      message: `Your login OTP for Unthread is ${otp}`,
    });
  }
  user.verificationCode = otp;
  await user.save();

  res.status(StatusCodes.OK).json({ msg: `OTP sent to ${user.mobile}` });
};

export {
  googleLoginFailed,
  googleLogout,
  checkGoogleLogin,
  googleLoginSuccess,
  getOtp,
  verify,
  signUp,
};
