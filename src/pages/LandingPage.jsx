import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import LanguageToggle from "../components/ui/LanguageToggle";
import myLogo from "../assets/logo.png";
import {
  Menu,
  X,
  Sun,
  Moon,
  FileText,
  ArrowRight,
  Shield,
  Zap,
  Merge,
  Scissors,
  FileDigit,
  RotateCw,
  FileUp,
  Trash2,
  ArrowUpDown,
  Lock,
  FileType,
  FileOutput,
  FileArchive,
  Layers,
  ServerOff,
  Cpu,
  Github,
  Twitter,
  Clock,
} from "lucide-react";

// ==================== UI COMPONENTS ====================

const Button = ({
  children,
  variant = "primary",
  className = "",
  onClick,
  ...props
}) => {
  const base =
    "rounded-lg px-5 py-2.5 sm:px-6 sm:py-3 font-sans font-semibold transition-all duration-300 cursor-pointer inline-flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary/50 active:scale-[0.98] text-sm sm:text-base";
  const variants = {
    primary:
      "bg-gradient-to-br from-primary to-primary-container text-white shadow-ambient hover:shadow-float hover:-translate-y-0.5",
    secondary:
      "bg-surface-highest/50 text-on-surface hover:bg-surface-highest transition-colors",
    ghost:
      "bg-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-highest/50",
  };
  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-transparent hover:bg-surface-highest/50 transition-all flex items-center justify-center text-on-surface-variant hover:text-on-surface"
      aria-label="Toggle Theme"
    >
      {isDark ? (
        <Sun size={18} className="text-amber-400 sm:w-5 sm:h-5" />
      ) : (
        <Moon size={18} className="sm:w-5 sm:h-5" />
      )}
    </button>
  );
};

// ==================== MODAL COMPONENT ====================
const ComingSoonModal = ({ isOpen, onClose, toolName }) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all duration-200">
      <div className="bg-surface-lowest rounded-2xl shadow-float max-w-md w-full p-6 transform transition-all animate-fade-up">
        <div className="text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Clock className="text-primary" size={28} />
          </div>
          <h3 className="text-xl sm:text-2xl font-display font-bold text-on-surface mb-2">
            {t("comingSoon.title")}
          </h3>
          <p className="text-sm sm:text-base text-on-surface-variant mb-6">
            <span className="font-semibold text-primary">{toolName}</span>{" "}
            {t("comingSoon.message")}
          </p>
          <Button onClick={onClose} className="w-full">
            {t("comingSoon.gotIt")}
          </Button>
        </div>
      </div>
    </div>
  );
};

// ==================== SECTIONS ====================

const Header = () => {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 inset-x-0 z-50 glass-panel border-x-0 border-t-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 md:h-20 flex items-center justify-between">
        <div
          className="flex items-center group cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <div className="h-6 sm:h-6 md:h-8 w-auto overflow-hidden">
            <img
              src={myLogo}
              alt="Convertofy"
              className="h-full w-auto object-contain transform group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          <a
            href="#tools"
            className="px-3 py-1.5 rounded-lg text-sm font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-highest/50 transition-all"
          >
            {t("nav.tools")}
          </a>
          <a
            href="#architecture"
            className="px-3 py-1.5 rounded-lg text-sm font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-highest/50 transition-all"
          >
            {t("nav.security")}
          </a>
          <button
            onClick={() => navigate("/how-it-works")}
            className="px-3 py-1.5 rounded-lg text-sm font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-highest/50 transition-all"
          >
            {t("nav.howItWorks")}
          </button>
          <div className="w-px h-5 bg-outline-variant/30 mx-2" />
          <LanguageToggle />
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <LanguageToggle />
          <button
            onClick={() => setOpen(!open)}
            className="p-1.5 text-on-surface-variant rounded-lg hover:bg-surface-highest/50"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-surface-lowest p-4 flex flex-col gap-3 shadow-ambient border-t border-outline-variant/10 animate-fade-up">
          <a
            href="#tools"
            onClick={() => setOpen(false)}
            className="px-3 py-2 rounded-lg font-medium text-sm text-on-surface hover:bg-surface-low"
          >
            {t("nav.tools")}
          </a>
          <a
            href="#architecture"
            onClick={() => setOpen(false)}
            className="px-3 py-2 rounded-lg font-medium text-sm text-on-surface hover:bg-surface-low"
          >
            {t("nav.security")}
          </a>
          <button
            onClick={() => {
              setOpen(false);
              navigate("/how-it-works");
            }}
            className="px-3 py-2 rounded-lg font-medium text-sm text-on-surface hover:bg-surface-low text-left"
          >
            {t("nav.howItWorks")}
          </button>
        </div>
      )}
    </header>
  );
};

