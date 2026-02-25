export interface JwtPayload {
  sub: string; // user id
  email: string;
  role: 'user' | 'admin';
}