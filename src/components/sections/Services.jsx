import {
  Merge,
  Scissors,
  FileCog,
  RotateCw,
  FileUp,
  Trash2,
  ArrowUpDown,
  Hash,
  Lock,
  Image,
  FileImage,
  Wrench,
} from "lucide-react";

const tools = [
  { name: "Merge PDF", icon: Merge, desc: "Gabungkan beberapa PDF jadi satu" },
  { name: "Split PDF", icon: Scissors, desc: "Pisahkan halaman atau range tertentu" },
  { name: "Compress PDF", icon: FileCog, desc: "Kurangi ukuran file" },
  { name: "Rotate Pages", icon: RotateCw, desc: "Rotasi halaman 0/90/180/270" },
  { name: "Extract Pages", icon: FileUp, desc: "Ambil halaman tertentu" },
  { name: "Delete Pages", icon: Trash2, desc: "Hapus halaman tidak diinginkan" },
  { name: "Reorder Pages", icon: ArrowUpDown, desc: "Drag & drop urutan halaman" },
  { name: "Add Page Numbers", icon: Hash, desc: "Nomor halaman kustom" },
  { name: "Protect PDF", icon: Lock, desc: "Enkripsi dengan password" },
  { name: "Image to PDF", icon: Image, desc: "JPG/PNG ke PDF" },
  { name: "PDF to Images", icon: FileImage, desc: "Ekstrak halaman ke PNG" },
  { name: "Repair PDF", icon: Wrench, desc: "Perbaiki struktur corrupt" },
];

export default function Services() {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
      <div className="text-center mb-16">
        <h2 className="font-manrope text-3xl md:text-4xl font-bold text-on-surface">
          All Tools You Need
        </h2>
        <p className="text-on-surface-variant text-lg mt-3 max-w-2xl mx-auto">
          Professional-grade PDF utilities, right in your browser
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {tools.map((tool, idx) => (
          <div
            key={idx}
            className="group bg-surface-lowest dark:bg-surface-low rounded-xl p-6 shadow-ambient hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-5 group-hover:from-primary/20 group-hover:to-primary/10 transition-all">
              <tool.icon className="text-primary" size={24} />
            </div>
            <h3 className="font-bold text-xl text-on-surface mb-1">{tool.name}</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">{tool.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}