import MergeTool from '../components/MergeTool';
import { useNavigate } from 'react-router-dom';

export default function MergePage() {
  const navigate = useNavigate();
  return <MergeTool onBack={() => navigate('/')} />;
}