import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/** true after hydration on the client, false during SSR — without a setState-in-effect. */
export function useIsClient(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
