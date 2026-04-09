import { useLanguage } from "../context/LanguageContext";
import { ArrowLeft, Upload, Settings, Download, Shield, Zap, Lock, Sparkles, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Button = ({ children, variant = "primary", className = "", onClick }) => {
  const base = "rounded-lg px-5 py-2.5 sm:px-6 sm:py-3 font-sans font-semibold transition-all duration-300 cursor-pointer inline-flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary/50 active:scale-[0.98] text-sm sm:text-base";
  const variants = {
    primary: "bg-gradient-to-br from-primary to-primary-container text-white shadow-ambient hover:shadow-float hover:-translate-y-0.5",
    secondary: "bg-surface-highest/50 text-on-surface hover:bg-surface-highest",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default function HowItWorks() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const steps = [
    {
      icon: Upload,
      title: t('howItWorks.step1.title'),
      desc: t('howItWorks.step1.desc'),
      color: "from-blue-500/20 to-blue-500/5"
    },
    {
      icon: Settings,
      title: t('howItWorks.step2.title'),
      desc: t('howItWorks.step2.desc'),
      color: "from-purple-500/20 to-purple-500/5"
    },
    {
      icon: Download,
      title: t('howItWorks.step3.title'),
      desc: t('howItWorks.step3.desc'),
      color: "from-green-500/20 to-green-500/5"
    },
  ];

  const features = [
    {
      icon: Shield,
      title: t('howItWorks.privacy.title'),
      desc: t('howItWorks.privacy.desc'),
    },
    {
      icon: Zap,
      title: t('howItWorks.speed.title'),
      desc: t('howItWorks.speed.desc'),
    },
    {
      icon: Lock,
      title: t('howItWorks.security.title'),
      desc: t('howItWorks.security.desc'),
    },
  ];

  return (
    <div className="min-h-screen bg-surface py-12 sm:py-16 md:py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Back button - lebih kecil dan elegan */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-6 sm:mb-8 group text-sm"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>{t('common.backToTools')}</span>
        </button>

        <div className="relative">
          {/* Background decorative blob */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

          {/* Header - lebih minimalis */}
          <div className="text-center mb-10 sm:mb-12 relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
              <Sparkles size={12} />
              <span>Simple • Fast • Secure</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-on-surface mb-3">
              {t('howItWorks.title')}
            </h1>
            <p className="text-on-surface-variant text-sm sm:text-base max-w-xl mx-auto">
              {t('howItWorks.subtitle')}
            </p>
          </div>

          {/* Steps - dengan design card yang lebih rapi */}
          <div className="mb-12 sm:mb-16">
            <h2 className="text-lg sm:text-xl font-display font-semibold text-on-surface mb-6 text-center">
              {t('howItWorks.stepsTitle')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
              {steps.map((step, idx) => (
                <div key={idx} className="relative group">
                  <div className={`absolute inset-0 bg-gradient-to-br ${step.color} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  <div className="relative bg-surface-lowest rounded-2xl p-5 sm:p-6 text-center shadow-ambient hover:shadow-float transition-all duration-300">
                    <div className="relative inline-block mb-4">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto group-hover:bg-primary/20 transition">
                        <step.icon className="text-primary" size={24} />
                      </div>
                      <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                        {idx + 1}
                      </div>
                    </div>
                    <h3 className="font-bold text-on-surface text-base sm:text-lg mb-2">{step.title}</h3>
                    <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed">{step.desc}</p>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-px bg-outline-variant/30 -translate-y-1/2" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Why Choose Us - lebih ringkas */}
          <div className="mb-12">
            <h2 className="text-lg sm:text-xl font-display font-semibold text-on-surface mb-6 text-center">
              {t('howItWorks.whyTitle')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-surface-low/50 hover:bg-surface-low transition">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="text-primary" size={16} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-on-surface text-sm mb-1">{feature.title}</h3>
                    <p className="text-on-surface-variant text-xs">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA - lebih simpel */}
          <div className="text-center pt-6 border-t border-outline-variant/20">
            <h3 className="text-base sm:text-lg font-display font-semibold text-on-surface mb-3">
              {t('howItWorks.ctaTitle')}
            </h3>
            <Button onClick={() => navigate('/')} variant="primary" className="px-6 py-2.5 text-sm">
              {t('howItWorks.ctaButton')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}