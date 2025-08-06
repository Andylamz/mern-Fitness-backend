import express from "express";
import connectDB from "./db/database.js";
import dotenv from "dotenv";
// Routes import
import searchPage from "./routes/foodSearch.js";
import recipePage from "./routes/randomRecipes.js/";
import cors from "cors";

const app = express();
app.use(cors());

// To access .env
dotenv.config();

connectDB();
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
