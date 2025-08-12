import mongoose from "mongoose";

const DashboardSchema = new mongoose.Schema({
  userMongoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: user,
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
  hydration: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    default: () => new Date(new Date().setHours(0, 0, 0, 0)),
  },
});

const DashboardModel =
  mongoose.models.dashboard || new mongoose.model("dashboard", DashboardSchema);

export default DashboardModel;
