"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = "your-very-secret-key"; // Use the same secret key as above
function authenticateToken(req, res, next) {
    var _a;
    // Get token from the Authorization header
    const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1]; // 'Bearer token'
    if (!token) {
        res.status(401).json({ message: "Access denied, token missing" });
        return;
    }
    jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Token is not valid" });
        }
        // Attach the userId from the token to the request object
        req.userId = user.userId;
        // Call next() to pass control to the next middleware/handler
        next();
    });
}
exports.default = authenticateToken;
