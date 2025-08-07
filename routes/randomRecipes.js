import axios from "axios";
import express from "express";

const router = express();

router.get("/", async (req, res) => {
  const api = process.env.SPOONACULAR_API_KEY;
  try {
    const response = await axios.get(
      "https://api.spoonacular.com/recipes/findByNutrients",
      {
        params: {
          apiKey: api,
          minProtein: 30,
          number: 20,
        },
      }
    );

    // const filteredRecipes = response.data.recipes.map((recipe) => ({
    //   id: recipe.id,
    //   title: recipe.title,
    //   readyInMinutes: recipe.readyInMinutes,
    //   image: recipe.image,
    //   extendedIngredients: recipe.extendedIngredients,
    //   summary: recipe.summary,
    //   instruction: recipe.instruction,
    // }));
    return res.json({ success: true, data: response.data });
  } catch {
    return res.json({ success: false, data: null });
  }
});

router.get("/recipes/:id", async (req, res) => {
  const api = process.env.SPOONACULAR_API_KEY;
  const id = req.params.id;
  console.log(api);
  try {
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/${id}/information`,
      {
        params: {
          apiKey: api,
        },
      }
    );

    const filteredRecipes = {
      id: response.data.id,
      title: response.data.title,
      readyInMinutes: response.data.readyInMinutes,
      image: response.data.image,
      extendedIngredients: response.data.extendedIngredients,
      summary: response.data.summary,
      instructions: response.data.instructions,
    };
    return res.json({ success: true, data: filteredRecipes });
  } catch (err) {
    return res.json({ success: false, data: err.message });
  }
});

export default router;
