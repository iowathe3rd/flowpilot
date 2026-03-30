import type { TargetSpec } from '../types';
import { resolveTargetElement } from './resolver';

export type TargetChangeCallback = (element: any | null) => void;

/**
 * Observer that watches for target availability and changes
 */
export class TargetObserver {
  private spec: TargetSpec;
  private callback: TargetChangeCallback;
  private currentElement: any | null = null;
  private mutationObserver: any | null = null;
  private resizeObserver: any | null = null;
  private interval: any | null = null;
  private isBrowser: boolean;

  constructor(spec: TargetSpec, callback: TargetChangeCallback) {
    this.spec = spec;
    this.callback = callback;
    this.isBrowser =
      typeof globalThis !== 'undefined' &&
      typeof (globalThis as any).window !== 'undefined' &&
      typeof (globalThis as any).document !== 'undefined';
  }

  /**
   * Start observing
   */
  start(): void {
    if (!this.isBrowser) return;

    const win = (globalThis as any).window;
    const doc = (globalThis as any).document;

    // Initial check
    this.check();

    // Setup MutationObserver for DOM changes
    if (typeof (globalThis as any).MutationObserver !== 'undefined') {
      const MutationObs = (globalThis as any).MutationObserver;
      this.mutationObserver = new MutationObs(() => this.check());
      this.mutationObserver.observe(doc.body, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    }

    // Setup ResizeObserver for size changes
    if (
      typeof (globalThis as any).ResizeObserver !== 'undefined' &&
      this.currentElement
    ) {
      const ResizeObs = (globalThis as any).ResizeObserver;
      this.resizeObserver = new ResizeObs(() => this.check());
      this.resizeObserver.observe(this.currentElement);
    }

    // Fallback polling for environments without observers
    if (!this.mutationObserver) {
      this.interval = win.setInterval(() => this.check(), 1000);
    }
  }

  /**
   * Stop observing
   */
  stop(): void {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
      this.mutationObserver = null;
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    if (this.interval !== null) {
      const win = (globalThis as any).window;
      if (win && win.clearInterval) {
        win.clearInterval(this.interval);
      }
      this.interval = null;
    }
  }

  /**
   * Check if target has changed
   */
  private check(): void {
    const element = resolveTargetElement(this.spec);

    if (element !== this.currentElement) {
      this.currentElement = element;
      this.callback(element);

      // Update ResizeObserver
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
      }
      if (
        element &&
        typeof (globalThis as any).ResizeObserver !== 'undefined'
      ) {
        const ResizeObs = (globalThis as any).ResizeObserver;
        this.resizeObserver = new ResizeObs(() => this.check());
        this.resizeObserver.observe(element);
      }
    }
  }
}

/**
 * Wait for target to appear with timeout
 */
export async function waitForTarget(
  spec: TargetSpec,
  timeout: number = 5000
): Promise<any | null> {
  if (typeof globalThis === 'undefined' || !(globalThis as any).window) {
    return null;
  }

  const element = resolveTargetElement(spec);
  if (element) {
    return element;
  }

  return new Promise((resolve) => {
    const startTime = Date.now();
    let observer: TargetObserver | null = null;

    const cleanup = () => {
      if (observer) {
        observer.stop();
      }
    };

    observer = new TargetObserver(spec, (el) => {
      if (el) {
        cleanup();
        resolve(el);
      } else if (Date.now() - startTime >= timeout) {
        cleanup();
        resolve(null);
      }
    });

    observer.start();

    // Timeout fallback
    setTimeout(() => {
      cleanup();
      resolve(null);
    }, timeout);
  });
}