const Hero = ({ onExploreTools, onNavigate }) => {
  const { t } = useLanguage();
  return (
    <section className="relative min-h-[85vh] sm:min-h-screen flex items-center justify-center pt-16 sm:pt-20 overflow-hidden">
      <div className="absolute inset-0 architect-grid [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)] opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-primary/10 rounded-full blur-[120px] animate-blob pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-secondary/10 rounded-full blur-[120px] animate-blob delay-300 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-6 text-center">
        <div className="animate-fade-up opacity-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3 sm:py-1 rounded-full bg-surface-lowest shadow-sm border border-outline-variant/20 text-on-surface font-medium mb-5 sm:mb-6 text-xs sm:text-sm md:text-base">
            <span className="relative flex h-2 w-2 sm:h-2 sm:w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
            </span>
            {t("hero.badge")}
          </div>
        </div>

        <h1 className="animate-fade-up delay-100 opacity-0 font-display font-extrabold tracking-architect text-on-surface mb-4 sm:mb-5 leading-[1.2] text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
          {t("hero.title")} <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            {t("hero.titleHighlight")}
          </span>
        </h1>

        <p className="animate-fade-up delay-200 opacity-0 text-on-surface-variant max-w-2xl mx-auto mb-7 sm:mb-9 leading-relaxed text-sm sm:text-base md:text-lg px-3">
          {t("hero.description")}
        </p>

        <div className="animate-fade-up delay-300 opacity-0 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Button onClick={onExploreTools}>
            {t("hero.explore")}{" "}
            <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
          </Button>
          <Button
            variant="secondary"
            onClick={() => onNavigate("/how-it-works")}
          >
            {t("hero.howItWorks")}
          </Button>
        </div>
      </div>
    </section>
  );
};

