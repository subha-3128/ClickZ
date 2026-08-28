import { useState, useMemo, useEffect, useRef } from 'react';
import { getAutoLogoCandidates, getInitials } from '../../utils/helpers';
import { IconPencil, IconTrash, IconCopy, IconCheck, IconExternalLink, IconQrCode, IconMoreVertical } from '../ui/Icons';
import './LinkCard.css';

export function LinkCard({ item, index = 0, onCopy, onEdit, onDelete, onShowQr }) {
  const [failedLogos, setFailedLogos] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const logoCandidates = useMemo(
    () => getAutoLogoCandidates(item.name, item.custom_id, item.link),
    [item.name, item.custom_id, item.link],
  );
  const logoUrl = logoCandidates.find((url) => !failedLogos[url]) || '';

  function handleLogoError() {
    if (!logoUrl) return;
    setFailedLogos((prev) => ({ ...prev, [logoUrl]: true }));
  }

  function handleCardClick() {
    onCopy(item.link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  if (confirmDelete) {
    return (
      <div className="link-card link-card--confirm">
        <div className="link-card-confirm-text">
          <IconTrash />
          <span>Delete <strong>{item.name}</strong>?</span>
        </div>
        <div className="link-card-confirm-actions">
          <button
            type="button"
            className="link-card-confirm-btn link-card-confirm-btn--cancel"
            onClick={() => setConfirmDelete(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="link-card-confirm-btn link-card-confirm-btn--danger"
            onClick={() => onDelete(item.id)}
          >
            Delete
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`link-card ${copied ? 'copied' : ''} ${isMenuOpen ? 'menu-open' : ''}`}
      style={{ animationDelay: `${Math.min(index, 10) * 30}ms` }}
    >
      <button
        type="button"
        className="link-card-main"
        onClick={handleCardClick}
        title="Click to copy link"
        aria-label={`Copy link for ${item.name}`}
      >
        <div className={`link-card-logo ${logoUrl ? '' : 'fallback'}`}>
          {logoUrl ? (
            <img src={logoUrl} alt={`${item.name} logo`} onError={handleLogoError} />
          ) : (
            <span>{getInitials(item.name)}</span>
          )}
        </div>

        <div className="link-card-info">
          <div className="link-card-header-row">
            <span className="link-card-name">{item.name}</span>
          </div>
          <div className="link-card-meta">
            <span className="link-card-id">@{item.custom_id}</span>
            <span className="link-card-dot">•</span>
            <span className="link-card-url">{item.link.replace(/^https?:\/\//, '')}</span>
          </div>
        </div>

        <div className={`link-card-copy-hint ${copied ? 'copied' : ''}`} aria-hidden="true">
          {copied ? (
            <>
              <IconCheck />
              <span className="copied-text">Copied</span>
            </>
          ) : (
            <IconCopy />
          )}
        </div>
      </button>

      <div className="link-card-actions-wrapper" ref={menuRef}>
        <button
          type="button"
          className={`link-card-menu-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsMenuOpen((prev) => !prev);
          }}
          aria-label="Options"
        >
          <IconMoreVertical />
        </button>

        <div className={`link-card-actions ${isMenuOpen ? 'open' : ''}`}>
          <button
            type="button"
            className="link-card-action-btn"
            onClick={() => {
              setIsMenuOpen(false);
              onShowQr && onShowQr(item);
            }}
            title="QR Code"
            aria-label={`Show QR Code for ${item.name}`}
          >
            <IconQrCode />
            <span className="mobile-action-label">QR Code</span>
          </button>
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="link-card-action-btn"
            title="Open in new tab"
            aria-label={`Open ${item.name} in new tab`}
            onClick={() => setIsMenuOpen(false)}
          >
            <IconExternalLink />
            <span className="mobile-action-label">Open link</span>
          </a>
          <button
            type="button"
            className="link-card-action-btn"
            onClick={() => {
              setIsMenuOpen(false);
              onEdit(item);
            }}
            title="Edit"
            aria-label={`Edit ${item.name}`}
          >
            <IconPencil />
            <span className="mobile-action-label">Edit</span>
          </button>
          <button
            type="button"
            className="link-card-action-btn link-card-action-btn--delete"
            onClick={() => {
              setIsMenuOpen(false);
              setConfirmDelete(true);
            }}
            title="Delete"
            aria-label={`Delete ${item.name}`}
          >
            <IconTrash />
            <span className="mobile-action-label">Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
