import express from "express";
import connectDB from "./db/database.js";
import dotenv from "dotenv";

const app = express();

// To access .env
dotenv.config();

connectDB();
// PORT
const PORT = process.env.PORT || 3000;

// parse req body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}`);
});
