import jwt from 'jsonwebtoken';

const JWT_PRIVATE_KEY = process.env.JWT_SECRET;

export function generateAuthToken(userId, isAdmin) {
  return jwt.sign({ userId, isAdmin }, JWT_PRIVATE_KEY, { expiresIn: '24h' });
}

export function decodeToken(token) {
  return jwt.verify(token, JWT_PRIVATE_KEY);
}