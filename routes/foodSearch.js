import express from "express";

const router = express.Router();

// handle search results
router.get("/", async (req, res) => {
  const { name } = req.query;
  try {
    const response = axios.get(
      "https://world.openfoodfacts.org/cgi/search.pl/",
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
    return res.json({ success: true, data: response });
  } catch {
    return res.json({ success: false, data: null });
  }
});

export default router;
