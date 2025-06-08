export interface JwtPayload {
  sub: number;
  username: string;
  rol_id: number;
}

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}
