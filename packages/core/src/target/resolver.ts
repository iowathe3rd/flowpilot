import type { TargetSpec, ResolvedTarget, TargetRect } from '../types';

/**
 * Check if code is running in browser
 */
function isBrowser(): boolean {
  return (
    typeof globalThis !== 'undefined' &&
    typeof (globalThis as any).window !== 'undefined' &&
    typeof (globalThis as any).document !== 'undefined'
  );
}

/**
 * Resolve target element from spec
 */
export function resolveTargetElement(spec: TargetSpec): any | null {
  if (!isBrowser()) {
    return null;
  }

  const doc = (globalThis as any).document;

  // Null spec
  if (spec === null || spec === undefined) {
    return null;
  }

  // String selector
  if (typeof spec === 'string') {
    try {
      return doc.querySelector(spec);
    } catch {
      return null;
    }
  }

  // Function resolver
  if (typeof spec === 'function') {
    try {
      const result = spec();
      return result;
    } catch {
      return null;
    }
  }

  // Direct element or ref object
  if (typeof spec === 'object') {
    // Check if it's a React ref-like object
    if (spec && 'current' in spec) {
      return (spec as any).current;
    }
    // Assume it's a direct Element
    return spec;
  }

  return null;
}

/**
 * Calculate element rect
 */
export function getTargetRect(element: any): TargetRect {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
    left: rect.left,
  };
}

/**
 * Check if element is in viewport
 */
export function isInViewport(element: any): boolean {
  if (!isBrowser()) {
    return false;
  }

  const win = (globalThis as any).window;
  const doc = (globalThis as any).document;
  const rect = element.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (win.innerHeight || doc.documentElement.clientHeight) &&
    rect.right <= (win.innerWidth || doc.documentElement.clientWidth)
  );
}

/**
 * Check if element is visible
 */
export function isElementVisible(element: any): boolean {
  if (!isBrowser()) {
    return false;
  }

  const win = (globalThis as any).window;

  // Check display/visibility
  const style = win.getComputedStyle(element);
  if (
    style.display === 'none' ||
    style.visibility === 'hidden' ||
    style.opacity === '0'
  ) {
    return false;
  }

  // Check if element has size
  const rect = element.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

/**
 * Resolve full target information
 */
export function resolveTarget(spec: TargetSpec): ResolvedTarget | null {
  const element = resolveTargetElement(spec);
  if (!element) {
    return null;
  }

  return {
    element,
    rect: getTargetRect(element),
    isInViewport: isInViewport(element),
    isVisible: isElementVisible(element),
  };
}
