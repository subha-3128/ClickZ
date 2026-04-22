import { useState, useMemo } from 'react';
import { getAutoLogoCandidates, getInitials } from '../../utils/helpers';
import { IconPencil, IconTrash, IconCopy } from '../ui/Icons';
import './LinkCard.css';

export function LinkCard({ item, onCopy, onEdit, onDelete }) {
  const [failedLogos, setFailedLogos] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(false);

  const logoCandidates = useMemo(
    () => getAutoLogoCandidates(item.name, item.custom_id, item.link),
    [item.name, item.custom_id, item.link],
  );
  const logoUrl = logoCandidates.find((url) => !failedLogos[url]) || '';

  function handleLogoError() {
    if (!logoUrl) return;
    setFailedLogos((prev) => ({ ...prev, [logoUrl]: true }));
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
    <div className="link-card">
      <button
        className="link-card-main"
        onClick={() => onCopy(item.link)}
        title="Click to copy link"
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
          <div className="link-card-id">{item.custom_id}</div>
        </div>
        <div className="link-card-copy-hint" aria-hidden="true">
          <IconCopy />
        </div>
      </button>

      <div className="link-card-actions">
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
