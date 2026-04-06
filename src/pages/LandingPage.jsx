import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
    "rounded-lg px-6 py-3 font-sans font-semibold transition-all duration-300 cursor-pointer inline-flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary/50 active:scale-[0.98]";
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
      className="w-10 h-10 rounded-lg bg-transparent hover:bg-surface-highest/50 transition-all flex items-center justify-center text-on-surface-variant hover:text-on-surface"
      aria-label="Toggle Theme"
    >
      {isDark ? (
        <Sun size={18} className="text-amber-400" />
      ) : (
        <Moon size={18} />
      )}
    </button>
  );
};

// ==================== MODAL COMPONENT ====================
const ComingSoonModal = ({ isOpen, onClose, toolName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all duration-200">
      <div className="bg-surface-lowest rounded-2xl shadow-float max-w-md w-full p-6 transform transition-all animate-fade-up">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Clock className="text-primary" size={32} />
          </div>
          <h3 className="text-2xl font-display font-bold text-on-surface mb-2">
            Coming Soon
          </h3>
          <p className="text-on-surface-variant mb-6">
            <span className="font-semibold text-primary">{toolName}</span> is
            currently under development. We're working hard to bring it to you
            as soon as possible.
          </p>
          <Button onClick={onClose} className="w-full">
            Got it
          </Button>
        </div>
      </div>
    </div>
  );
};

// ==================== SECTIONS ====================

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 glass-panel border-x-0 border-t-0">
      <div className="max-w-7xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
        <div
          className="flex items-center group cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <div className="h-6 md:h-8 w-auto overflow-hidden">
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
            className="px-4 py-2 rounded-lg text-sm font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-highest/50 transition-all"
          >
            All PDF Tools
          </a>
          <a
            href="#architecture"
            className="px-4 py-2 rounded-lg text-sm font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-highest/50 transition-all"
          >
            Security
          </a>
          <div className="w-px h-5 bg-outline-variant/30 mx-2" />
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setOpen(!open)}
            className="p-2 text-on-surface-variant rounded-lg hover:bg-surface-highest/50"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-surface-lowest p-6 flex flex-col gap-4 shadow-ambient border-t border-outline-variant/10 animate-fade-up">
          <a
            href="#tools"
            onClick={() => setOpen(false)}
            className="px-4 py-3 rounded-lg font-medium text-on-surface hover:bg-surface-low"
          >
            PDF Tools
          </a>
          <a
            href="#architecture"
            onClick={() => setOpen(false)}
            className="px-4 py-3 rounded-lg font-medium text-on-surface hover:bg-surface-low"
          >
            Security
          </a>
        </div>
      )}
    </header>
  );
};

const Hero = ({ onExploreTools }) => (
  <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
    <div className="absolute inset-0 architect-grid [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)] opacity-40 pointer-events-none" />
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-blob pointer-events-none" />
    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] animate-blob delay-300 pointer-events-none" />

    <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
      <div className="animate-fade-up opacity-0">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-lowest shadow-sm border border-outline-variant/20 text-on-surface font-medium mb-8 text-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
          </span>
          Privacy-First PDF Engine
        </div>
      </div>

      <h1 className="animate-fade-up delay-100 opacity-0 font-display text-5xl md:text-7xl lg:text-[5rem] font-extrabold tracking-architect text-on-surface mb-6 leading-[1.05]">
        Every tool you need <br className="hidden md:block" /> to master{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
          your documents.
        </span>
      </h1>

      <p className="animate-fade-up delay-200 opacity-0 text-on-surface-variant text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
        Merge, split, compress, and convert PDFs with the world's most secure
        local processing engine. No uploads, no waiting, just precision.
      </p>

      <div className="animate-fade-up delay-300 opacity-0 flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={onExploreTools}>
          Explore Tools <ArrowRight size={18} />
        </Button>
        <Button variant="secondary">How it works</Button>
      </div>
    </div>
  </section>
);

const tools = [
  {
    id: "merge",
    name: "Merge PDF",
    icon: Merge,
    desc: "Combine multiple PDFs into one unified document in seconds.",
  },
  {
    id: "split",
    name: "Split PDF",
    icon: Scissors,
    desc: "Extract specific pages or separate every page into independent files.",
  },
  {
    id: "compress",
    name: "Compress PDF",
    icon: FileArchive,
    desc: "Reduce file size while maintaining maximum visual quality.",
  },
  {
    id: "pdf-to-word",
    name: "PDF to Word",
    icon: FileType,
    desc: "Convert PDF documents to editable Docx with high accuracy.",
  },
  {
    id: "word-to-pdf",
    name: "Word to PDF",
    icon: FileOutput,
    desc: "Transform Word files into professional, non-editable PDFs.",
  },
  {
    id: "protect",
    name: "Protect PDF",
    icon: Lock,
    desc: "Encrypt your documents with military-grade password protection.",
  },
  {
    id: "organize",
    name: "Organize PDF",
    icon: ArrowUpDown,
    desc: "Sort, add, or delete pages from your document visually.",
  },
  {
    id: "pdf-to-jpg",
    name: "PDF to JPG",
    icon: FileDigit,
    desc: "Extract every image or convert entire pages into high-res JPGs.",
  },
];

