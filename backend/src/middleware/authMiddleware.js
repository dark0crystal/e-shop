// we have to protect post, put, and delete routes,
//  That is we need to authorize and authenticate the request before processing it.


// req is the HTTP request object
// res is the HTTP response object
// next is a callback function that is called to move to the next middleware function in the chain.
// src/middleware/auth.js
import { decodeToken } from '../service/tokenService.js';

export function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }

  try {
    const decoded = decodeToken(token);

    if (decoded.isAdmin) {
      req.user = decoded; // Optional: save decoded token to req
      next(); // allow request to continue
    } else {
      return res.status(403).send("Access denied. Not an admin.");
    }
  } catch (err) {
    return res.status(400).send("Invalid token.");
  }
}


