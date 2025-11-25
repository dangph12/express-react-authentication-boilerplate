import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';

type JwtPayload = {
  id: string | number;
  role?: string;
};

export const generateToken = (
  payload: JwtPayload
): { accessToken: string; refreshToken: string } => {
  const accessToken = jwt.sign(
    payload,
    process.env.JWT_SECRET || 'your_jwt_secret',
    {
      expiresIn: '15m'
    }
  );
  const refreshToken = jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET || 'your_jwt_secret',
    {
      expiresIn: '7d'
    }
  );
  return { accessToken, refreshToken };
};

export const generateResetPasswordToken = (id: string): string => {
  return jwt.sign(
    { id },
    process.env.JWT_RESET_PASSWORD_SECRET || 'your_jwt_secret',
    {
      expiresIn: '1h'
    }
  );
};

export const verifyToken = (
  token: string,
  secret: string
): string | jwt.JwtPayload => {
  try {
    return jwt.verify(token, secret || 'your_jwt_secret');
  } catch (error: unknown) {
    if (error instanceof jwt.TokenExpiredError) {
      throw createHttpError(401, 'Token expired');
    }
    throw new Error(error instanceof Error ? error.message : 'Invalid token');
  }
};
