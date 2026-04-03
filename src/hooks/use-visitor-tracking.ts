import { useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://jan-justice-bancked.onrender.com/api';
const VISITOR_ID_KEY = 'jj_visitor_id';
const LAST_TRACKED_KEY = 'jj_last_tracked';

function getOrCreateVisitorId(): string {
  let id = localStorage.getItem(VISITOR_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_ID_KEY, id);
  }
  return id;
}

export function useVisitorTracking() {
  useEffect(() => {
    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const lastTracked = localStorage.getItem(LAST_TRACKED_KEY);

      // Already tracked today — skip
      if (lastTracked === today) return;

      const visitorId = getOrCreateVisitorId();

      fetch(`${API_BASE_URL}/analytics/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitorId }),
      })
        .then(() => {
          localStorage.setItem(LAST_TRACKED_KEY, today);
        })
        .catch(() => {
          // Silently fail — tracking is non-critical
        });
    } catch {
      // Silently fail if localStorage is unavailable (private browsing, etc.)
    }
  }, []);
}
