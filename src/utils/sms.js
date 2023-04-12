import axios from 'axios';

const sendSms = ({ numbers, message }) => {
  const data = {
    route: 'q',
    message,
    language: 'english',
    flash: 0,
    numbers,
  };

  return axios.post(process.env.FAST_SMS_URL, data, {
    headers: {
      authorization: process.env.FAST_SMS_API,
    },
  });
};

export { sendSms };
