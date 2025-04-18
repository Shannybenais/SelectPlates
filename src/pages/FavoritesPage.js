import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat, Clock, Heart, Users, ArrowLeft, Trash2 } from 'lucide-react';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Charger les favoris depuis le localStorage
    const loadFavorites = () => {
      setLoading(true);
      try {
        const storedFavorites = localStorage.getItem('recipesFavorites');
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const removeFavorite = (recipeId) => {
    const updatedFavorites = favorites.filter(recipe => recipe.id !== recipeId);
    setFavorites(updatedFavorites);
    localStorage.setItem('recipesFavorites', JSON.stringify(updatedFavorites));
  };

  const handleRecipeClick = (recipe) => {
    navigate(`/recipe/${recipe.id}`, { state: { recipe } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-red-50">
      <div className="bg-gradient-to-r from-red-100 to-rose-100 py-12 mb-8 relative">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate('/')}
            className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm text-red-800 p-2 rounded-full hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>

          <div className="flex items-center justify-center mb-4">
            <Heart className="h-20 w-20 text-red-600 fill-red-600" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-red-800 text-center mb-4">
            Your Favorite Recipes
          </h1>
          <p className="text-lg text-red-600 text-center max-w-2xl mx-auto">
            All your saved recipes in one place
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-12">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-200 border-t-red-600 mx-auto mb-4"></div>
              <p className="text-red-600">Loading your favorites...</p>
            </div>
          ) : favorites.length === 0 ? (
            <div className="text-center py-12">
              <ChefHat className="h-16 w-16 text-red-300 mx-auto mb-4" />
              <p className="text-red-600 text-lg mb-4">
                You don't have any favorite recipes yet
              </p>
              <button
                onClick={() => navigate('/')}
                className="bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition-colors"
              >
                Discover Recipes
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map(recipe => (
                <div
                  key={recipe.id}
                  className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden relative"
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

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFavorite(recipe.id);
                    }}
                    className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white text-red-600 hover:text-red-700 transition-all"
                    title="Remove from favorites"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>

                  <div 
                    className="p-6 cursor-pointer"
                    onClick={() => handleRecipeClick(recipe)}
                  >
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
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage;