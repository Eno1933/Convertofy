import Button from "../ui/Button";
import { ArrowRight, Shield, Zap, Lock, Sparkles } from "lucide-react";

export default function Hero() {
  const scrollToServices = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden">
      {/* Background subtle gradient - menggunakan CSS variables agar adaptif dark mode */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 md:py-32 text-center relative">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-secondary/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium text-secondary border border-secondary/20 mb-6">
          <Sparkles size={14} />
          <span>100% Client-Side • Zero Upload</span>
        </div>

        {/* Heading */}
        <h1 className="font-manrope text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-on-surface">
          Precision PDF Tools <br />
          for the{" "}
          <span className="bg-gradient-to-r from-primary to-primary-container bg-clip-text text-transparent">
            Digital Architect
          </span>
        </h1>

        {/* Description */}
        <p className="text-on-surface-variant text-lg md:text-xl max-w-2xl mx-auto mt-6 leading-relaxed">
          Manipulate, merge, split, compress, and protect your PDFs instantly — 
          no signup, no server upload. Your files never leave your device.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <Button variant="primary" className="text-base px-8 py-3" onClick={scrollToServices}>
            Start Now <ArrowRight size={18} />
          </Button>
          <Button variant="secondary" className="text-base px-8 py-3" onClick={scrollToServices}>
            View All Tools
          </Button>
        </div>

        {/* Trust indicators */}
        <div className="flex flex-wrap justify-center gap-8 mt-16 text-on-surface-variant text-sm">
          <div className="flex items-center gap-2"><Lock size={16} /> Privacy First</div>
          <div className="flex items-center gap-2"><Shield size={16} /> No Tracking</div>
          <div className="flex items-center gap-2"><Zap size={16} /> Instant Processing</div>
        </div>
      </div>
    </section>
  );
}