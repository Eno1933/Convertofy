import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';
import { 
  ArrowLeft, Upload, X, FileText, CheckCircle, AlertCircle, 
  Download, Scissors, FileUp, Layers
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

// ==================== MAIN SPLIT TOOL ====================
const SplitTool = ({ onBack }) => {
  const { t } = useLanguage();
  const [file, setFile] = useState(null);
  const [splitMode, setSplitMode] = useState('range');
  const [ranges, setRanges] = useState('');
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [pdfPages, setPdfPages] = useState(0);

  const onDrop = useCallback(async (acceptedFiles) => {
    setError(null);
    setResults([]);
    setRanges('');
    const selectedFile = acceptedFiles[0];
    if (!selectedFile || selectedFile.type !== 'application/pdf') {
      setError(t('split.errorInvalidFile'));
      return;
    }
    const arrayBuffer = await selectedFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPageCount();
    setFile({
      name: selectedFile.name,
      size: selectedFile.size,
      pages,
      arrayBuffer,
    });
    setPdfPages(pages);
  }, [t]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
  });

  const removeFile = () => {
    setFile(null);
    setResults([]);
    setRanges('');
    setError(null);
  };

  const parseRanges = (rangeStr, totalPages) => {
    const selectedPages = new Set();
    const parts = rangeStr.split(',');
    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed.includes('-')) {
        const [start, end] = trimmed.split('-').map(Number);
        if (isNaN(start) || isNaN(end)) throw new Error(`Invalid range: ${trimmed}`);
        for (let i = start; i <= end; i++) {
          if (i < 1 || i > totalPages) throw new Error(`Page ${i} out of range (1-${totalPages})`);
          selectedPages.add(i - 1);
        }
      } else {
        const page = Number(trimmed);
        if (isNaN(page)) throw new Error(`Invalid page number: ${trimmed}`);
        if (page < 1 || page > totalPages) throw new Error(`Page ${page} out of range (1-${totalPages})`);
        selectedPages.add(page - 1);
      }
    }
    return Array.from(selectedPages).sort((a,b) => a-b);
  };

  const extractPages = async (sourcePdf, pageIndices, outputName) => {
    const newPdf = await PDFDocument.create();
    const copiedPages = await newPdf.copyPages(sourcePdf, pageIndices);
    copiedPages.forEach(page => newPdf.addPage(page));
    const bytes = await newPdf.save();
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    return { name: outputName, blob, url };
  };

  const handleSplit = async () => {
    if (!file) {
      setError(t('split.errorNoFile'));
      return;
    }

    setProcessing(true);
    setProgress(0);
    setError(null);
    setResults([]);

    try {
      const sourcePdf = await PDFDocument.load(file.arrayBuffer);
      const totalPages = file.pages;

      if (splitMode === 'every') {
        const extracted = [];
        for (let i = 0; i < totalPages; i++) {
          const result = await extractPages(sourcePdf, [i], `${file.name.replace('.pdf', '')}_page_${i+1}.pdf`);
          extracted.push(result);
          setProgress(((i+1) / totalPages) * 100);
        }
        setResults(extracted);
      } else {
        if (!ranges.trim()) {
          setError(t('split.errorRangeRequired'));
          setProcessing(false);
          return;
        }
        const pagesToExtract = parseRanges(ranges, totalPages);
        if (pagesToExtract.length === 0) {
          setError(t('split.errorNoValidPages'));
          setProcessing(false);
          return;
        }
        const result = await extractPages(sourcePdf, pagesToExtract, `split_${file.name}`);
        setResults([result]);
        setProgress(100);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || t('split.errorGeneric'));
    } finally {
      setProcessing(false);
    }
  };

  const downloadFile = (result) => {
    const link = document.createElement('a');
    link.href = result.url;
    link.download = result.name;
    link.click();
  };

  const downloadAll = () => {
    results.forEach(result => downloadFile(result));
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-surface py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>{t('common.backToTools')}</span>
        </button>

        <div className="bg-surface-lowest rounded-2xl shadow-ambient overflow-hidden">
          <div className="p-8 border-b border-outline-variant/20">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-on-surface">{t('split.title')}</h1>
            <p className="text-on-surface-variant mt-2">{t('split.description')}</p>
          </div>

          <div className="p-8">
            {!file ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer
                  ${isDragActive ? 'border-primary bg-primary/5' : 'border-outline-variant/30 bg-surface-low/30 hover:bg-surface-low'}
                `}
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto text-on-surface-variant mb-4" size={40} strokeWidth={1.5} />
                <p className="text-on-surface font-medium">{t('split.dropzone')}</p>
                <p className="text-on-surface-variant text-sm mt-1">{t('split.orClick')}</p>
                <p className="text-xs text-on-surface-variant/70 mt-4">{t('split.maxSize')}</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-surface-low rounded-lg">
                  <div className="flex items-center gap-4">
                    <FileText className="text-primary" size={24} />
                    <div>
                      <p className="font-medium text-on-surface">{file.name}</p>
                      <p className="text-xs text-on-surface-variant">{formatBytes(file.size)} • {file.pages} {t('split.pages')}</p>
                    </div>
                  </div>
                  <button onClick={removeFile} className="p-1 rounded-md text-on-surface-variant hover:text-red-500">
                    <X size={20} />
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 p-4 bg-surface-low/50 rounded-lg">
                  <button
                    onClick={() => setSplitMode('range')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all ${splitMode === 'range' ? 'bg-primary text-white shadow-ambient' : 'bg-surface-highest/30 text-on-surface-variant hover:bg-surface-highest/50'}`}
                  >
                    <Layers size={18} />
                    {t('split.range')}
                  </button>
                  <button
                    onClick={() => setSplitMode('every')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all ${splitMode === 'every' ? 'bg-primary text-white shadow-ambient' : 'bg-surface-highest/30 text-on-surface-variant hover:bg-surface-highest/50'}`}
                  >
                    <Scissors size={18} />
                    {t('split.every')}
                  </button>
                </div>

                {splitMode === 'range' && (
                  <div>
                    <label className="block text-sm font-medium text-on-surface mb-2">
                      {t('split.rangeLabel')} <span className="text-on-surface-variant text-xs">{t('split.rangeExample')}</span>
                    </label>
                    <input
                      type="text"
                      value={ranges}
                      onChange={(e) => setRanges(e.target.value)}
                      placeholder="1-3,5,7-9"
                      className="w-full px-4 py-2 bg-surface-low border border-outline-variant/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-on-surface"
                    />
                    <p className="text-xs text-on-surface-variant mt-1">{t('split.totalPages')} {pdfPages}</p>
                  </div>
                )}

                {splitMode === 'every' && (
                  <div className="p-3 bg-secondary/10 rounded-lg flex items-center gap-2 text-secondary text-sm">
                    <FileUp size={16} />
                    <span>{t('split.everyInfo', { pages: pdfPages })}</span>
                  </div>
                )}

                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3 text-red-600 dark:text-red-400">
                    <AlertCircle size={20} />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                {!processing && results.length === 0 && (
                  <Button variant="primary" onClick={handleSplit} className="w-full sm:w-auto">
                    {t('split.split')}
                  </Button>
                )}

                {processing && (
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-on-surface-variant">
                      <span>{t('split.splitting')}</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-surface-high rounded-full overflow-hidden">
                      <div className="h-full bg-primary transition-all duration-300 rounded-full" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                )}

                {results.length > 0 && !processing && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-on-surface">{t('split.results')} ({results.length} {results.length > 1 ? t('split.files') : t('split.file')})</h3>
                      {results.length > 1 && (
                        <Button variant="secondary" onClick={downloadAll} className="text-sm py-1.5 px-3">
                          {t('split.downloadAll')}
                        </Button>
                      )}
                    </div>
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {results.map((res, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-surface-low rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText size={18} className="text-primary" />
                            <span className="text-sm text-on-surface truncate max-w-[200px] md:max-w-md">{res.name}</span>
                          </div>
                          <button onClick={() => downloadFile(res)} className="p-1.5 rounded-md text-primary hover:bg-primary/10 transition">
                            <Download size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 bg-secondary/10 rounded-lg flex items-center gap-2 text-secondary">
                      <CheckCircle size={18} />
                      <span className="text-sm">{t('split.complete')}</span>
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

export default SplitTool;