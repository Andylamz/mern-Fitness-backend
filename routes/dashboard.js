import express from "express";
import UserModel from "../Models/UserModel.js";
import { clerkClient, requireAuth } from "@clerk/express";
import axios from "axios";
import DashboardModel from "../Models/DashboardModel.js";

const router = express.Router();

// router.use(requireAuth());

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

// GET today info
router.get("/dashboardInfo/today", async (req, res) => {
  const { userMongoId } = req.query;
  try {
    const today = new Date();
    const [yyyy, mm, dd] = today
      .toISOString()
      .split("T")[0]
      .split("-")
      .map(Number);

    const startOfDate = new Date(Date.UTC(yyyy, mm - 1, dd));

    const user = await UserModel.findById(userMongoId);
    console.log(startOfDate);
    const dashboard = await DashboardModel.findOneAndUpdate(
      { userMongoId, date: startOfDate },
      {
        $setOnInsert: {
          userMongoId,
          date: startOfDate,
          weight: user.weight,
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    ).populate("userMongoId");
    console.log(dashboard);
    return res.json({ success: true, data: dashboard });
  } catch {
    return res.json({ success: false, data: null });
  }
});

// GET past 7 days info
router.get("/dashboardInfo/pastDays", async (req, res) => {
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
    }).sort({ date: 1 });

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
  const [year, month, date] = inputDate.split("-").map(Number);
  const startOfDate = new Date(Date.UTC(year, month - 1, date));
  const endOfDate = new Date(Date.UTC(year, month - 1, date + 1));

  console.log("inputDate", inputDate);
  console.log("startOfDate", startOfDate);
  console.log("endOfDate", endOfDate);

  try {
    const data = await DashboardModel.findOneAndUpdate(
      {
        userMongoId: userMongoId,
        date: { $gte: startOfDate, $lt: endOfDate },
      },
      {
        $inc: { steps: Number(steps) },
        $setOnInsert: {
          userMongoId,
          date: startOfDate,
        },
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

// PATCH Weight
router.patch("/dashboardInfo/weight", async (req, res) => {
  const { userMongoId, updatedWeight } = req.body;
  const [startOfDate, endOfDate] = getTodayDate();

  try {
    const updateProfile = await UserModel.findByIdAndUpdate(
      userMongoId,
      {
        weight: updatedWeight,
      },
      { new: true }
    );
    const updateDashboard = await DashboardModel.findOneAndUpdate(
      {
        userMongoId,
        date: {
          $gte: startOfDate,
          $lt: endOfDate,
        },
      },
      {
        weight: updatedWeight,
      },
      {
        new: true,
      }
    );
    return res.json({ success: true, data: updateDashboard });
  } catch {
    return res.json({ success: false, data: null });
  }
});

// PATCH exercise
router.patch("/dashboardInfo/exercise", async (req, res) => {
  const [startOfDate, endOfDate] = getTodayDate();
  const { userMongoId, exerciseTime, estimiatedCalorieBurn } = req.body;

  try {
    const data = await DashboardModel.findOneAndUpdate(
      {
        userMongoId,
        date: { $gte: startOfDate, $lt: endOfDate },
      },
      {
        $inc: {
          exerciseBurn: Number(estimiatedCalorieBurn),
          exercise: Number(exerciseTime),
        },
      },
      {
        new: true,
      }
    );
    console.log(data);
    return res.json({ success: true, data: data });
  } catch {
    return res.json({ success: false, data: null });
  }
});

export default router;

function getTodayDate() {
  const today = new Date();
  const [yyyy, mm, dd] = today
    .toISOString()
    .split("T")[0]
    .split("-")
    .map(Number);
  const startOfDate = new Date(Date.UTC(yyyy, mm - 1, dd));
  const endOfDate = new Date(Date.UTC(yyyy, mm - 1, dd + 1));

  return [startOfDate, endOfDate];
}
