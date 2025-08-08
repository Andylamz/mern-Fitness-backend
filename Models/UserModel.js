import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      required: true,
    },
    email_address: {
      type: String,
      required: true,
    },
    height: {
      type: Number,
    },
    weight: {
      type: Number,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
    },
    bmr: {
      type: Number,
    },
    personalData: {
      type: String,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const UserModel =
  mongoose.models.user || new mongoose.model("user", UserSchema);

export default UserModel;
