// URL de base de l'API pour accéder aux recettes
const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

// Dictionnaire pour traduire certains ingrédients en anglais si nécessaire
const ingredientTranslations = {
  'tomato': 'tomato', // Exemple : "tomate" reste "tomate" en anglais
  'onion': 'onion',
  'garlic': 'garlic',
  'chicken': 'chicken',
  'beef': 'beef',
  'carrot': 'carrot',
  'potato': 'potato',
  'zucchini': 'zucchini',
  'pepper': 'pepper',
  'mushroom': 'mushroom',
  'pasta': 'pasta',
  'rice': 'rice',
  'milk': 'milk',
  'egg': 'egg',
  'cheese': 'cheese',
  'butter': 'butter',
  // Les ingrédients personnalisés seront traduits automatiquement ou utilisés tels quels
};

// Fonction pour rechercher des recettes par ingrédients
export const searchRecipesByIngredients = async (ingredients) => {
  try {
    // Traduire les ingrédients donnés en entrée (si nécessaires)
    const translatedIngredients = ingredients.map(ing => 
      ingredientTranslations[ing.toLowerCase()] || ing
    );
    
    console.log('Searching with ingredients:', translatedIngredients);

    // Rechercher les recettes en utilisant le premier ingrédient
    const mainIngredient = translatedIngredients[0];
    const response = await fetch(`${API_BASE_URL}/filter.php?i=${encodeURIComponent(mainIngredient)}`);
    const data = await response.json();
    
    console.log('Initial response:', data);

    // Vérifier si des recettes ont été trouvées
    if (!data.meals) {
      console.log('No recipes found for the main ingredient');
      
      // Si le premier ingrédient ne donne pas de résultats, essayer avec d'autres ingrédients de la liste
      for (let i = 1; i < translatedIngredients.length; i++) {
        const altResponse = await fetch(`${API_BASE_URL}/filter.php?i=${encodeURIComponent(translatedIngredients[i])}`);
        const altData = await altResponse.json();
        
        if (altData.meals) {
          console.log(`Found recipes using alternative ingredient: ${translatedIngredients[i]}`);
          data.meals = altData.meals;
          break;
        }
      }
      
      // Si toujours pas de résultats, retourner un tableau vide
      if (!data.meals) return [];
    }

    // Obtenir les détails pour les 20 premières recettes trouvées
    const detailedRecipes = await Promise.all(
      data.meals.slice(0, 20).map(async recipe => {
        const detailResponse = await fetch(`${API_BASE_URL}/lookup.php?i=${recipe.idMeal}`);
        const detailData = await detailResponse.json();
        
        // Vérifier si des détails sont disponibles pour cette recette
        if (!detailData.meals || !detailData.meals[0]) return null;
        
        const meal = detailData.meals[0];
        
        // Obtenir la liste des ingrédients pour cette recette
        const recipeIngredients = getIngredients(meal);
        
        // Vérifier si la recette contient d'autres ingrédients requis
        // Pour les ingrédients personnalisés, on vérifie s'ils sont présents dans les ingrédients
        // ou dans les instructions (pour gérer les cas où l'ingrédient pourrait être mentionné différemment)
        const hasRequiredIngredients = translatedIngredients.slice(1).every(ing => {
          // Vérifier dans les ingrédients
          const ingredientMatch = recipeIngredients.some(ri => 
            ri.name.toLowerCase().includes(ing.toLowerCase())
          );
          
          // Si pas trouvé dans les ingrédients, vérifier dans les instructions
          if (!ingredientMatch && meal.strInstructions) {
            return meal.strInstructions.toLowerCase().includes(ing.toLowerCase());
          }
          
          return ingredientMatch;
        });
        
        // Si les ingrédients requis ne sont pas présents, exclure cette recette
        if (!hasRequiredIngredients && translatedIngredients.length > 1) return null;
        
        // Retourner les détails formatés de la recette
        return {
          id: meal.idMeal,
          title: meal.strMeal,
          image: meal.strMealThumb,
          category: translateCategory(meal.strCategory),
          instructions: formatInstructions(meal.strInstructions),
          ingredients: recipeIngredients,
          // Ajouter les ingrédients personnalisés qui ne sont pas déjà dans la recette
          customIngredients: translatedIngredients.filter(ing => 
            !recipeIngredients.some(ri => ri.name.toLowerCase().includes(ing.toLowerCase()))
          )
        };
      })
    );

    // Filtrer les recettes valides
    const validRecipes = detailedRecipes.filter(recipe => recipe !== null);
    console.log('Final recipes:', validRecipes);
    
    return validRecipes;

  } catch (error) {
    // Gestion des erreurs
    console.error('Error while searching for recipes:', error);
    throw new Error(`Search error: ${error.message}`);
  }
};

