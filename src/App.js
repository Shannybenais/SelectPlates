import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RecipeSearch from './pages/RecipeSearch';
import RecipeDetail from './pages/RecipeDetail';
import FavoritesPage from './pages/FavoritesPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RecipeSearch />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />
        <Route path="/favorites" element={<FavoritesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;