import express from "express";
import UserModel from "../Models/UserModel.js";
import { clerkClient, requireAuth } from "@clerk/express";

const router = express.Router();

router.use(requireAuth());

router.patch("/personalDetails", async (req, res) => {
  const { mongoId, age, height, weight, gender, bmr, clerkId } = req.body;
  console.log(mongoId, age, height, weight, gender, clerkId);
  try {
    const data = await UserModel.findByIdAndUpdate(mongoId, {
      age,
      height,
      weight,
      gender,
      bmr,
    });
    await clerkClient.users.updateUserMetadata(clerkId, {
      publicMetadata: {
        personalData: true,
      },
    });
    return res.json({ success: true, msg: "Data Submitted" });
  } catch {
    return res.json({ success: false, msg: "Failed to submit data" });
  }
});

export default router;
