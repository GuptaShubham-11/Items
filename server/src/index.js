import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import connectDB from "./db/index.js";
import { app } from "./app.js";

connectDB()
    .then(() => {
        app.on("error", (error) => {
            // console.error("UNEXPECTED ERROR:", error);
            process.exit(1);
        });

        const port = process.env.PORT || 8000;
        app.listen(port, () => {
            // console.log(`🚀 Server running on port: ${port}`);
        });
    })
    .catch((error) => {
        // console.error(`❌ MongoDB connection error: ${error}`);
        process.exit(1);
    });