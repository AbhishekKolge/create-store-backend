import jwt from 'jsonwebtoken';

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return token;
};

const isTokenValid = (token) => jwt.verify(token, process.env.JWT_SECRET);

const attachCookiesToResponse = ({ res, user, refreshToken }) => {
  const shortExp = 1000 * 60 * 60 * 6;
  const longerExp = 1000 * 60 * 60 * 24;

  const accessTokenJWT = createJWT({
    payload: { user },
  });
  const refreshTokenJWT = createJWT({
    payload: { user, refreshToken },
  });

  res.cookie('accessToken', accessTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    expires: new Date(Date.now() + shortExp),
  });

  res.cookie('refreshToken', refreshTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    expires: new Date(Date.now() + longerExp),
  });
};

export { createJWT, isTokenValid, attachCookiesToResponse };
