import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  ChefHat,
  UtensilsCrossed 
} from 'lucide-react';
import RecipeSteps from './RecipeSteps';

const RecipeDetail = () => {
  const location = useLocation(); // Hook pour récupérer les informations sur la route actuelle
  const navigate = useNavigate(); // Hook pour naviguer entre les routes
  const recipe = location.state?.recipe; // Récupération de la recette passée dans l'état de la navigation

  // Si aucune recette n'est trouvée, afficher une page d'erreur
  if (!recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-red-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
          <ChefHat className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-800 mb-4">
            Recipe not found {/* Message d'erreur pour indiquer qu'aucune recette n'a été trouvée */}
          </h2>
          <p className="text-red-600 mb-6">
            Sorry, we couldn't find the requested recipe. {/* Texte explicatif de l'erreur */}
          </p>
          <button
            onClick={() => navigate('/')} // Retour à la page d'accueil
            className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors"
          >
            Back to home {/* Bouton pour revenir à l'accueil */}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-red-50">
      {/* En-tête avec image de fond */}
      <div className="relative h-96">
        <div className="absolute inset-0">
          {recipe.image ? (
            <img
              src={recipe.image} // Affichage de l'image de la recette si disponible
              alt={recipe.title} // Texte alternatif pour l'image
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-red-100 flex items-center justify-center">
              <ChefHat className="h-24 w-24 text-red-400" /> {/* Icône en cas d'absence d'image */}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" /> {/* Superposition d'un dégradé */}
        </div>

        {/* Bouton retour */}
        <button
          onClick={() => navigate('/')} // Retour à la page d'accueil
          className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors z-10"
        >
          <ArrowLeft className="h-6 w-6" /> {/* Icône de flèche pour le retour */}
        </button>

        {/* Informations principales sur la recette */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <h1 className="text-4xl font-bold mb-4">{recipe.title}</h1> {/* Titre de la recette */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" /> {/* Icône de durée */}
              <span>30 minutes</span> {/* Durée estimée */}
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" /> {/* Icône des portions */}
              <span>4 servings</span> {/* Nombre de portions */}
            </div>
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="h-5 w-5" /> {/* Icône de catégorie */}
              <span>{recipe.category}</span> {/* Catégorie de la recette */}
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-8">
          {/* Liste des ingrédients */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <ChefHat className="w-6 h-6 text-red-500" /> {/* Icône pour la section ingrédients */}
              <h2 className="text-2xl font-bold text-gray-800">Ingredients</h2> {/* Titre de la section */}
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recipe.ingredients.map((ingredient, index) => (
                <li 
                  key={index} // Clé unique pour chaque ingrédient
                  className="flex items-center gap-3 bg-red-50 p-3 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <div className="h-2 w-2 bg-red-400 rounded-full" /> {/* Point coloré */}
                  <span className="text-gray-700">
                    {ingredient.name} {ingredient.measure && `- ${ingredient.measure}`} {/* Affichage de l'ingrédient et sa quantité */}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions pour la recette */}
          <RecipeSteps instructions={recipe.instructions} /> {/* Composant dédié pour les étapes de préparation */}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail; // Exportation du composant
