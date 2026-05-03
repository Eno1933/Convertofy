import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  ArrowLeft, Upload, X, FileText, CheckCircle, AlertCircle,
  Download
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

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

const CLOUDCONVERT_BASE = 'https://api.cloudconvert.com/v2';

async function convertWithCloudConvert(apiKey, file, onProgress) {
  onProgress(10);
  const jobRes = await fetch(`${CLOUDCONVERT_BASE}/jobs`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tasks: {
        'import-file': { operation: 'import/upload' },
        'convert-file': {
          operation: 'convert',
          input: 'import-file',
          input_format: 'docx',
          output_format: 'pdf',
          engine: 'libreoffice',
        },
        'export-file': {
          operation: 'export/url',
          input: 'convert-file',
          inline: false,
        },
      },
    }),
  });

  if (!jobRes.ok) {
    const err = await jobRes.json().catch(() => ({}));
    throw new Error(err?.message || `CloudConvert error: ${jobRes.status}`);
  }

  const jobData = await jobRes.json();
  const jobId = jobData.data.id;
  const uploadTask = jobData.data.tasks.find(t => t.name === 'import-file');
  const { url: uploadUrl, parameters: uploadParams } = uploadTask.result.form;

  onProgress(30);
  const formData = new FormData();
  Object.entries(uploadParams).forEach(([k, v]) => formData.append(k, v));
  formData.append('file', file);

  const uploadRes = await fetch(uploadUrl, { method: 'POST', body: formData });
  if (!uploadRes.ok) throw new Error(`Upload gagal: ${uploadRes.status}`);

  onProgress(50);
  const MAX_WAIT_MS = 120_000;
  const POLL_INTERVAL_MS = 2_000;
  const deadline = Date.now() + MAX_WAIT_MS;

  let resultUrl = null;
  while (Date.now() < deadline) {
    await new Promise(r => setTimeout(r, POLL_INTERVAL_MS));

    const pollRes = await fetch(`${CLOUDCONVERT_BASE}/jobs/${jobId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!pollRes.ok) throw new Error('Gagal memeriksa status konversi');

    const { data: job } = await pollRes.json();

    if (job.status === 'error') {
      const failed = job.tasks.find(t => t.status === 'error');
      throw new Error(failed?.message || 'Konversi gagal di server');
    }

    if (job.status === 'finished') {
      onProgress(80);
      const exportTask = job.tasks.find(t => t.name === 'export-file');
      resultUrl = exportTask?.result?.files?.[0]?.url;
      break;
    }
  }

  if (!resultUrl) throw new Error('Timeout: konversi terlalu lama');

  onProgress(90);
  const pdfRes = await fetch(resultUrl);
  if (!pdfRes.ok) throw new Error('Gagal mengunduh hasil PDF');
  const blob = await pdfRes.blob();

  onProgress(100);
  return blob;
}

const WordToPdfTool = ({ onBack }) => {
  const { t } = useLanguage();
  const apiKey = import.meta.env.VITE_CLOUDCONVERT_API_KEY;

  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState(null);
  const [resultFileName, setResultFileName] = useState('');
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    setError(null);
    setResultUrl(null);
    const selected = acceptedFiles[0];
    if (!selected || !selected.name.toLowerCase().endsWith('.docx')) {
      setError(t('wordToPdf.errorInvalidFile'));
      return;
    }
    setFile({ name: selected.name, size: selected.size, raw: selected });
  }, [t]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] },
    multiple: false,
  });

  const removeFile = () => {
    setFile(null);
    setResultUrl(null);
    setError(null);
  };

  const handleConvert = async () => {
    if (!file) {
      setError(t('wordToPdf.errorNoFile'));
      return;
    }

    setProcessing(true);
    setProgress(0);
    setError(null);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(null);

    try {
      const blob = await convertWithCloudConvert(apiKey, file.raw, (p) => setProgress(p));
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      setResultFileName(file.name.replace(/\.docx$/i, '.pdf'));
    } catch (err) {
      console.error(err);
      setError(err.message || t('wordToPdf.errorGeneric'));
    } finally {
      setProcessing(false);
    }
  };

  const downloadPdf = () => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = resultFileName;
    a.click();
  };

  const reset = () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(null);
    setResultUrl(null);
    setResultFileName('');
    setError(null);
    setProgress(0);
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '0 Bytes';
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
            <h1 className="font-display text-3xl md:text-4xl font-bold text-on-surface">
              {t('wordToPdf.title')}
            </h1>
            <p className="text-on-surface-variant mt-2">{t('wordToPdf.description')}</p>
          </div>

          <div className="p-8 space-y-6">
            {!file ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer
                  ${isDragActive
                    ? 'border-primary bg-primary/5'
                    : 'border-outline-variant/30 bg-surface-low/30 hover:bg-surface-low'
                  }`}
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto text-on-surface-variant mb-4" size={40} strokeWidth={1.5} />
                <p className="text-on-surface font-medium">{t('wordToPdf.dropzone')}</p>
                <p className="text-on-surface-variant text-sm mt-1">{t('wordToPdf.orClick')}</p>
                <p className="text-xs text-on-surface-variant/70 mt-4">{t('wordToPdf.maxSize')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* File info */}
                <div className="flex items-center justify-between p-4 bg-surface-low rounded-lg">
                  <div className="flex items-center gap-4">
                    <FileText className="text-primary flex-shrink-0" size={24} />
                    <div>
                      <p className="font-medium text-on-surface">{file.name}</p>
                      <p className="text-xs text-on-surface-variant">{formatBytes(file.size)}</p>
                    </div>
                  </div>
                  <button
                    onClick={removeFile}
                    className="p-1 rounded-md text-on-surface-variant hover:text-red-500 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Error */}
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3 text-red-600 dark:text-red-400">
                    <AlertCircle size={20} className="flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                {/* Convert button */}
                {!processing && !resultUrl && (
                  <Button variant="primary" onClick={handleConvert} className="w-full sm:w-auto">
                    {t('wordToPdf.convert')}
                  </Button>
                )}

                {/* Progress */}
                {processing && (
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-on-surface-variant">
                      <span>
                        {progress < 30
                          ? 'Mengirim file…'
                          : progress < 80
                          ? 'Mengkonversi…'
                          : 'Mengunduh hasil…'}
                      </span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-surface-high rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-500 rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Result */}
                {resultUrl && !processing && (
                  <div className="space-y-4">
                    <div className="p-3 bg-secondary/10 rounded-lg flex items-center gap-2 text-secondary">
                      <CheckCircle size={18} />
                      <span className="text-sm font-medium">{t('wordToPdf.complete')}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button variant="primary" onClick={downloadPdf}>
                        <Download size={18} /> {t('wordToPdf.download')}
                      </Button>
                      <Button variant="secondary" onClick={reset}>
                        {t('wordToPdf.convertAnother')}
                      </Button>
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

export default WordToPdfTool;