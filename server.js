import express from "express";
import connectDB from "./db/database.js";
import dotenv from "dotenv";
// Routes import
import searchPage from "./routes/foodSearch.js";
import recipePage from "./routes/randomRecipes.js";
import webhookRoute from "./routes/clerkWebhook.js";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

const app = express();
// Clerk Middleware
app.use(clerkMiddleware());
app.use(
  // remember to add the actual url after deploying frontend
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

// To access .env
dotenv.config();
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

app.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}`);
});
