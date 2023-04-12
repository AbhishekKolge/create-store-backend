const getUserAgent = (req) => {
  return req.headers['user-agent'];
};

const getRequestIp = (req) => {
  return req.ip;
};

export { getUserAgent, getRequestIp };
