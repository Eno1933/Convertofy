import { Lock, Cpu, Eye, Globe, Sparkles, Shield } from "lucide-react";

const advantages = [
  {
    icon: Lock,
    title: "No Upload, No Trace",
    desc: "Semua proses di browser Anda. File tidak pernah dikirim ke server manapun.",
    color: "from-blue-500/20 to-blue-600/10"
  },
  {
    icon: Cpu,
    title: "Precision Engineering",
    desc: "Setiap tool dirancang dengan presisi tinggi, tanpa batasan ukuran file.",
    color: "from-teal-500/20 to-teal-600/10"
  },
  {
    icon: Eye,
    title: "Editorial-Grade UI",
    desc: "Antarmuka bersih, whitespace ekspansif, sesuai standar high-end tooling.",
    color: "from-purple-500/20 to-purple-600/10"
  },
  {
    icon: Shield,
    title: "Zero Signup Friction",
    desc: "Langsung gunakan. Tidak ada login, tidak ada iklan mengganggu.",
    color: "from-amber-500/20 to-amber-600/10"
  }
];

export default function Advantages() {
  return (
    <section className="py-24 bg-surface-low dark:bg-surface-high/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-1.5 text-sm font-medium text-primary mb-4">
            <Sparkles size={14} />
            <span>Why Choose Us</span>
          </div>
          <h2 className="font-manrope text-3xl md:text-4xl font-bold text-on-surface">
            Built for Professionals
          </h2>
          <p className="text-on-surface-variant text-lg mt-3 max-w-2xl mx-auto">
            Privacy, performance, and elegance — no compromises.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {advantages.map((adv, idx) => (
            <div key={idx} className="text-center group">
              <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${adv.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <adv.icon className="text-primary" size={32} />
              </div>
              <h3 className="font-bold text-xl text-on-surface mb-2">{adv.title}</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">{adv.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}