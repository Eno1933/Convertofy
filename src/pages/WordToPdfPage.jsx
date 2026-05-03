import WordToPdfTool from '../components/WordToPdfTool';
import { useNavigate } from 'react-router-dom';

export default function WordToPdfPage() {
  const navigate = useNavigate();
  return <WordToPdfTool onBack={() => navigate('/')} />;
}