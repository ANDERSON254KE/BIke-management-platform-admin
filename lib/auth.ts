// lib/auth.ts
import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
  email: string;
}

export const verifyToken = async (token: string): Promise<TokenPayload | null> => {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    return payload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};

export const createToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '7d' });
};