// Fonction pour récupérer toutes les recettes par catégorie
export const getAllRecipes = async () => {
  try {
    // Catégories de recettes à explorer
    const categories = ['Beef', 'Chicken', 'Dessert', 'Lamb', 'Pasta', 'Seafood', 'Vegetarian'];
    const allRecipes = [];

    // Récupérer les recettes pour chaque catégorie
    await Promise.all(categories.map(async category => {
      const response = await fetch(`${API_BASE_URL}/filter.php?c=${category}`);
      const data = await response.json();
      
      // Vérifier si des recettes sont disponibles pour la catégorie
      if (data.meals) {
        const categoryRecipes = await Promise.all(
          data.meals.slice(0, 5).map(async recipe => {
            const detailResponse = await fetch(`${API_BASE_URL}/lookup.php?i=${recipe.idMeal}`);
            const detailData = await detailResponse.json();
            
            // Vérifier si des détails sont disponibles pour cette recette
            if (!detailData.meals || !detailData.meals[0]) return null;
            
            const meal = detailData.meals[0];
            
            // Retourner les détails formatés de la recette
            return {
              id: meal.idMeal,
              title: meal.strMeal,
              image: meal.strMealThumb,
              category: translateCategory(meal.strCategory),
              instructions: formatInstructions(meal.strInstructions),
              ingredients: getIngredients(meal),
              customIngredients: []
            };
          })
        );
        
        // Ajouter les recettes valides à la liste
        allRecipes.push(...categoryRecipes.filter(r => r !== null));
      }
    }));

    return allRecipes;
  } catch (error) {
    // Gestion des erreurs
    console.error('Error while fetching recipes:', error);
    throw new Error(`Fetch error: ${error.message}`);
  }
};

// Fonction pour extraire les ingrédients d'une recette
function getIngredients(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    
    // Ajouter l'ingrédient s'il existe et n'est pas vide
    if (ingredient && ingredient.trim()) {
      ingredients.push({
        name: ingredient.trim(),
        measure: measure ? measure.trim() : ''
      });
    }
  }
  return ingredients;
}

// Fonction pour formater les instructions de préparation
export const formatInstructions = (instructions) => {
  if (!instructions) return [];
  
  // Découper les instructions en étapes
  return instructions
    .split(/\r\n|\n|\r|\./)
    .map(step => step.trim())
    .filter(step => step.length > 0);
};

// Fonction pour traduire les catégories de recettes
export const translateCategory = (category) => {
  const translations = {
    'Beef': 'Beef', // Exemple : traduction directe
    'Chicken': 'Chicken',
    'Dessert': 'Dessert',
    'Lamb': 'Lamb',
    'Miscellaneous': 'Miscellaneous',
    'Pasta': 'Pasta',
    'Pork': 'Pork',
    'Seafood': 'Seafood',
    'Side': 'Side Dish',
    'Starter': 'Starter',
    'Vegetarian': 'Vegetarian',
    'Breakfast': 'Breakfast',
    'Goat': 'Goat'
  };
  
  return translations[category] || category;
};