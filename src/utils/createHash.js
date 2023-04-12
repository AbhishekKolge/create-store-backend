import crypto from 'crypto';
import otpGenerator from 'otp-generator';

const createRandomBytes = (count = 40) => {
  return crypto.randomBytes(count).toString('hex');
};

const hashString = (string) => {
  return crypto.createHash('md5').update(string).digest('hex');
};

const generateOtp = (otpLength = 4) => {
  return otpGenerator.generate(otpLength, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
    digits: true,
  });
};

export { hashString, createRandomBytes, generateOtp };
