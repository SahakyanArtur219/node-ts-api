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
    console.log(token)
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
      console.log("you are in auth section")
        const decoded = jwt.verify(token, JWT_SECRET!);
        if(decoded){
          console.log(decoded)
        }
        
        (req as any).userId = (decoded as any).userId;
        console.log("you are at end fo auth section")
        next();

      } catch {
        console.log("error in auth section")
        res.status(403).json({ message: 'Invalid token' });
        return
      }

}

export default authenticateToken;
