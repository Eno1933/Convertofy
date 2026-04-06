import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import MergePage from './pages/MergePage';
import SplitPage from './pages/SplitPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage onNavigate={(path) => window.location.href = path} />} />
      <Route path="/merge" element={<MergePage />} />
      <Route path="/split" element={<SplitPage />} />
    </Routes>
  );
}