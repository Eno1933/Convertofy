import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-outline-variant/20 py-10 mt-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-on-surface-variant text-sm">
          <p>© {new Date().getFullYear()} Convertofy — Precision PDF Tools</p>
          <p className="flex items-center gap-1">
            Made with <Heart size={14} className="text-red-500" /> for professionals
          </p>
          <p>All processing happens locally. Your files stay private.</p>
        </div>
      </div>
    </footer>
  );
}