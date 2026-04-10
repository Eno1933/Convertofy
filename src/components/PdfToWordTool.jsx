import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import * as pdfjsLib from 'pdfjs-dist';
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import { 
  ArrowLeft, Upload, X, FileText, CheckCircle, AlertCircle, 
  FileOutput
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

// ==================== MAIN PDF TO WORD TOOL ====================
const PdfToWordTool = ({ onBack }) => {
  const { t } = useLanguage();
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [complete, setComplete] = useState(false);

  // Fix: Import worker langsung dari package, tidak bergantung CDN eksternal
  useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
  }, []);

  const onDrop = useCallback(async (acceptedFiles) => {
    setError(null);
    setComplete(false);
    const selectedFile = acceptedFiles[0];
    if (!selectedFile || selectedFile.type !== 'application/pdf') {
      setError(t('pdfToWord.errorInvalidFile'));
      return;
    }
    setFile({
      name: selectedFile.name,
      size: selectedFile.size,
      file: selectedFile,
    });
  }, [t]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
  });

  const removeFile = () => {
    setFile(null);
    setError(null);
    setComplete(false);
  };

  // Ekstrak teks dari PDF
  const extractTextFromPDF = async (arrayBuffer, onProgress) => {
    const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const numPages = pdfDoc.numPages;
    const paragraphs = [];

    for (let i = 1; i <= numPages; i++) {
      const page = await pdfDoc.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      
      // Tambahkan heading halaman
      paragraphs.push(
        new Paragraph({
          text: `${t('pdfToWord.page')} ${i}`,
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 200 },
        })
      );
      
      // Bagi teks menjadi baris-baris
      const lines = pageText.split(/\r?\n/);
      for (const line of lines) {
        if (line.trim()) {
          paragraphs.push(
            new Paragraph({
              children: [new TextRun(line.trim())],
              spacing: { after: 120 },
            })
          );
        }
      }
      
      // Spasi antar halaman
      paragraphs.push(new Paragraph({ spacing: { after: 400 } }));
      onProgress((i / numPages) * 100);
    }
    
    return paragraphs;
  };

  const handleConvert = async () => {
    if (!file) {
      setError(t('pdfToWord.errorNoFile'));
      return;
    }

    setProcessing(true);
    setProgress(0);
    setError(null);
    setComplete(false);

    try {
      const arrayBuffer = await file.file.arrayBuffer();
      
      const paragraphs = await extractTextFromPDF(arrayBuffer, (percent) => {
        setProgress(percent);
      });
      
      // Buat dokumen Word
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              text: file.name.replace('.pdf', ''),
              heading: HeadingLevel.TITLE,
              spacing: { after: 400 },
            }),
            ...paragraphs,
            new Paragraph({
              children: [new TextRun({ text: `${t('pdfToWord.convertedBy')} Convertofy - ${new Date().toLocaleString()}`, italics: true })],
              spacing: { before: 400 },
            }),
          ],
        }],
      });
      
      const blob = await Packer.toBlob(doc);
      const fileName = `${file.name.replace('.pdf', '')}.docx`;
      saveAs(blob, fileName);
      
      setProgress(100);
      setComplete(true);
    } catch (err) {
      console.error(err);
      setError(t('pdfToWord.errorGeneric'));
    } finally {
      setProcessing(false);
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
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>{t('common.backToTools')}</span>
        </button>

        <div className="bg-surface-lowest rounded-2xl shadow-ambient overflow-hidden">
          <div className="p-8 border-b border-outline-variant/20">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-on-surface">{t('pdfToWord.title')}</h1>
            <p className="text-on-surface-variant mt-2">{t('pdfToWord.description')}</p>
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
                <p className="text-on-surface font-medium">{t('pdfToWord.dropzone')}</p>
                <p className="text-on-surface-variant text-sm mt-1">{t('pdfToWord.orClick')}</p>
                <p className="text-xs text-on-surface-variant/70 mt-4">{t('pdfToWord.maxSize')}</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-surface-low rounded-lg">
                  <div className="flex items-center gap-4">
                    <FileText className="text-primary" size={24} />
                    <div>
                      <p className="font-medium text-on-surface">{file.name}</p>
                      <p className="text-xs text-on-surface-variant">{formatBytes(file.size)}</p>
                    </div>
                  </div>
                  <button onClick={removeFile} className="p-1 rounded-md text-on-surface-variant hover:text-red-500">
                    <X size={20} />
                  </button>
                </div>

                <div className="p-3 bg-primary/5 rounded-lg flex items-start gap-2 text-primary text-sm">
                  <FileOutput size={16} className="flex-shrink-0 mt-0.5" />
                  <span className="text-xs">{t('pdfToWord.infoNote')}</span>
                </div>

                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3 text-red-600 dark:text-red-400">
                    <AlertCircle size={20} />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                {!processing && !complete && (
                  <Button variant="primary" onClick={handleConvert} className="w-full sm:w-auto">
                    {t('pdfToWord.convert')}
                  </Button>
                )}

                {processing && (
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-on-surface-variant">
                      <span>{t('pdfToWord.converting')}</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-surface-high rounded-full overflow-hidden">
                      <div className="h-full bg-primary transition-all duration-300 rounded-full" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                )}

                {complete && !processing && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button variant="secondary" onClick={() => { setFile(null); setComplete(false); }}>
                        {t('pdfToWord.convertAnother')}
                      </Button>
                    </div>
                    <div className="p-3 bg-secondary/10 rounded-lg flex items-center gap-2 text-secondary">
                      <CheckCircle size={18} />
                      <span className="text-sm font-medium">{t('pdfToWord.complete')}</span>
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

export default PdfToWordTool;