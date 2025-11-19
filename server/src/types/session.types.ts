import { User } from 'generated/prisma';

declare module 'express-session' {
  interface SessionData {
    isAuthenticated: boolean;
    user?: User;
  }
}
