import express from "express";
import UserModel from "../Models/UserModel.js";
import { clerkClient, requireAuth } from "@clerk/express";
import axios from "axios";

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

router.get("/weather", async (req, res) => {
  const { lon, lat } = req.query;
  const weatherApiKey = process.env.WEATHER_API;
  console.log(weatherApiKey);
  if (!lon || !lat) {
    console.log("no lon or lat");
    return null;
  }
  try {
    const data = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          lon,
          lat,
          appid: weatherApiKey,
          units: "metric",
        },
      }
    );
    console.log(data);
    return res.json({ success: true, data: data.data });
  } catch {
    return res.json({ success: false, data: null });
  }
});

export default router;
