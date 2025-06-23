import "dotenv/config";
import express from "express";
import cors from "cors";

// Initialize Express app
const app = express();

// Middleware setup
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

import itemRouter from "./routes/item.route.js";
app.use("/api/v1/items", itemRouter);

// Global error handler
app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
        status: err.statusCode || 500,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
});

export { app };