import { useState } from 'react';
import { Download, Copy, Check, Share2 } from 'lucide-react';

export function SaveShareButtons({ 
  prompt, 
  mode, 
  config, 
  results,
  className = '' 
}) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const generateExportData = () => {
    return {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      mode,
      prompt,
      config,
      results
    };
  };

  const handleDownload = () => {
    setDownloading(true);
    try {
      const data = generateExportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const timestamp = new Date().toISOString().slice(0, 10);
      const safePrompt = prompt.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_');
      a.download = `deepr-${mode}-${safePrompt}-${timestamp}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      const data = generateExportData();
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={handleDownload}
        disabled={downloading}
        className="btn-secondary flex items-center gap-2 text-sm py-2 px-3"
        title="Download as JSON"
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">Save</span>
      </button>
      <button
        onClick={handleCopyToClipboard}
        className="btn-secondary flex items-center gap-2 text-sm py-2 px-3"
        title="Copy to clipboard"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-deepr-success" />
            <span className="hidden sm:inline text-deepr-success">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            <span className="hidden sm:inline">Copy</span>
          </>
        )}
      </button>
    </div>
  );
}
