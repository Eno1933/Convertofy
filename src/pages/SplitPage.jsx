import SplitTool from '../components/SplitTool';
import { useNavigate } from 'react-router-dom';

export default function SplitPage() {
  const navigate = useNavigate();
  return <SplitTool onBack={() => navigate('/')} />;
}