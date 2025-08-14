import express from "express";
import axios from "axios";

const router = express.Router();

// handle search results
router.get("/", async (req, res) => {
  const { name } = req.query;

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

    return res.json({ success: true, data: filtered });
  } catch (err) {
    return res.json({ success: false, data: err.message });
  }
});

// handle search by id
router.get("/product", async (req, res) => {
  const id = req.query.id;
  console.log(id);
  try {
    const data = await axios.get(
      `https://world.openfoodfacts.org/api/v0/product/${id}.json`
    );
    console.log(data.data);
    const filtered = {
      id: data?.data.product["_id"],
      productName: data?.data.product["product_name"],
      proteins_100g: data?.data.product.nutriments["proteins_100g"],
      carbohydrates_100g: data?.data.product.nutriments["carbohydrates_100g"],
      energy_kcal_100g: data?.data.product.nutriments["energy-kcal_100g"],
      fiber_100g: data?.data.product.nutriments["fiber_100g"],
      brand: data?.data.product["brands"],
    };
    console.log(filtered);
    return res.json({ success: true, data: filtered });
  } catch (err) {
    console.log(err.message);
    return res.json({ success: false, data: null });
  }
});
export default router;
