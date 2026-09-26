'use client';

import { useMenuViewMode } from '@/hooks/useMenuViewMode';

/**
 * Container that swaps layout with the view mode. Drop-in replacement for
 * `<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">`.
 * Cards read the same store, so they switch their own internal layout.
 */
export default function MenuCollection({ children, label }: { children: React.ReactNode; label?: string }) {
  const [mode] = useMenuViewMode();
  return (
    <div
      role="list"
      aria-label={label}
      data-view={mode}
      className={
        mode === 'list'
          ? 'flex flex-col divide-y divide-panel-border border-y border-panel-border lg:grid lg:grid-cols-2 lg:gap-x-10 lg:divide-y-0 lg:border-y-0'
          : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10'
      }
    >
      {children}
    </div>
  );
}
