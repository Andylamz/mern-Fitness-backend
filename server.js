import express from "express";
import connectDB from "./db/database.js";
import dotenv from "dotenv";
// Routes import
import searchPage from "./routes/foodSearch.js";
import recipePage from "./routes/randomRecipes.js";
import dashboardPage from "./routes/dashboard.js";

import webhookRoute from "./routes/clerkWebhook.js";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

const app = express();
// To access .env
dotenv.config();

// Clerk Middleware
app.use(clerkMiddleware());
app.use(
  // remember to add the actual url after deploying frontend
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

connectDB();

// clerk webhook
app.use("/", webhookRoute);

// PORT
const PORT = process.env.PORT || 3000;

// parse req body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/foodSearch", searchPage);
app.use("/api/recipeSearch", recipePage);
app.use("/api/dashboard", dashboardPage);

app.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}`);
});
