declare global {
  namespace Express {
    interface Request {
      user?: {
        uid?: string;
        email?: string;
        role?: string;
        busId?: string;
        studentId?: string;
        driverId?: string;
      };
    }
  }
}

export {};
