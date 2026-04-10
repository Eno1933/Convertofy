import PdfToWordTool from '../components/PdfToWordTool';
import { useNavigate } from 'react-router-dom';

export default function PdfToWordPage() {
  const navigate = useNavigate();
  return <PdfToWordTool onBack={() => navigate('/')} />;
}