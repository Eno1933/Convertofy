import CompressTool from '../components/CompressTool';
import { useNavigate } from 'react-router-dom';

export default function CompressPage() {
  const navigate = useNavigate();
  return <CompressTool onBack={() => navigate('/')} />;
}