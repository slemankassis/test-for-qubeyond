"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const limiting_middleware_1 = __importDefault(require("limiting-middleware"));
const jokeRoutes_1 = __importDefault(require("./routes/jokeRoutes"));
// Initialize Express app
const app = (0, express_1.default)();
// Apply middlewares
app.use(new limiting_middleware_1.default().limitByIp());
// CORS middleware
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});
// Register routes
app.use("/", jokeRoutes_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        type: "error",
        message: err.message,
    });
});
// Define port
const PORT = process.env.PORT || 3005;
// Start the server
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
// Export the app for testing purposes
exports.default = app;
