import { useLanguage } from '../../context/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggle = () => {
    setLanguage(language === 'en' ? 'id' : 'en');
  };

  return (
    <button
      onClick={toggle}
      className="w-10 h-10 rounded-lg bg-transparent hover:bg-surface-highest/50 transition-all flex items-center justify-center gap-1 text-on-surface-variant hover:text-on-surface"
      aria-label="Toggle language"
    >
      <Globe size={16} />
      <span className="text-xs font-medium uppercase">{language}</span>
    </button>
  );
}