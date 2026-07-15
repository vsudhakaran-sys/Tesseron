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

// Module-level state (shared across all hook instances) with initial dummy data
let memoryState: Notification[] = [
  {
    id: "d1",
    title: "Low Fuel Warning",
    description: "Vehicle NL-202-A fuel level is below 15%. Scheduled fill-up suggested.",
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 min ago
    read: false,
  },
  {
    id: "d2",
    title: "Scheduled Maintenance Alert",
    description: "Vehicle US-501-F is due for routine engine oil change and tire rotation.",
    timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 min ago
    read: false,
  },
  {
    id: "d3",
    title: "Odometer Discrepancy",
    description: "Odometer input for vehicle TR-882-B exceeds last verified value by 12,000 km.",
    timestamp: new Date(Date.now() - 3.5 * 3600 * 1000), // 3.5 hours ago
    read: false,
  },
];
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
