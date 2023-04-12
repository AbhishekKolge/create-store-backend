import CustomError from '../errors/index.js';
import customUtils from '../utils/index.js';

const authenticateUserMiddleware = async (req, res, next) => {
  if (req.isAuthenticated()) {
    req.user = { userId: req.user.id };
    return next();
  }

  const { refreshToken, accessToken } = req.signedCookies;

  try {
    if (accessToken) {
      const {
        user: { userId },
      } = customUtils.isTokenValid(accessToken);

      req.user = { userId };

      return next();
    }

    throw new CustomError.UnauthenticatedError('Authentication Invalid');
  } catch (err) {
    throw new CustomError.UnauthenticatedError('Authentication invalid');
  }
};

export { authenticateUserMiddleware };
