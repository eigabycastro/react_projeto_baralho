import { Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import DeckPage from '../pages/DeckPage';
import CardDetails from '../pages/CardDetails';
import NotFound from '../pages/NotFound';
import TrucoPage from '../pages/TrucoPage/TrucoPage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/deck" element={<DeckPage />} />
      <Route path="/card/:code" element={<CardDetails />} />
      <Route path="/truco" element={<TrucoPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
