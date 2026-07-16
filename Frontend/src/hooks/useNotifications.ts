import { useState, useEffect } from "react";

type Notification = {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
};

// ID generator (counter pattern from use-toast.ts)
let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

// Notification list cap — keep last 20 entries
const NOTIFICATION_LIMIT = 20;

// Module-level state (shared across all hook instances)
let memoryState: Notification[] = [];
const listeners: Array<(state: Notification[]) => void> = [];

function dispatch(next: Notification[]) {
  memoryState = next;
  listeners.forEach(l => l(next));
}

export function addNotification({ title, description }: { title: string; description: string }) {
  const next = [
    { id: genId(), title, description, timestamp: new Date(), read: false },
    ...memoryState,
  ].slice(0, NOTIFICATION_LIMIT);
  dispatch(next);
}

export function markAllRead() {
  dispatch(memoryState.map(n => ({ ...n, read: true })));
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(memoryState);
  useEffect(() => {
    // Empty dependency array: listener is registered once on mount and removed on unmount.
    listeners.push(setNotifications);
    return () => {
      const index = listeners.indexOf(setNotifications);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);
  const unreadCount = notifications.filter(n => !n.read).length;
  return { notifications, unreadCount };
}
