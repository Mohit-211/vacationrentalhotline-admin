/**
 * The session is an httpOnly cookie set by the API, which scripts can't read. The HTTP client
 * reports a 401 here, and the auth provider listens so the app can return to the sign-in page.
 */
const listeners = new Set<() => void>();

export function reportSessionEnded(): void {
  listeners.forEach((listener) => listener());
}

export function onSessionEnded(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
