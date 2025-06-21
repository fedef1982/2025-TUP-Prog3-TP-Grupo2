export interface JwtPayload {
  sub: number; //id del usuario
  username: string; //email del usuario
  rol_id: number; //rol del usuario
}

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}
