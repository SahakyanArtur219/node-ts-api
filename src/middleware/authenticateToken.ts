import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = "your-very-secret-key"; 

function authenticateToken(req: Request, res: Response, next: NextFunction): void {
    // Get token from the Authorization header
    //const token = req.headers['authorization']?.split(' ')[1]; // 'Bearer token'
    const token = req.cookies.token;

    if (!token) {
        res.status(401).json({ message: "Access denied, token missing" });
        return
    }
    // jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    //     if (err) {
    //         return res.status(403).json({ message: "Token is not valid" });
    //     }

    //     // Attach the userId from the token to the request object
    //     (req as any).userId = user.userId;

    //     // Call next() to pass control to the next middleware/handler
    //     next();
    // });

    try {
        const decoded = jwt.verify(token, JWT_SECRET!);
        (req as any).userId = (decoded as any).userId;
        next();

      } catch {
        res.status(403).json({ message: 'Invalid token' });
        return
      }

}

export default authenticateToken;
