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
          action: "process",
          search_simple: 1,
          // countries: "united-kingdom",
          page_size: 40,
          json: 1,
        },
      }
    );

    const products = response.data?.products ?? [];
    const simplied = products.map((product) => {
      const nutrition = product.nutriments;
      return {
        id: product._id,
        productName: product.product_name,
        brand: product.brands,
        nutriments: {
          energy_kcal_100g: nutrition["energy-kcal_100g"],
          proteins_100g: nutrition.proteins_100g,
          carbohydrates_100g: nutrition.carbohydrates_100g,
          fiber_100g: nutrition.fiber_100g,
        },
      };
    });
    const filtered = simplied.filter(
      (item) => item.productName && item.nutriments
    );
    console.log(filtered);
    return res.json({ success: true, data: filtered });
  } catch (err) {
    return res.json({ success: false, data: err.message });
  }
});

// handle search by id
router.get("/product", async (req, res) => {
  const id = req.params.id;
  try {
    const data = await axios.get(
      `https://world.openfoodfacts.org/api/v0/product/${id}.json`
    );
    console.log(data);
    return res.json({ success: true, data: data });
  } catch {
    return res.json({ success: false, data: null });
  }
});
export default router;
