import { useState, useEffect } from 'react';
import { IconCheck } from './Icons';
import './Toast.css';

export function Toast({ message, onDone }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t1 = window.setTimeout(() => setExiting(true), 1800);
    const t2 = window.setTimeout(onDone, 2100);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [onDone]);

  return (
    <div className={`toast ${exiting ? 'exiting' : ''}`} role="status" aria-live="polite">
      <IconCheck />
      {message}
    </div>
  );
}
