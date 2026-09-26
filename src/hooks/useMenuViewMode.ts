'use client';

/**
 * Menu view mode — 'editorial' (large imagery, craft story) or 'list' (dense, repeat-order).
 *
 * - One external store (localStorage + ?view= URL param), read with useSyncExternalStore,
 *   so every card/toggle on the page stays in sync without a React context provider and
 *   with NO hydration mismatch (server snapshot is always 'editorial').
 * - ?view=list wins over localStorage → print it on the counter QR code / SMS blasts
 *   ("reorder in 2 taps") and regulars land straight in Speed Order.
 */
import { useCallback, useSyncExternalStore } from 'react';

export type MenuViewMode = 'editorial' | 'list';

const KEY = 'raggio:menu-view';
const EVT = 'raggio:menu-view-change';

function read(): MenuViewMode {
  if (typeof window === 'undefined') return 'editorial';
  try {
    const q = new URLSearchParams(window.location.search).get('view');
    if (q === 'list' || q === 'editorial') return q;
    const v = window.localStorage.getItem(KEY);
    return v === 'list' ? 'list' : 'editorial';
  } catch {
    return 'editorial';
  }
}

function subscribe(cb: () => void) {
  window.addEventListener('storage', cb);
  window.addEventListener(EVT, cb);
  window.addEventListener('popstate', cb);
  return () => {
    window.removeEventListener('storage', cb);
    window.removeEventListener(EVT, cb);
    window.removeEventListener('popstate', cb);
  };
}

export function useMenuViewMode(): [MenuViewMode, (m: MenuViewMode) => void] {
  const mode = useSyncExternalStore(subscribe, read, () => 'editorial' as MenuViewMode);

  const setMode = useCallback((m: MenuViewMode) => {
    try {
      window.localStorage.setItem(KEY, m);
      const url = new URL(window.location.href);
      if (url.searchParams.has('view')) {
        url.searchParams.set('view', m);
        window.history.replaceState(window.history.state, '', url);
      }
    } catch {
      /* private mode: in-memory only */
    }
    window.dispatchEvent(new Event(EVT));
  }, []);

  return [mode, setMode];
}
