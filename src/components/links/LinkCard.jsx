import { useState, useMemo } from 'react';
import { getAutoLogoCandidates, getInitials } from '../../utils/helpers';
import './LinkCard.css';

export function LinkCard({ item, onCopy }) {
  const [failedLogos, setFailedLogos] = useState({});
  const logoCandidates = useMemo(
    () => getAutoLogoCandidates(item.name, item.custom_id, item.link),
    [item.name, item.custom_id, item.link],
  );
  const logoUrl = logoCandidates.find((url) => !failedLogos[url]) || '';
  const logoError = !logoUrl;

  function handleLogoError() {
    if (!logoUrl) return;
    setFailedLogos((prev) => ({ ...prev, [logoUrl]: true }));
  }

  return (
    <button className="link-card" onClick={() => onCopy(item.link)} title="Copy link">
      <div className={`link-card-logo ${logoUrl && !logoError ? '' : 'fallback'}`}>
        {logoUrl && !logoError ? (
          <img src={logoUrl} alt={`${item.name} logo`} onError={handleLogoError} />
        ) : (
          getInitials(item.name)
        )}
      </div>
      <div className="link-card-info">
        <div className="link-card-name">{item.name}</div>
        <div className="link-card-id">{item.custom_id}</div>
      </div>
    </button>
  );
}
