import { IconLink } from './Icons';
import './EmptyState.css';

export function EmptyState() {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <IconLink />
      </div>
      <h2>No links saved yet</h2>
      <p>Click "New Link" or press <kbd>N</kbd> to add your first bookmark.</p>
    </div>
  );
}
