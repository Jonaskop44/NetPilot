export type AuthJwtPayload = {
  id: number;
  sub: {
    username: string;
    email: string;
  };
  iat?: number;
  exp?: number;
};
