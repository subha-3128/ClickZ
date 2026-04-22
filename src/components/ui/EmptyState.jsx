import { IconLink } from './Icons';
import './EmptyState.css';

export function EmptyState() {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <IconLink />
      </div>
      <h2>No links added yet</h2>
      <p>Use the Add button to save your first link.</p>
    </div>
  );
}
