import { useState, useMemo } from 'react';
import { getAutoLogoCandidates, getInitials } from '../../utils/helpers';
import { IconPencil, IconTrash, IconCopy, IconCheck, IconExternalLink } from '../ui/Icons';
import './LinkCard.css';

export function LinkCard({ item, onCopy, onEdit, onDelete }) {
  const [failedLogos, setFailedLogos] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [copied, setCopied] = useState(false);

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
    setTimeout(() => setCopied(false), 1600);
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
            className="link-card-action-btn link-card-action-btn--cancel"
            onClick={() => setConfirmDelete(false)}
          >
            Cancel
          </button>
          <button
            className="link-card-action-btn link-card-action-btn--danger"
            onClick={() => onDelete(item.id)}
          >
            Delete
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`link-card ${copied ? 'copied' : ''}`}>
      <button
        className="link-card-main"
        onClick={handleCardClick}
        title="Click to copy link"
        aria-label={`Copy link for ${item.name}`}
      >
        <div className={`link-card-logo ${logoUrl ? '' : 'fallback'}`}>
          {logoUrl ? (
            <img src={logoUrl} alt={`${item.name} logo`} onError={handleLogoError} />
          ) : (
            getInitials(item.name)
          )}
        </div>
        <div className="link-card-info">
          <div className="link-card-name">{item.name}</div>
          <div className="link-card-id">
            <span className="link-card-id-pill">@{item.custom_id}</span>
          </div>
        </div>
        <div className={`link-card-copy-hint ${copied ? 'copied' : ''}`} aria-hidden="true">
          {copied ? <IconCheck /> : <IconCopy />}
        </div>
      </button>

      <div className="link-card-actions">
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="link-card-action-btn link-card-action-btn--open"
          title="Open link in new tab"
          aria-label={`Open ${item.name} in new tab`}
        >
          <IconExternalLink />
        </a>
        <button
          className="link-card-action-btn link-card-action-btn--edit"
          onClick={() => onEdit(item)}
          title="Edit link"
          aria-label={`Edit ${item.name}`}
        >
          <IconPencil />
        </button>
        <button
          className="link-card-action-btn link-card-action-btn--delete"
          onClick={() => setConfirmDelete(true)}
          title="Delete link"
          aria-label={`Delete ${item.name}`}
        >
          <IconTrash />
        </button>
      </div>
    </div>
  );
}

