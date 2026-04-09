import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';
import { 
  ArrowLeft, Upload, X, FileText, CheckCircle, AlertCircle, 
  Download, Settings, TrendingDown, BarChart3, Zap
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// ==================== UI COMPONENTS ====================
const Button = ({ children, variant = "primary", className = "", onClick, disabled = false }) => {
  const base = "rounded-lg px-6 py-3 font-sans font-semibold transition-all duration-300 cursor-pointer inline-flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary/50 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-gradient-to-br from-primary to-primary-container text-white shadow-ambient hover:shadow-float hover:-translate-y-0.5",
    secondary: "bg-surface-highest/50 text-on-surface hover:bg-surface-highest",
    ghost: "bg-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-highest/50",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

// ==================== MAIN COMPRESS TOOL ====================
const CompressTool = ({ onBack }) => {
  const { t } = useLanguage();
  const [file, setFile] = useState(null);
  const [compressionLevel, setCompressionLevel] = useState('medium');
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [error, setError] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    setError(null);
    setResultUrl(null);
    const selectedFile = acceptedFiles[0];
    if (!selectedFile || selectedFile.type !== 'application/pdf') {
      setError(t('compress.errorInvalidFile'));
      return;
    }
    const arrayBuffer = await selectedFile.arrayBuffer();
    setFile({
      name: selectedFile.name,
      size: selectedFile.size,
      arrayBuffer,
    });
    setOriginalSize(selectedFile.size);
  }, [t]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
  });

  const removeFile = () => {
    setFile(null);
    setResultUrl(null);
    setError(null);
    setOriginalSize(0);
    setCompressedSize(0);
  };

  // Fungsi kompresi dengan level berbeda
  const compressPDF = async (pdfDoc, level) => {
    // Selalu hapus metadata
    pdfDoc.setTitle('');
    pdfDoc.setAuthor('');
    pdfDoc.setSubject('');
    pdfDoc.setKeywords([]);
    pdfDoc.setProducer('');
    pdfDoc.setCreator('');

    if (level === 'low') {
      // Hanya hapus metadata, tanpa kompresi stream
      return await pdfDoc.save({
        compress: false,
        useObjectStreams: false,
        addDefaultPage: false,
      });
    } else if (level === 'medium') {
      // Hapus metadata + kompresi stream
      return await pdfDoc.save({
        compress: true,
        useObjectStreams: true,
        addDefaultPage: false,
        objectsPerTick: 50,
      });
    } else { // high
      // Kompresi maksimal: buat dokumen baru dan salin halaman (buang objek tidak terpakai)
      const newPdf = await PDFDocument.create();
      const pages = await newPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
      pages.forEach(page => newPdf.addPage(page));
      // Hapus metadata lagi
      newPdf.setTitle('');
      newPdf.setAuthor('');
      newPdf.setSubject('');
      newPdf.setKeywords([]);
      newPdf.setProducer('');
      newPdf.setCreator('');
      return await newPdf.save({
        compress: true,
        useObjectStreams: true,
        addDefaultPage: false,
        objectsPerTick: 100,
      });
    }
  };

  const handleCompress = async () => {
    if (!file) {
      setError(t('compress.errorNoFile'));
      return;
    }

    setProcessing(true);
    setProgress(0);
    setError(null);
    setResultUrl(null);

    try {
      const pdfDoc = await PDFDocument.load(file.arrayBuffer);
      setProgress(30);
      const compressedBytes = await compressPDF(pdfDoc, compressionLevel);
      setProgress(100);
      const blob = new Blob([compressedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      setCompressedSize(compressedBytes.length);
    } catch (err) {
      console.error(err);
      setError(t('compress.errorGeneric'));
    } finally {
      setProcessing(false);
    }
  };

  const downloadCompressed = () => {
    if (resultUrl) {
      const link = document.createElement('a');
      link.href = resultUrl;
      link.download = `compressed_${file.name}`;
      link.click();
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getReductionPercentage = () => {
    if (originalSize === 0 || compressedSize === 0) return 0;
    return Math.round(((originalSize - compressedSize) / originalSize) * 100);
  };

  const compressionOptions = [
    { id: 'low', name: t('compress.low'), icon: Zap, desc: t('compress.lowDesc'), color: 'text-green-500' },
    { id: 'medium', name: t('compress.medium'), icon: BarChart3, desc: t('compress.mediumDesc'), color: 'text-blue-500' },
    { id: 'high', name: t('compress.high'), icon: TrendingDown, desc: t('compress.highDesc'), color: 'text-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-surface py-20 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Tombol kembali */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>{t('common.backToTools')}</span>
        </button>

        <div className="bg-surface-lowest rounded-2xl shadow-ambient overflow-hidden">
          {/* Header */}
          <div className="p-8 border-b border-outline-variant/20">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-on-surface">{t('compress.title')}</h1>
            <p className="text-on-surface-variant mt-2">{t('compress.description')}</p>
          </div>

          <div className="p-8">
            {!file ? (
              // Dropzone
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer
                  ${isDragActive ? 'border-primary bg-primary/5' : 'border-outline-variant/30 bg-surface-low/30 hover:bg-surface-low'}
                `}
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto text-on-surface-variant mb-4" size={40} strokeWidth={1.5} />
                <p className="text-on-surface font-medium">{t('compress.dropzone')}</p>
                <p className="text-on-surface-variant text-sm mt-1">{t('compress.orClick')}</p>
                <p className="text-xs text-on-surface-variant/70 mt-4">{t('compress.maxSize')}</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Informasi file */}
                <div className="flex items-center justify-between p-4 bg-surface-low rounded-lg">
                  <div className="flex items-center gap-4">
                    <FileText className="text-primary" size={24} />
                    <div>
                      <p className="font-medium text-on-surface">{file.name}</p>
                      <p className="text-xs text-on-surface-variant">{t('compress.originalSize')}: {formatBytes(originalSize)}</p>
                    </div>
                  </div>
                  <button onClick={removeFile} className="p-1 rounded-md text-on-surface-variant hover:text-red-500">
                    <X size={20} />
                  </button>
                </div>

                {/* Pilihan level kompresi */}
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-3">
                    {t('compress.compressionLevel')}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {compressionOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setCompressionLevel(option.id)}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-all border-2 ${
                          compressionLevel === option.id 
                            ? 'border-primary bg-primary/5 shadow-ambient' 
                            : 'border-outline-variant/30 bg-surface-low hover:bg-surface-low/70'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center ${option.color}`}>
                          <option.icon size={16} />
                        </div>
                        <div className="text-left">
                          <p className={`font-semibold text-sm ${compressionLevel === option.id ? 'text-primary' : 'text-on-surface'}`}>
                            {option.name}
                          </p>
                          <p className="text-xs text-on-surface-variant">{option.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Catatan info */}
                <div className="p-3 bg-primary/5 rounded-lg flex items-start gap-2 text-primary text-sm">
                  <Settings size={16} className="flex-shrink-0 mt-0.5" />
                  <span className="text-xs">{t('compress.infoNote')}</span>
                </div>

                {/* Pesan error */}
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3 text-red-600 dark:text-red-400">
                    <AlertCircle size={20} />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                {/* Tombol aksi (seperti di MergeTool: di kiri, tidak di tengah) */}
                {!processing && !resultUrl && (
                  <div>
                    <Button variant="primary" onClick={handleCompress} className="w-full sm:w-auto">
                      {t('compress.compress')}
                    </Button>
                  </div>
                )}

                {/* Progress bar */}
                {processing && (
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-on-surface-variant">
                      <span>{t('compress.compressing')}</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-surface-high rounded-full overflow-hidden">
                      <div className="h-full bg-primary transition-all duration-300 rounded-full" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                )}

                {/* Hasil kompresi */}
                {resultUrl && !processing && (
                  <div className="space-y-4">
                    <div className="p-4 bg-surface-low rounded-lg">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-xs text-on-surface-variant">{t('compress.originalSize')}</p>
                          <p className="text-lg font-semibold text-on-surface">{formatBytes(originalSize)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-on-surface-variant">{t('compress.compressedSize')}</p>
                          <p className="text-lg font-semibold text-secondary">{formatBytes(compressedSize)}</p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-outline-variant/20 text-center">
                        <span className="text-sm font-medium text-primary">
                          {t('compress.saved')} {getReductionPercentage()}% {t('compress.spaceSaved')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button variant="primary" onClick={downloadCompressed} className="flex items-center gap-2">
                        <Download size={18} /> {t('compress.download')}
                      </Button>
                      <Button variant="secondary" onClick={() => { setResultUrl(null); setFile(null); setCompressedSize(0); setOriginalSize(0); }}>
                        {t('compress.compressAnother')}
                      </Button>
                    </div>
                    
                    <div className="p-3 bg-secondary/10 rounded-lg flex items-center gap-2 text-secondary">
                      <CheckCircle size={18} />
                      <span className="text-sm font-medium">{t('merge.complete')}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompressTool;