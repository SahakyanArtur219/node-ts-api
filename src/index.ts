import express, { Request, Response, NextFunction} from "express";
import bookRoutes from "./routes/bookRoutes";
import {users, User} from "./users"
import path from 'path';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import authenticateToken from './middleware/authenticateToken';

const JWT_SECRET = "your-very-secret-key"; 
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname,'../dist/')));
//app.use("/api", bookRoutes);
const pagesPath = path.join(__dirname, "../dist/pages");


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


app.get("/account.html", (req: Request, res: Response) => {
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
    console.log("api is working")

    try{
        const new_email = req.body.email
        const new_password = req.body.password

        if(!new_email || !new_password ) {
            res.status(400).json({message: "give email and password"})
            return
        } 
        
        const user_exist = users.find(user => user.email === new_email)

        if(user_exist){
            res.status(400).json({message: "This user already exist"})
            return
        }
        // console.log("before await")
        const salt = await bcrypt.genSalt(10);
        const new_pass_hash = await bcrypt.hash(new_password, salt)
        // console.log("after await")
        const new_user: User = {
            id: users.length + 1,
            email: new_email,
            passwordHash: new_pass_hash
        }

        users.push(new_user);
        res.status(200).json({message: "user successfully created"})
        return

    } catch(error) {
        res.status(500).json({ message: "Server error" });
        return
    }
 
});


app.get("/account-page", (req: Request, res: Response) => {
    res.sendFile(path.join(pagesPath, "account.html"));
});


app.post('/login', async (req: Request, res: Response) => {
    try{
        const login_email = req.body.email
        const login_password = req.body.password
        console.log(`email ${login_email} pass ${login_password}`)
        if(!login_email || !login_password) {
            res.status(400).json({message: "you need to fill both, email and password"})
            return
        }

        const user_exist = users.find(user => user.email === login_email)

        if(!user_exist) {
            res.status(400).json({message: "user does not exist"})
            return
        } else{

            // const salt = await bcrypt.genSalt(10);
            // const login_password_hash = await bcrypt.hash(login_password, salt)
            
            const isMatch = await bcrypt.compare(login_password, user_exist.passwordHash);
            if(isMatch){

                const token = jwt.sign({ userId: user_exist.id }, JWT_SECRET, { expiresIn: '1h' });
                res.status(200).json({message: "user loged in successfully ", token})
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

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

