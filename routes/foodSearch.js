import express from "express";
import axios from "axios";

const router = express.Router();

// handle search results
router.get("/", async (req, res) => {
  const { name } = req.query;
  console.log(name);
  try {
    const response = await axios.get(
      "https://world.openfoodfacts.org/cgi/search.pl",
      {
        params: {
          search_terms: name,
          seach_simple: 1,
          action: "process",
          json: 1,
          country: "united-kingdom",
        },
      }
    );
    return res.json({ success: true, data: response?.data.products[1] });
  } catch (err) {
    return res.json({ success: false, data: err.message });
  }
});

export default router;
