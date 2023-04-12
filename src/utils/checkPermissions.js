import CustomError from '../errors/index.js';

const checkPermissions = (requestUserId, resourceUserId) => {
  if (requestUserId === resourceUserId.toString()) return;
  throw new CustomError.UnauthorizedError(
    'Not authorized to access this route'
  );
};

export { checkPermissions };
