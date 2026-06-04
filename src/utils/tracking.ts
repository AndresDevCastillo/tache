/**
 * Utilidad segura para disparar eventos de Google Analytics (GA4).
 * No lanza errores ni warnings si gtag no está cargado.
 * Compatible con Astro ViewTransitions: llamar en scripts de componente.
 */
export function trackEvent(name: string, params?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  try {
    const w = window as Window & { gtag?: (...args: unknown[]) => void };
    if (typeof w.gtag === 'function') {
      w.gtag('event', name, params ?? {});
    }
  } catch {
    // Silencioso: gtag puede no estar disponible (adblockers, GA desactivado)
  }
}
