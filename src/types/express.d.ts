export interface AuthenticatedUser {
  uid: string;
  email: string;
  role: 'STUDENT' | 'DRIVER' | 'ADMIN';
  busId?: string;
  studentId?: string;
  driverId?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}
