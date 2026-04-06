import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';
import { 
  ArrowLeft, Upload, X, FileText, CheckCircle, AlertCircle, 
  Loader2, Trash2, MoveUp, MoveDown, Download 
} from 'lucide-react';

// ==================== UI COMPONENTS (local) ====================
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

// ==================== MAIN MERGE TOOL ====================
const MergeTool = ({ onBack }) => {
  const [files, setFiles] = useState([]); // { id, name, size, pages, arrayBuffer }
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState(null);
  const [error, setError] = useState(null);

  // Get page count from PDF buffer
  const getPageCount = async (arrayBuffer) => {
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    return pdfDoc.getPageCount();
  };

  // Handle file drop
  const onDrop = useCallback(async (acceptedFiles) => {
    setError(null);
    const newFiles = [];
    for (const file of acceptedFiles) {
      if (file.type !== 'application/pdf') {
        setError(`${file.name} is not a PDF file.`);
        continue;
      }
      const arrayBuffer = await file.arrayBuffer();
      const pages = await getPageCount(arrayBuffer);
      newFiles.push({
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        pages,
        arrayBuffer,
      });
    }
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: true,
  });

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    setResultUrl(null);
  };

  const moveFile = (index, direction) => {
    const newFiles = [...files];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newFiles.length) return;
    [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];
    setFiles(newFiles);
    setResultUrl(null);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError('Please upload at least 2 PDF files to merge.');
      return;
    }
    setProcessing(true);
    setProgress(0);
    setError(null);
    setResultUrl(null);

    try {
      const mergedPdf = await PDFDocument.create();
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const pdf = await PDFDocument.load(file.arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach(page => mergedPdf.addPage(page));
        setProgress(((i + 1) / files.length) * 100);
      }
      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
    } catch (err) {
      console.error(err);
      setError('Failed to merge PDFs. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const downloadMerged = () => {
    if (resultUrl) {
      const link = document.createElement('a');
      link.href = resultUrl;
      link.download = 'merged.pdf';
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

  return (
    <div className="min-h-screen bg-surface py-20 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Tools</span>
        </button>

        <div className="bg-surface-lowest rounded-2xl shadow-ambient overflow-hidden">
          <div className="p-8 border-b border-outline-variant/20">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-on-surface">Merge PDF</h1>
            <p className="text-on-surface-variant mt-2">Combine multiple PDF files into a single document. Drag and drop to reorder.</p>
          </div>

          <div className="p-8">
            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer
                ${isDragActive ? 'border-primary bg-primary/5' : 'border-outline-variant/30 bg-surface-low/30 hover:bg-surface-low'}
              `}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto text-on-surface-variant mb-4" size={40} strokeWidth={1.5} />
              <p className="text-on-surface font-medium">Drag & drop PDF files here</p>
              <p className="text-on-surface-variant text-sm mt-1">or click to browse</p>
              <p className="text-xs text-on-surface-variant/70 mt-4">Supports multiple files, up to 100MB each</p>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-on-surface">Files to merge ({files.length})</h3>
                  <button
                    onClick={() => setFiles([])}
                    className="text-sm text-on-surface-variant hover:text-red-500 transition-colors flex items-center gap-1"
                  >
                    <Trash2 size={14} /> Clear all
                  </button>
                </div>
                <div className="space-y-3">
                  {files.map((file, idx) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-4 bg-surface-low rounded-lg group"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <FileText className="text-primary flex-shrink-0" size={24} />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-on-surface truncate">{file.name}</p>
                          <p className="text-xs text-on-surface-variant">{formatBytes(file.size)} • {file.pages} pages</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => moveFile(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 rounded-md text-on-surface-variant hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <MoveUp size={18} />
                        </button>
                        <button
                          onClick={() => moveFile(idx, 'down')}
                          disabled={idx === files.length - 1}
                          className="p-1 rounded-md text-on-surface-variant hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <MoveDown size={18} />
                        </button>
                        <button
                          onClick={() => removeFile(file.id)}
                          className="p-1 rounded-md text-on-surface-variant hover:text-red-500"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3 text-red-600 dark:text-red-400">
                <AlertCircle size={20} />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Progress & Actions */}
            {files.length >= 2 && (
              <div className="mt-8">
                {processing ? (
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-on-surface-variant">
                      <span>Merging...</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-surface-high rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300 rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                ) : resultUrl ? (
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button variant="primary" onClick={downloadMerged} className="flex items-center gap-2">
                      <Download size={18} /> Download Merged PDF
                    </Button>
                    <Button variant="secondary" onClick={() => { setResultUrl(null); setFiles([]); }}>
                      Merge Another
                    </Button>
                  </div>
                ) : (
                  <Button variant="primary" onClick={handleMerge} className="w-full sm:w-auto">
                    Merge Files
                  </Button>
                )}
              </div>
            )}

            {/* Success indicator */}
            {resultUrl && !processing && (
              <div className="mt-4 p-3 bg-secondary/10 rounded-lg flex items-center gap-2 text-secondary">
                <CheckCircle size={18} />
                <span className="text-sm font-medium">Merge complete! Your PDF is ready to download.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MergeTool;