import mongoose from "mongoose";
import UserModel from "./UserModel.js";

const FoodSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  total_kcal: {
    type: Number,
    required: true,
  },
  total_protein: {
    type: Number,
    required: true,
  },
  total_carbonhydrates: {
    type: Number,
    required: true,
  },
  total_fiber: {
    type: Number,
    required: true,
  },
  nutriments: {
    energy_kcal_100g: { type: Number },
    proteins_100g: { type: Number },
    carbohydrates_100g: { type: Number },
    fiber_100g: { type: Number },
  },
});

const DashboardSchema = new mongoose.Schema({
  userMongoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  steps: {
    type: Number,
    default: 0,
  },
  caloriesIntake: {
    type: Number,
    default: 0,
  },
  protein: {
    type: Number,
    default: 0,
  },
  cabonhydrate: {
    type: Number,
    default: 0,
  },
  fibre: {
    type: Number,
    default: 0,
  },
  exercise: {
    type: Number,
    default: 0,
  },
  exerciseBurn: {
    type: Number,
    default: 0,
  },
  hydration: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    default: () => new Date(new Date().setHours(0, 0, 0, 0)),
  },
  weight: {
    type: Number,
    default: 60,
  },
  foods: [FoodSchema],
});

const DashboardModel =
  mongoose.models.dashboard || new mongoose.model("dashboard", DashboardSchema);

export default DashboardModel;
