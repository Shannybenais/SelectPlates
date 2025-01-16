import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RecipeSearch from './pages/RecipeSearch';
import RecipeDetail from './components/RecipeDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RecipeSearch />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;