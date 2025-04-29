import express, { Request, Response} from "express";
import bookRoutes from "./routes/bookRoutes";
import {users, User} from "./users"
import path from 'path';
import bcrypt from "bcrypt";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'pages')));
app.use("/api", bookRoutes);

app.get("/", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

app.get('/about', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'pages', 'about.html'));
});


app.post('/register', async (req: Request, res: Response) => {

    try{
        const new_email = req.body.email
        const new_password = req.body.password

        if(!new_email || !new_password ) {
            res.status(400).json({message: "give email and password"})
        } 
        
        const user_exist = users.find(user => user.email === new_email)

        if(user_exist){
            res.status(400).json({message: "This user already exist"})
        }
        console.log("before await")
        const salt = await bcrypt.genSalt(10);
        const new_pass_hash = await bcrypt.hash(new_password, salt)
        console.log("after await")
        const new_user: User = {
            id: users.length + 1,
            email: new_email,
            passwordHash: new_pass_hash
        }

        users.push(new_user);

        res.status(200).json({message: "user successfully created"})


    } catch(error) {
        res.status(500).json({ message: "Server error" });
    }
 
});

// app.post("/register", (req: any, res: any) => {
//     try {
//         const { email, password } = req.body;

//         if (!email || !password) {
//             return res.status(400).json({ message: "Email and password are required" });
//         }

//         const existingUser = users.find(user => user.email === email);
//         if (existingUser) {
//             return res.status(400).json({ message: "User already exists" });
//         }

//         const passwordHash = password
//         const newUser: User = {
//             id: users.length + 1,
//             email,
//             passwordHash,
//         };

//         users.push(newUser);

//         res.status(201).json({ message: "User registered successfully" });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Server error" });
//     }
// });



app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

