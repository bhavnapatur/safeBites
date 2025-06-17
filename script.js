let recipesData;

fetch("recipes.json")
  .then((response) => response.json())
  .then((data) => {
    recipesData = data;

    console.log(recipesData);
    filterRecipes();
  })
  .catch((error) => console.error("Error loading recipes:", error));



function displayRecipes(recipes) {
  const recipesContainer = document.getElementById("recipes");
  recipesContainer.innerHTML = ""; // Clear old results

  recipes.forEach((recipe) => {
    const recipeCard = document.createElement("div");
    recipeCard.classList.add("recipe-card");
    recipeCard.innerHTML = `
            <h3>${recipe.title}</h3>
            <img src="${recipe.image}" alt="${recipe.title}">
        `;
    recipesContainer.appendChild(recipeCard);
  });
}



function createRecipeCard(recipe) {
  return `
  <div class="col-lg-3 col-md-4 col-sm-6 mb-4"> <!-- Adjusted column size for responsiveness -->
    <div class="card">
        <img src="${recipe.image}" class="card-img-top" alt="${recipe.name}" />
        <div class="card-body">
            <h5 class="card-title">${recipe.name}</h5>
            <p class="card-text">Servings: ${recipe.servings}</p>
            <p class="card-text">Sugar: ${recipe.sugar_g}g, Honey: ${
    recipe.honey_g
  }g</p>
            <p class="card-text">Ingredients: ${recipe.ingredients.join(
              ", "
            )}</p>
        </div>
    </div>
  </div>
  `;
}

// 25 kg increment 10 until 85

// 0.5 weight = sugar in 1 meal

// Filter recipes function
function filterRecipes() {
  // Get user input from the filters
  const weight = parseFloat(document.getElementById("weightFilter").value);
  const servingSize = document.getElementById("servingSizeFilter").value;
  const search = document.getElementById("searchFilter").value.toLowerCase();
  const allergy = document.getElementById("allergyFilter").value.toLowerCase(); // Allergy filter

  // Calculate max sugar based on weight (weight * 0.5)
  const maxSugar = weight ? weight * 0.5 : null;

  console.log("Filtering with:", {
    weight,
    servingSize,
    search,
    maxSugar,
    allergy,
  });

  // Filter the recipes based on the user's input
  const filteredRecipes = recipesData.recipes.filter((recipe) => {
    // Filter by serving size
    const servingSizeMatch = !servingSize || recipe.servings == servingSize;

    // Filter by sugar based on weight * 0.5
    const sugarMatch = !maxSugar || recipe.sugar_g <= maxSugar;

    // Filter by search input (recipe name or ingredients)
    const searchMatch =
      !search ||
      recipe.name.toLowerCase().includes(search) ||
      recipe.ingredients.some((ingredient) =>
        ingredient.toLowerCase().includes(search)
      );

    // Filter by allergy input (avoid recipes containing the allergy ingredient)
    const allergyMatch =
      !allergy ||
      !recipe.ingredients.some((ingredient) =>
        ingredient.toLowerCase().includes(allergy)
      );

    // Return true only if all conditions match
    return servingSizeMatch && sugarMatch && searchMatch && allergyMatch;
  });

  console.log("Filtered Recipes:", filteredRecipes);

  // Update the recipe grid with filtered recipes
  const recipeGrid = document.getElementById("recipeGrid");
  recipeGrid.innerHTML = filteredRecipes.map(createRecipeCard).join("");
}

// Event listeners for filters
document
  .getElementById("weightFilter")
  .addEventListener("input", filterRecipes);
document
  .getElementById("servingSizeFilter")
  .addEventListener("input", filterRecipes);
document
  .getElementById("searchFilter")
  .addEventListener("input", filterRecipes);
document
  .getElementById("allergyFilter")
  .addEventListener("input", filterRecipes);
