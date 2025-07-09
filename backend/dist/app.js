"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const videos_1 = __importDefault(require("./routes/videos"));
const app = (0, express_1.default)();
const allowedOrigins = ['https://pixel.tv', 'https://www.pixel.tv'];
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
}));
app.use(express_1.default.json());
// Mount routers
app.use('/api/videos', videos_1.default);
// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});
exports.default = app;
