import React, { useState, useEffect } from 'react';
import { X, Clock, Users, ChefHat, Search, Heart, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { searchRecipesByIngredients, getAllRecipes } from '../api/recipes';

const RecipeSearch = () => {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [customIngredient, setCustomIngredient] = useState('');
  const navigate = useNavigate();

  const suggestedIngredients = [
    'tomato', 'onion', 'garlic', 'chicken', 'beef', 'carrot', 
    'potato', 'zucchini', 'pepper', 'mushroom',
    'pasta', 'rice', 'milk', 'egg', 'cheese','butter'
  ];

  const searchRecipes = async () => {
    // Clear previous results first
    setRecipes([]);
    // If no ingredients selected, get all recipes
    if (selectedIngredients.length === 0 && !searchQuery) {
      setLoading(true);
      try {
        const allRecipes = await getAllRecipes();
        setRecipes(allRecipes);
      } catch (err) {
        setError('Error loading recipes: ' + err.message);
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const results = await searchRecipesByIngredients(selectedIngredients);
      if (results && results.length > 0) {
        const filteredResults = searchQuery
          ? results.filter(recipe => 
              recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              recipe.ingredients.some(ing => 
                ing.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
            )
          : results;
        
        setRecipes(filteredResults);
        if (filteredResults.length === 0) {
          setError('No recipes found with these criteria.');
        }
      } else {
        setError('No recipes found for these ingredients. Try other combinations.');
      }
    } catch (err) {
      setError('Error while searching for recipes: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      searchRecipes();
    }, 500); // Add a small delay to prevent too many API calls

    return () => clearTimeout(delaySearch);
  }, [selectedIngredients, searchQuery]);

  const addIngredient = (ingredient) => {
    if (!selectedIngredients.includes(ingredient)) {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
  };

  const removeIngredient = (ingredient) => {
    setSelectedIngredients(
      selectedIngredients.filter(item => item !== ingredient)
    );
  };

  const handleAddCustomIngredient = (e) => {
    e.preventDefault();
    if (customIngredient.trim() && !selectedIngredients.includes(customIngredient.trim())) {
      addIngredient(customIngredient.trim());
      setCustomIngredient('');
    }
  };

  const handleRecipeClick = (recipe) => {
    navigate(`/recipe/${recipe.id}`, { state: { recipe } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-red-50">
      <div className="bg-gradient-to-r from-red-100 to-rose-100 py-12 mb-8 relative">
        <div className="container mx-auto px-4">
          <div className="absolute top-4 right-4">
            <button
              onClick={() => navigate('/favorites')}
              className="bg-white/80 backdrop-blur-sm text-red-600 p-2 rounded-full hover:bg-white hover:text-red-700 transition-colors shadow-md hover:shadow-lg"
              title="View favorites"
            >
              <Heart className="h-6 w-6" />
            </button>
          </div>

          <div className="flex items-center justify-center mb-2">
            <img src="images/Logo_recette.png" alt="Chef Hat" className="h-52 w-52" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-red-800 text-center mb-4">
            Discover Your Recipes
          </h1>
          <p className="text-lg text-red-600 text-center max-w-2xl mx-auto">
            Explore delicious recipes using your favorite ingredients
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-12">
          <div className="mb-8">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a recipe..."
                className="w-full px-4 py-3 pl-12 rounded-xl border-2 border-red-200 focus:border-red-400 focus:ring-2 focus:ring-red-200 focus:outline-none transition-all"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-red-400 h-5 w-5" />
            </div>
          </div>

          {/* Custom ingredient input */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-red-800 mb-4">
              Add your own ingredient
            </h3>
            <form onSubmit={handleAddCustomIngredient} className="flex gap-2">
              <input
                type="text"
                value={customIngredient}
                onChange={(e) => setCustomIngredient(e.target.value)}
                placeholder="Enter an ingredient..."
                className="flex-1 px-4 py-3 rounded-xl border-2 border-red-200 focus:border-red-400 focus:ring-2 focus:ring-red-200 focus:outline-none transition-all"
              />
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-4 py-3 flex items-center gap-2 transition-colors"
                disabled={!customIngredient.trim()}
              >
                <Plus className="w-5 h-5" />
                <span>Add</span>
              </button>
            </form>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-red-800 mb-4">
              Your selected ingredients
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedIngredients.map(ingredient => (
                <span
                  key={ingredient}
                  className={`px-4 py-2 rounded-full flex items-center gap-2 shadow-sm hover:shadow-md transition-all ${
                    suggestedIngredients.includes(ingredient)
                      ? 'bg-gradient-to-r from-red-50 to-rose-100 text-red-800' 
                      : 'bg-gradient-to-r from-purple-50 to-indigo-100 text-indigo-800'
                  }`}
                >
                  {ingredient}
                  <button
                    onClick={() => removeIngredient(ingredient)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
              {selectedIngredients.length === 0 && (
                <span className="text-red-400 italic">No ingredients selected yet</span>
              )}
            </div>
          </div>

          <div className="mb-12">
            <h3 className="text-xl font-semibold text-red-800 mb-4">
              Suggested ingredients
            </h3>
            <div className="flex flex-wrap gap-2">
              {suggestedIngredients.map(ingredient => (
                <button
                  key={ingredient}
                  onClick={() => addIngredient(ingredient)}
                  disabled={selectedIngredients.includes(ingredient)}
                  className={`px-4 py-2 rounded-full transition-all ${
                    selectedIngredients.includes(ingredient)
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white border-2 border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 hover:shadow-md'
                  }`}
                >
                  {ingredient}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-red-800 mb-8">
              Available Recipes
            </h3>

            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-200 border-t-red-600 mx-auto mb-4"></div>
                <p className="text-red-600">Searching for the best recipes...</p>
              </div>
            )}

            {!loading && error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-center">
                {error}
              </div>
            )}

            {!loading && !error && recipes.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map(recipe => (
                  <div
                    key={recipe.id}
                    onClick={() => handleRecipeClick(recipe)}
                    className="group cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                  >
                    <div className="relative h-48">
                      {recipe.image ? (
                        <img
                          src={recipe.image}
                          alt={recipe.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-red-100 flex items-center justify-center">
                          <ChefHat className="h-12 w-12 text-red-400" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70" />
                    </div>

                    <div className="p-6">
                      <h4 className="text-xl font-bold text-red-800 mb-3 line-clamp-2">
                        {recipe.title}
                      </h4>
                      
                      <div className="flex items-center gap-4 text-red-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">30 min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span className="text-sm">4 servings</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {recipe.ingredients.slice(0, 3).map((ing, index) => (
                          <span
                            key={index}
                            className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded-full"
                          >
                            {ing.name}
                          </span>
                        ))}
                        {recipe.ingredients.length > 3 && (
                          <span className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded-full">
                            +{recipe.ingredients.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && !error && recipes.length === 0 && (
              <div className="text-center py-12">
                <ChefHat className="h-16 w-16 text-red-300 mx-auto mb-4" />
                <p className="text-red-600 text-lg">
                  Select your ingredients to discover delicious recipes
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeSearch;