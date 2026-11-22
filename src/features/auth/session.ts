/**
 * The admin session is the API token kept in localStorage. The key is unchanged from the
 * previous app so existing sign-ins survive the upgrade.
 */
const TOKEN_STORAGE_KEY = "adminToken";

export type SessionEndReason = "signed-out" | "expired" | "deleted";

const changeListeners = new Set<() => void>();
const endListeners = new Set<(reason: SessionEndReason) => void>();

export function getToken(): string | null {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  // Older builds could store the strings "undefined" or "null" after a failed login.
  return token && token !== "undefined" && token !== "null" ? token : null;
}

export function startSession(token: string): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
  notifyChange();
}

export function endSession(reason: SessionEndReason): void {
  if (getToken() === null) return;
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  notifyChange();
  endListeners.forEach((listener) => listener(reason));
}

/** For useSyncExternalStore: fires on sign-in/out in this tab and in other tabs. */
export function subscribeToToken(listener: () => void): () => void {
  const onStorage = (event: StorageEvent) => {
    if (event.key === TOKEN_STORAGE_KEY) listener();
  };
  changeListeners.add(listener);
  window.addEventListener("storage", onStorage);
  return () => {
    changeListeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function onSessionEnd(listener: (reason: SessionEndReason) => void): () => void {
  endListeners.add(listener);
  return () => {
    endListeners.delete(listener);
  };
}

function notifyChange(): void {
  changeListeners.forEach((listener) => listener());
}
