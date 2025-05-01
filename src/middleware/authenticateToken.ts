// middleware/authenticateToken.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = "your-very-secret-key";  // Use the same secret key as above

function authenticateToken(req: Request, res: Response, next: NextFunction): void {
    // Get token from the Authorization header
    const token = req.headers['authorization']?.split(' ')[1]; // 'Bearer token'

    if (!token) {
        res.status(401).json({ message: "Access denied, token missing" });
        return
    }

    jwt.verify(token, JWT_SECRET, (err, user: any) => {
        if (err) {
            return res.status(403).json({ message: "Token is not valid" });
        }

        // Attach the userId from the token to the request object
        (req as any).userId = user.userId;

        // Call next() to pass control to the next middleware/handler
        next();
    });
}

export default authenticateToken;
