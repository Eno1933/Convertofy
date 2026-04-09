import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import MergePage from './pages/MergePage';
import SplitPage from './pages/SplitPage';
import CompressPage from './pages/CompressPage';
import HowItWorks from './pages/HowItWorks';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage onNavigate={(path) => window.location.href = path} />} />
      <Route path="/merge" element={<MergePage />} />
      <Route path="/split" element={<SplitPage />} />
      <Route path="/compress" element={<CompressPage />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
    </Routes>
  );
}