import type { Request, Response, NextFunction } from 'express';

export const validateRoles = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        success: false,
        errorCode: 'ERR_UNAUTHORIZED_ROLE',
        message: 'Access denied: User role undefined.'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        errorCode: 'ERR_FORBIDDEN_ROLE',
        message: `Access denied: Requires one of [${allowedRoles.join(', ')}] roles.`
      });
    }

    next();
  };
};