const ToolsGrid = ({ onToolClick }) => (
  <section id="tools" className="py-32 relative">
    <div className="absolute inset-0 bg-surface-low rounded-[3rem] mx-2 md:mx-6 -z-10" />

    <div className="max-w-7xl mx-auto px-8">
      <div className="mb-20 text-center">
        <h2 className="text-4xl md:text-5xl font-bold font-display tracking-architect text-on-surface mb-4">
          The Instrument Rack.
        </h2>
        <p className="text-on-surface-variant text-lg max-w-xl mx-auto">
          Professional-grade PDF tools running entirely on your local machine.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {tools.map((t, i) => (
          <div
            key={i}
            onClick={() => onToolClick(t.id, t.name)}
            className="bg-surface-lowest p-8 rounded-2xl group hover:-translate-y-1 hover:shadow-float transition-all duration-300 cursor-pointer border border-transparent hover:border-primary/20 flex flex-col h-full"
          >
            <div className="w-12 h-12 rounded-xl bg-surface-highest/50 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white text-on-surface transition-colors duration-300">
              <t.icon size={24} strokeWidth={1.5} />
            </div>
            <h3 className="font-bold font-display text-on-surface text-xl mb-2">
              {t.name}
            </h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              {t.desc}
            </p>
            <div className="mt-auto pt-6 flex items-center text-primary font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
              Launch Tool <ArrowRight size={14} className="ml-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Architecture = () => (
  <section
    id="architecture"
    className="py-32 bg-surface relative overflow-hidden"
  >
    <div className="max-w-7xl mx-auto px-8">
      <div className="mb-16 text-center max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold font-display tracking-architect text-on-surface mb-6">
          Unrivaled Privacy.
        </h2>
        <p className="text-on-surface-variant text-lg">
          Unlike other PDF tools, Convertofy doesn't own a server. Your data
          stays in the only place it should: with you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
        <div className="md:col-span-2 bg-surface-lowest rounded-3xl p-10 flex flex-col justify-end relative overflow-hidden ghost-border group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
          <ServerOff className="text-primary mb-6 relative z-10" size={32} />
          <h3 className="text-2xl font-bold font-display text-on-surface mb-2 relative z-10">
            Client-Side Only
          </h3>
          <p className="text-on-surface-variant max-w-md relative z-10">
            Your documents are processed in the browser memory. They are never
            uploaded, stored, or seen by anyone—including us.
          </p>
        </div>

        <div className="bg-surface-highest/30 rounded-3xl p-10 flex flex-col justify-end ghost-border hover:bg-surface-highest/50 transition-colors group">
          <Zap
            className="text-secondary mb-6 group-hover:scale-110 transition-transform"
            size={32}
          />
          <h3 className="text-xl font-bold font-display text-on-surface mb-2">
            Instantaneous
          </h3>
          <p className="text-on-surface-variant text-sm">
            Processing at the speed of your hardware. No network bottlenecks.
          </p>
        </div>

        <div className="bg-surface-highest/30 rounded-3xl p-10 flex flex-col justify-end ghost-border hover:bg-surface-highest/50 transition-colors group">
          <Shield
            className="text-primary mb-6 group-hover:scale-110 transition-transform"
            size={32}
          />
          <h3 className="text-xl font-bold font-display text-on-surface mb-2">
            Secure Node
          </h3>
          <p className="text-on-surface-variant text-sm">
            Military-grade document handling within a sandboxed environment.
          </p>
        </div>

        <div className="md:col-span-2 bg-surface-lowest rounded-3xl p-10 flex flex-col justify-end relative overflow-hidden ghost-border group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl group-hover:bg-secondary/10 transition-colors" />
          <Layers className="text-secondary mb-6 relative z-10" size={32} />
          <h3 className="text-2xl font-bold font-display text-on-surface mb-2 relative z-10">
            Vector Precision
          </h3>
          <p className="text-on-surface-variant max-w-md relative z-10">
            Every conversion maintains 100% of the original vector data and text
            hierarchy. No blurry results.
          </p>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="pt-20 pb-10 bg-surface">
    <div className="max-w-7xl mx-auto px-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-t border-outline-variant/20 pt-10">
        <div className="h-7 w-auto">
          <img
            src={myLogo}
            alt="Convertofy"
            className="h-full w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
          />
        </div>
        <span className="text-on-surface-variant text-sm font-medium">
          © {new Date().getFullYear()} Convertofy. Privacy-focused PDF Utility.
        </span>
        <div className="flex items-center gap-6">
          <a
            href="#"
            className="text-on-surface-variant hover:text-primary transition-colors"
          >
            <Github size={20} />
          </a>
          <a
            href="#"
            className="text-on-surface-variant hover:text-primary transition-colors"
          >
            <Twitter size={20} />
          </a>
          <div className="w-px h-4 bg-outline-variant/30" />
          <span className="text-xs text-secondary font-bold flex items-center gap-2 px-3 py-1 bg-secondary/10 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> 100%
            LOCAL
          </span>
        </div>
      </div>
    </div>
  </footer>
);

// ==================== MAIN LANDING PAGE ====================
export default function LandingPage({ onNavigate }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState("");

  const handleToolClick = (toolId, toolName) => {
    if (toolId === "merge") {
      onNavigate("/merge");
    } else if (toolId === "split") {
      onNavigate("/split");
    } else {
      setSelectedTool(toolName);
      setModalOpen(true);
    }
  };

  const handleExploreTools = () => {
    document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen font-sans selection:bg-primary/20 selection:text-primary">
      <Header />
      <Hero onExploreTools={handleExploreTools} />
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