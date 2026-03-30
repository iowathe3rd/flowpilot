import type { EventEmitter, EventListener, FlowPilotEvent, Unsubscribe } from '../types';

/**
 * Simple event emitter implementation for FlowPilot
 */
export class FlowEventEmitter implements EventEmitter {
  private listeners: Map<string, Set<EventListener>> = new Map();

  /**
   * Subscribe to an event
   */
  on<T extends FlowPilotEvent['type']>(
    eventType: T,
    listener: EventListener<Extract<FlowPilotEvent, { type: T }>>
  ): Unsubscribe {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }

    const listeners = this.listeners.get(eventType)!;
    listeners.add(listener as EventListener);

    // Return unsubscribe function
    return () => {
      listeners.delete(listener as EventListener);
      if (listeners.size === 0) {
        this.listeners.delete(eventType);
      }
    };
  }

  /**
   * Emit an event to all subscribers
   */
  emit(event: FlowPilotEvent): void {
    const listeners = this.listeners.get(event.type);
    if (!listeners || listeners.size === 0) {
      return;
    }

    // Call all listeners with the event
    listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (error) {
        // Prevent one listener error from breaking others
        console.error(`Error in event listener for "${event.type}":`, error);
      }
    });
  }

  /**
   * Remove all listeners for an event type, or all listeners if no type specified
   */
  off(eventType?: FlowPilotEvent['type']): void {
    if (eventType) {
      this.listeners.delete(eventType);
    } else {
      this.listeners.clear();
    }
  }

  /**
   * Get listener count for debugging
   */
  listenerCount(eventType?: FlowPilotEvent['type']): number {
    if (eventType) {
      return this.listeners.get(eventType)?.size ?? 0;
    }
    let total = 0;
    this.listeners.forEach((listeners) => {
      total += listeners.size;
    });
    return total;
  }

  /**
   * Check if there are any listeners for an event type
   */
  hasListeners(eventType: FlowPilotEvent['type']): boolean {
    const listeners = this.listeners.get(eventType);
    return listeners !== undefined && listeners.size > 0;
  }
}
