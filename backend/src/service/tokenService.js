// src/service/tokenService.js
import jwt from 'jsonwebtoken';

const JWT_PRIVATE_KEY = process.env.JWT_SECRET;

export function generateAuthToken(isAdmin) {
  return jwt.sign({ isAdmin }, JWT_PRIVATE_KEY);
}

export function decodeToken(token) {
  return jwt.verify(token, JWT_PRIVATE_KEY);
}
