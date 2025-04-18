import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Users, ChefHat, UtensilsCrossed, Heart } from 'lucide-react';
import RecipeSteps from '../components/RecipeSteps';

const RecipeDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const recipe = location.state?.recipe;
  
  // États pour gérer les ingrédients personnalisés et les favoris
  const [customIngredients, setCustomIngredients] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);

  // Vérifier si la recette est dans les favoris
  useEffect(() => {
    if (recipe) {
      try {
        const storedFavorites = localStorage.getItem('recipesFavorites');
        if (storedFavorites) {
          const favorites = JSON.parse(storedFavorites);
          setIsFavorite(favorites.some(fav => fav.id === recipe.id));
        }
      } catch (error) {
        console.error('Error checking favorites:', error);
      }
    }
  }, [recipe]);

  const handleAddIngredient = (ingredient) => {
    setCustomIngredients((prev) => [...prev, { name: ingredient, measure: '' }]);
  };

  const toggleFavorite = () => {
    try {
      const storedFavorites = localStorage.getItem('recipesFavorites');
      let favorites = storedFavorites ? JSON.parse(storedFavorites) : [];

      if (isFavorite) {
        // Retirer des favoris
        favorites = favorites.filter(fav => fav.id !== recipe.id);
      } else {
        // Ajouter aux favoris
        // Vérifier si la recette est déjà dans les favoris
        if (!favorites.some(fav => fav.id === recipe.id)) {
          favorites.push(recipe);
        }
      }

      localStorage.setItem('recipesFavorites', JSON.stringify(favorites));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-red-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
          <ChefHat className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-800 mb-4">
            Recipe not found
          </h2>
          <p className="text-red-600 mb-6">
            Sorry, we couldn't find the requested recipe.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors"
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-red-50">
      <div className="relative h-96">
        <div className="absolute inset-0">
          {recipe.image ? (
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-red-100 flex items-center justify-center">
              <ChefHat className="h-24 w-24 text-red-400" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
        </div>

        <div className="absolute top-4 left-0 right-0 px-4 flex justify-between">
          <button
            onClick={() => navigate(-1)}
            className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>

          <button
            onClick={toggleFavorite}
            className={`p-2 rounded-full transition-colors ${
              isFavorite 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
            }`}
          >
            <Heart className={`h-6 w-6 ${isFavorite ? 'fill-white' : ''}`} />
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <h1 className="text-4xl font-bold mb-4">{recipe.title}</h1>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>30 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>4 servings</span>
            </div>
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="h-5 w-5" />
              <span>{recipe.category}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <ChefHat className="w-6 h-6 text-red-500" />
              <h2 className="text-2xl font-bold text-gray-800">Ingredients</h2>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recipe.ingredients.map((ingredient, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 bg-red-50 p-3 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <div className="h-2 w-2 bg-red-400 rounded-full" />
                  <span className="text-gray-700">
                    {ingredient.name} {ingredient.measure && `- ${ingredient.measure}`}
                  </span>
                </li>
              ))}
              {/* Affichage des ingrédients personnalisés */}
              {customIngredients.map((ingredient, index) => (
                <li
                  key={`custom-${index}`}
                  className="flex items-center gap-3 bg-green-50 p-3 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <div className="h-2 w-2 bg-green-400 rounded-full" />
                  <span className="text-gray-700">
                    {ingredient.name}
                  </span>
                </li>
              ))}
            </ul>

            {/* Champ de saisie pour ajouter un ingrédient */}
            <div className="mt-6 flex gap-4">
              <input
                type="text"
                placeholder="Add a custom ingredient"
                className="p-2 border border-gray-300 rounded-lg w-full"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.value) {
                    handleAddIngredient(e.target.value); // Ajout de l'ingrédient
                    e.target.value = ''; // Réinitialisation du champ de saisie
                  }
                }}
              />
            </div>
          </div>

          {/* Instructions pour la recette */}
          <RecipeSteps instructions={recipe.instructions} />
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;