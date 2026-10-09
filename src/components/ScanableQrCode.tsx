import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { ShieldCheck, CheckCircle2, Copy, ExternalLink, QrCode as QrIcon } from 'lucide-react';

interface ScanableQrCodeProps {
  payload: string;
  size?: number;
  className?: string;
  darkColor?: string;
  lightColor?: string;
  altText?: string;
  allowInspect?: boolean;
}

export const ScanableQrCode: React.FC<ScanableQrCodeProps> = ({
  payload,
  size = 160,
  className = '',
  darkColor = '#000000',
  lightColor = '#ffffff',
  altText = 'Official University Verification QR Code',
  allowInspect = true,
}) => {
  const [dataUrl, setDataUrl] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(payload, {
      width: size * 2, // 2x for retina sharpness
      margin: 1,
      color: {
        dark: darkColor,
        light: lightColor,
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => {
        if (isMounted) setDataUrl(url);
      })
      .catch((err) => {
        console.error('Failed to generate QR code:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [payload, size, darkColor, lightColor]);

  const handleCopyPayload = () => {
    navigator.clipboard?.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div 
        className={`relative inline-flex flex-col items-center group ${className}`}
        onClick={() => allowInspect && setIsModalOpen(true)}
      >
        {dataUrl ? (
          <img
            src={dataUrl}
            alt={altText}
            width={size}
            height={size}
            className="rounded-lg shadow-sm border border-neutral-200/80 bg-white p-1 select-none transition-transform group-hover:scale-105 cursor-pointer"
          />
        ) : (
          <div 
            style={{ width: size, height: size }} 
            className="bg-neutral-100 rounded-lg flex items-center justify-center animate-pulse border border-neutral-200"
          >
            <QrIcon className="w-8 h-8 text-neutral-400" />
          </div>
        )}

        {allowInspect && (
          <span className="text-[9px] font-semibold text-neutral-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 cursor-pointer">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            Click to test scan
          </span>
        )}
      </div>

      {/* Verification Inspector Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-neutral-200 text-neutral-900 text-left space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Gate QR Verified</h4>
                  <p className="text-[11px] text-neutral-500">Official Swaminarayan University Payload</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-800 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <div className="flex justify-center p-3 bg-neutral-50 rounded-xl border border-neutral-200">
              {dataUrl && (
                <img 
                  src={dataUrl} 
                  alt="QR Code" 
                  className="w-44 h-44 rounded-lg bg-white p-2 shadow-inner border"
                />
              )}
            </div>

            <div className="space-y-1.5">
              <div className="text-[11px] font-semibold text-neutral-700 uppercase tracking-wider flex items-center justify-between">
                <span>Decoded Payload Data:</span>
                <button 
                  onClick={handleCopyPayload}
                  className="text-amber-700 hover:underline inline-flex items-center gap-1 text-[11px] font-normal"
                >
                  <Copy className="w-3 h-3" />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="p-3 bg-neutral-900 text-emerald-400 font-mono text-[11px] rounded-lg break-all border border-neutral-800 max-h-32 overflow-y-auto">
                {payload}
              </div>
            </div>

            <p className="text-[11px] text-neutral-600 leading-relaxed">
              💡 <strong>Real Scanner Ready:</strong> Open your smartphone camera or any QR scanner app (Google Lens, iPhone Camera, Paytm) to scan this image directly on your screen.
            </p>

            <button
              onClick={() => setIsModalOpen(false)}
              className="w-full py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors"
            >
              Close Verification
            </button>
          </div>
        </div>
      )}
    </>
  );
};
