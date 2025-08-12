import express from "express";
import UserModel from "../Models/UserModel.js";
import { clerkClient, requireAuth } from "@clerk/express";
import axios from "axios";
import DashboardModel from "../Models/DashboardModel.js";

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

  if (!lon || !lat) {
    console.log("no lon or lat");
    return res.json({ success: false, data: null, msg: "No lon or lat" });
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

    return res.json({ success: true, data: data.data });
  } catch {
    return res.json({ success: false, data: null });
  }
});

router.get("/dashboardInfo/today", async (req, res) => {
  const { userMongoId } = req.query;
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dashboard = await DashboardModel.findOneAndUpdate(
      { userMongoId, date: today },
      {
        $setOnInsert: {
          userMongoId,
          date: today,
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    ).populate("userMongoId");
    console.log(dashboard);
    return res.json({ success: true, data: dashboard, msg: "hi" });
  } catch {
    return res.json({ success: false, data: null });
  }
});

// GET steps
router.get("/dashboardInfo/steps", async (req, res) => {
  const { userMongoId } = req.query;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 6);

  try {
    const data = await DashboardModel.find({
      userMongoId,
      date: {
        $gte: sevenDaysAgo,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    })
      .sort({ date: 1 })
      .select({ date: 1, steps: 1 });
    console.log(data);
    return res.json({ success: true, data: data });
  } catch {
    return res.json({ success: false, data: null });
  }
});
// PATCH steps
router.patch("/dashboardInfo/steps", async (req, res) => {
  const inputDate = req.body.date;
  const { userMongoId, steps } = req.body;
  const startOfDate = new Date(inputDate).setHours(0, 0, 0, 0);
  const endOfDate = new Date(startOfDate).setHours(23, 59, 59, 999);

  try {
    const data = await DashboardModel.findOneAndUpdate(
      {
        userMongoId,
        date: { $gte: startOfDate, $lte: endOfDate },
      },
      {
        $inc: { steps: steps },
      },
      {
        upsert: true,
        setDefaultsOnInsert: true,
        new: true,
      }
    ).select({ date: 1, steps: 1, _id: 0 });
    return res.json({ success: true, data: data });
  } catch {
    return res.json({ success: false, data: null });
  }
});
export default router;