const ToolsGrid = ({ onToolClick }) => {
  const { t } = useLanguage();
  const toolsData = [
    {
      id: "merge",
      name: t("tools.merge"),
      icon: Merge,
      desc: t("tools.mergeDesc"),
    },
    {
      id: "split",
      name: t("tools.split"),
      icon: Scissors,
      desc: t("tools.splitDesc"),
    },
    {
      id: "compress",
      name: t("tools.compress"),
      icon: FileArchive,
      desc: t("tools.compressDesc"),
    },
    {
      id: "pdf-to-word",
      name: t("tools.pdfToWord"),
      icon: FileType,
      desc: t("tools.pdfToWordDesc"),
    },
    {
      id: "word-to-pdf",
      name: t("tools.wordToPdf"),
      icon: FileOutput,
      desc: t("tools.wordToPdfDesc"),
    },
    {
      id: "protect",
      name: t("tools.protect"),
      icon: Lock,
      desc: t("tools.protectDesc"),
    },
    {
      id: "organize",
      name: t("tools.organize"),
      icon: ArrowUpDown,
      desc: t("tools.organizeDesc"),
    },
    {
      id: "pdf-to-jpg",
      name: t("tools.pdfToJpg"),
      icon: FileDigit,
      desc: t("tools.pdfToJpgDesc"),
    },
  ];

  return (
    <section id="tools" className="py-12 sm:py-16 md:py-24 lg:py-32 relative">
      <div className="absolute inset-0 bg-surface-low rounded-[2rem] sm:rounded-[3rem] mx-2 md:mx-6 -z-10" />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-12 md:mb-16 lg:mb-20 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-display tracking-architect text-on-surface mb-2 sm:mb-3">
            {t("tools.title")}
          </h2>
          <p className="text-on-surface-variant text-sm sm:text-base md:text-lg max-w-xl mx-auto px-4">
            {t("tools.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {toolsData.map((tool, idx) => (
            <div
              key={idx}
              onClick={() => onToolClick(tool.id, tool.name)}
              className="bg-surface-lowest p-5 sm:p-6 rounded-xl sm:rounded-2xl group hover:-translate-y-1 hover:shadow-float transition-all duration-300 cursor-pointer border border-transparent hover:border-primary/20 flex flex-col h-full"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-surface-highest/50 flex items-center justify-center mb-3 sm:mb-4 md:mb-5 group-hover:bg-primary group-hover:text-white text-on-surface transition-colors duration-300">
                <tool.icon
                  size={20}
                  strokeWidth={1.5}
                  className="sm:w-6 sm:h-6"
                />
              </div>
              <h3 className="font-bold font-display text-on-surface text-base sm:text-lg md:text-xl mb-1 sm:mb-2">
                {tool.name}
              </h3>
              <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed">
                {tool.desc}
              </p>
              <div className="mt-auto pt-3 sm:pt-4 md:pt-5 flex items-center text-primary font-semibold text-xs sm:text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                {t("tools.launch")}{" "}
                <ArrowRight
                  size={12}
                  className="ml-1 sm:w-3 sm:h-3 md:w-4 md:h-4"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Architecture = () => {
  const { t } = useLanguage();
  return (
    <section
      id="architecture"
      className="py-12 sm:py-16 md:py-24 lg:py-32 bg-surface relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-12 md:mb-16 text-center max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-display tracking-architect text-on-surface mb-2 sm:mb-3">
            {t("architecture.title")}
          </h2>
          <p className="text-on-surface-variant text-sm sm:text-base md:text-lg px-4">
            {t("architecture.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 auto-rows-[220px] sm:auto-rows-[240px] md:auto-rows-[260px] lg:auto-rows-[280px]">
          <div className="md:col-span-2 bg-surface-lowest rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 lg:p-10 flex flex-col justify-end relative overflow-hidden ghost-border group">
            <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
            <ServerOff className="text-primary mb-3 relative z-10" size={22} />
            <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold font-display text-on-surface mb-1 relative z-10">
              {t("architecture.clientSide")}
            </h3>
            <p className="text-on-surface-variant text-xs sm:text-sm max-w-md relative z-10">
              {t("architecture.clientSideDesc")}
            </p>
          </div>

          <div className="bg-surface-highest/30 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 lg:p-10 flex flex-col justify-end ghost-border hover:bg-surface-highest/50 transition-colors group">
            <Zap
              className="text-secondary mb-3 group-hover:scale-110 transition-transform"
              size={22}
            />
            <h3 className="text-base sm:text-lg md:text-xl font-bold font-display text-on-surface mb-1">
              {t("architecture.instant")}
            </h3>
            <p className="text-on-surface-variant text-xs sm:text-sm">
              {t("architecture.instantDesc")}
            </p>
          </div>

          <div className="bg-surface-highest/30 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 lg:p-10 flex flex-col justify-end ghost-border hover:bg-surface-highest/50 transition-colors group">
            <Shield
              className="text-primary mb-3 group-hover:scale-110 transition-transform"
              size={22}
            />
            <h3 className="text-base sm:text-lg md:text-xl font-bold font-display text-on-surface mb-1">
              {t("architecture.secure")}
            </h3>
            <p className="text-on-surface-variant text-xs sm:text-sm">
              {t("architecture.secureDesc")}
            </p>
          </div>

          <div className="md:col-span-2 bg-surface-lowest rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 lg:p-10 flex flex-col justify-end relative overflow-hidden ghost-border group">
            <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-secondary/5 rounded-full blur-3xl group-hover:bg-secondary/10 transition-colors" />
            <Layers className="text-secondary mb-3 relative z-10" size={22} />
            <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold font-display text-on-surface mb-1 relative z-10">
              {t("architecture.vector")}
            </h3>
            <p className="text-on-surface-variant text-xs sm:text-sm max-w-md relative z-10">
              {t("architecture.vectorDesc")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <footer className="pt-8 pb-6 sm:pt-12 sm:pb-8 md:pt-16 md:pb-10 lg:pt-20 lg:pb-10 bg-surface">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-t border-outline-variant/20 pt-6 sm:pt-8 md:pt-10">
          <div className="h-6 sm:h-7 w-auto">
            <img
              src={myLogo}
              alt="Convertofy"
              className="h-full w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
            />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-on-surface-variant text-xs sm:text-sm">
            <span>
              © {new Date().getFullYear()} Convertofy. {t("footer.copyright")}
            </span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <a
              href="#"
              className="text-on-surface-variant hover:text-primary transition-colors"
            >
              <Github size={16} className="sm:w-5 sm:h-5" />
            </a>
            <a
              href="#"
              className="text-on-surface-variant hover:text-primary transition-colors"
            >
              <Twitter size={16} className="sm:w-5 sm:h-5" />
            </a>
            <div className="w-px h-4 bg-outline-variant/30" />
            <span className="text-[10px] sm:text-xs text-secondary font-bold flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 bg-secondary/10 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>{" "}
              {t("footer.local")}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ==================== MAIN LANDING PAGE ====================
export default function LandingPage({ onNavigate }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState("");

  const handleToolClick = (toolId, toolName) => {
    if (toolId === "merge") {
      onNavigate("/merge");
    } else if (toolId === "split") {
      onNavigate("/split");
    } else if (toolId === "compress") {
      onNavigate("/compress");
    } else {
      setSelectedTool(toolName);
      setModalOpen(true);
    }
  };

  const handleExploreTools = () => {
    document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen font-sans selection:bg-primary/20 selection:text-primary overflow-x-hidden">
      <Header />
      <Hero onExploreTools={handleExploreTools} onNavigate={onNavigate} />
      <ToolsGrid onToolClick={handleToolClick} />
      <Architecture />
      <Footer />
      <ComingSoonModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        toolName={selectedTool}
      />
    </div>
  );
}
