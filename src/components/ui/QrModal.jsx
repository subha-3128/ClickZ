import { useState } from 'react';
import { IconX, IconCopy, IconCheck, IconDownload, IconExternalLink } from './Icons';
import './QrModal.css';

export function QrModal({ item, onClose, onCopy }) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!item) return null;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=12&data=${encodeURIComponent(item.link)}`;

  function handleCopy() {
    onCopy(item.link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function handleDownloadQr() {
    setDownloading(true);
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ClickZ-QR-${item.custom_id || 'link'}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      window.open(qrCodeUrl, '_blank');
    } finally {
      setDownloading(false);
    }
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  return (
    <div className="qr-modal-overlay" onClick={handleOverlayClick} role="dialog" aria-modal="true">
      <div className="qr-modal-card">
        <div className="qr-modal-header">
          <div className="qr-modal-title-wrap">
            <h2>QR Code</h2>
            <div className="qr-modal-subtitle">
              <span className="qr-item-name">{item.name}</span>
              <span className="qr-item-id">@{item.custom_id}</span>
            </div>
          </div>
          <button className="qr-modal-close" onClick={onClose} aria-label="Close QR Code Modal">
            <IconX />
          </button>
        </div>

        <div className="qr-image-wrapper">
          <img src={qrCodeUrl} alt={`QR code for ${item.name}`} className="qr-image" />
        </div>

        <div className="qr-url-preview">
          <span className="qr-url-text">{item.link}</span>
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="qr-external-link"
            title="Open link in new tab"
          >
            <IconExternalLink />
          </a>
        </div>

        <div className="qr-modal-actions">
          <button className={`qr-action-btn ${copied ? 'copied' : ''}`} onClick={handleCopy}>
            {copied ? <IconCheck /> : <IconCopy />}
            <span>{copied ? 'Copied' : 'Copy URL'}</span>
          </button>
          <button className="qr-action-btn qr-action-btn--primary" onClick={handleDownloadQr} disabled={downloading}>
            <IconDownload />
            <span>{downloading ? 'Downloading...' : 'Download Image'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
