import express, { Request, Response, NextFunction} from "express";
import bookRoutes from "./routes/bookRoutes";
import {users, User} from "./users"
import path from 'path';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import authenticateToken from './middleware/authenticateToken';
import cookieParser from 'cookie-parser';

const JWT_SECRET = "your-very-secret-key"; 
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname,'../')));
app.use(express.static(path.join(__dirname,'../dist')));
const pagesPath = path.join(__dirname, "../pages");
app.use(cookieParser());
//app.use("/api", bookRoutes);
app.use(express.static(path.join(__dirname,'../pages')));
app.use(express.static('../dist'));


app.get('/account', authenticateToken, (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const user = users.find(u => u.id === userId);
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return
    }
    res.status(200).json({
        id: user.id,
        email: user.email,
    });
});



app.get('/mydata', authenticateToken, (req: Request, res: Response) => {

    const userId = (req as any).userId;
    const user = users.find(u => u.id === userId);

    if (!user) {
        res.status(404).json({ message: "User not found" });
        return
    }
    res.status(200).json({
        firstName: user.firstName,
        lastNmae: user.lastName,
        email: user.email,
        phone: user.phone,
        city: user.city
        
    });

});



app.get("/account-page", (req: Request, res: Response) => {
    res.sendFile(path.join(pagesPath, "account.html"));
});

app.get("/", (req: Request, res: Response) => {
    res.sendFile(path.join(pagesPath , "index.html"));
});


app.get("/register", (req: Request, res: Response) => {
    res.sendFile(path.join(pagesPath, 'register.html'));
});


app.get("/login", (req: Request, res: Response) => {
    res.sendFile(path.join(pagesPath, 'login.html'));
});


app.get('/about', (req: Request, res: Response) => {
    res.sendFile(path.join(pagesPath, "about.html"));
});


app.post('/register', async (req: Request, res: Response) => {
    try{
        const new_email = req.body.email
        const new_password = req.body.password
        const new_firstName = req.body.firstName
        const new_lastName = req.body.lastName
        const new_city = req.body.city 
        const new_phone = req.body.phone

        if(!new_email || !new_password || !new_firstName || !new_lastName || !new_city || !new_phone) {
            res.status(400).json({message: "give all data"})
            return
        } 
        
        const user_exist = users.find(user => user.email === new_email)

        if(user_exist){
            res.status(400).json({message: "This user already exist"})
            return
        }
        const salt = await bcrypt.genSalt(10);
        const new_pass_hash = await bcrypt.hash(new_password, salt)
        const new_user: User = {
            id: users.length + 1,
            email: new_email,
            passwordHash: new_pass_hash,
            firstName: new_firstName,
            lastName: new_lastName,
            city: new_city,
            phone: new_phone
        }
        users.push(new_user);
        res.status(200).json({message: "user successfully created"})
        return

    } catch(error) {
        res.status(500).json({ message: "Server error" });
        return
    }
 
});

app.post('/login', async (req: Request, res: Response) => {
    try{
        const login_email = req.body.email
        const login_password = req.body.password
        if(!login_email || !login_password) {
            res.status(400).json({message: "you need to fill both, email and password"})
            return
        }
        const user_exist = users.find(user => user.email === login_email)
        if(!user_exist) {
            res.status(400).json({message: "user does not exist"})
            return
        } else{
            const isMatch = await bcrypt.compare(login_password, user_exist.passwordHash);
            if(isMatch){

                const token = jwt.sign({ userId: user_exist.id }, JWT_SECRET, { expiresIn: '1h' });
                res.cookie('token', token, {
                    httpOnly: true,     // JS can't access it!
                    secure: true,       // Only over HTTPS (set to false for local dev if needed)
                    sameSite: 'strict', // Prevent CSRF
                    maxAge: 3600000     // 1 hour
                  });

                res.status(200).json({message: "user loged in successfully "})
                return
            } else {
                res.status(400).json({message: "email or password is incorrect"})
                return
            }
        }
    } catch(error) {
        res.status(500).json({ message: "Server error" });
        return
    }
})


app.post('/logout', async (req: Request, res: Response) =>{
    res.clearCookie('token',{
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
    });
    res.status(200).json({message: "log out success"});
});


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

