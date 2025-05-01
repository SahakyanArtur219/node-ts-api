"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = require("./users");
const path_1 = __importDefault(require("path"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateToken_1 = __importDefault(require("./middleware/authenticateToken"));
const JWT_SECRET = "your-very-secret-key";
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, '../dist/')));
//app.use("/api", bookRoutes);
const pagesPath = path_1.default.join(__dirname, "../dist/pages");
app.get('/account', authenticateToken_1.default, (req, res) => {
    const userId = req.userId;
    const user = users_1.users.find(u => u.id === userId);
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    res.status(200).json({
        id: user.id,
        email: user.email,
    });
});
app.get("/account.html", (req, res) => {
    res.sendFile(path_1.default.join(pagesPath, "account.html"));
});
app.get("/", (req, res) => {
    res.sendFile(path_1.default.join(pagesPath, "index.html"));
});
app.get("/register", (req, res) => {
    res.sendFile(path_1.default.join(pagesPath, 'register.html'));
});
app.get("/login", (req, res) => {
    res.sendFile(path_1.default.join(pagesPath, 'login.html'));
});
app.get('/about', (req, res) => {
    res.sendFile(path_1.default.join(pagesPath, "about.html"));
});
app.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("api is working");
    try {
        const new_email = req.body.email;
        const new_password = req.body.password;
        if (!new_email || !new_password) {
            res.status(400).json({ message: "give email and password" });
            return;
        }
        const user_exist = users_1.users.find(user => user.email === new_email);
        if (user_exist) {
            res.status(400).json({ message: "This user already exist" });
            return;
        }
        // console.log("before await")
        const salt = yield bcrypt_1.default.genSalt(10);
        const new_pass_hash = yield bcrypt_1.default.hash(new_password, salt);
        // console.log("after await")
        const new_user = {
            id: users_1.users.length + 1,
            email: new_email,
            passwordHash: new_pass_hash
        };
        users_1.users.push(new_user);
        res.status(200).json({ message: "user successfully created" });
        return;
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
        return;
    }
}));
app.get("/account-page", (req, res) => {
    res.sendFile(path_1.default.join(pagesPath, "account.html"));
});
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const login_email = req.body.email;
        const login_password = req.body.password;
        console.log(`email ${login_email} pass ${login_password}`);
        if (!login_email || !login_password) {
            res.status(400).json({ message: "you need to fill both, email and password" });
            return;
        }
        const user_exist = users_1.users.find(user => user.email === login_email);
        if (!user_exist) {
            res.status(400).json({ message: "user does not exist" });
            return;
        }
        else {
            // const salt = await bcrypt.genSalt(10);
            // const login_password_hash = await bcrypt.hash(login_password, salt)
            const isMatch = yield bcrypt_1.default.compare(login_password, user_exist.passwordHash);
            if (isMatch) {
                const token = jsonwebtoken_1.default.sign({ userId: user_exist.id }, JWT_SECRET, { expiresIn: '1h' });
                res.status(200).json({ message: "user loged in successfully ", token });
                return;
            }
            else {
                res.status(400).json({ message: "email or password is incorrect" });
                return;
            }
        }
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
        return;
    }
}));
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
