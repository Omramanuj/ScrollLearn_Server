"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const contentRoute_1 = __importDefault(require("./routes/contentRoute"));
const db_1 = __importDefault(require("./config/db"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
(0, db_1.default)().then(() => {
    console.log('Database connection established');
}).catch((error) => {
    console.error('Failed to connect to database:', error);
    process.exit(1);
});
app.use(express_1.default.json());
app.use("/api", contentRoute_1.default);
app.get("/ping", (req, res) => {
    res.send("Hello, TypeScript with Node!");
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
