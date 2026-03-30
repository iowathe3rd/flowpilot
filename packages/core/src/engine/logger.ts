import type { Logger, LoggerConfig, LogLevel } from '../types';

/**
 * Log level priority for filtering
 */
const LOG_LEVELS: Record<LogLevel, number> = {
  silent: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
};

/**
 * Default console logger implementation
 */
class ConsoleLogger implements Logger {
  constructor(
    private minLevel: LogLevel,
    private prefix: string
  ) {}

  private shouldLog(level: Exclude<LogLevel, 'silent'>): boolean {
    return LOG_LEVELS[level] <= LOG_LEVELS[this.minLevel];
  }

  private formatMessage(message: string): string {
    return this.prefix ? `[${this.prefix}] ${message}` : message;
  }

  error(message: string, data?: unknown): void {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage(message), data ?? '');
    }
  }

  warn(message: string, data?: unknown): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage(message), data ?? '');
    }
  }

  info(message: string, data?: unknown): void {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage(message), data ?? '');
    }
  }

  debug(message: string, data?: unknown): void {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage(message), data ?? '');
    }
  }
}

/**
 * Silent logger that does nothing
 */
class SilentLogger implements Logger {
  error(): void {}
  warn(): void {}
  info(): void {}
  debug(): void {}
}

/**
 * Create a logger instance based on configuration
 */
export function createLogger(config: LoggerConfig = {}): Logger {
  const { level = 'warn', custom, prefix = 'FlowPilot' } = config;

  // Use custom logger if provided
  if (custom) {
    return custom;
  }

  // Return silent logger if level is silent
  if (level === 'silent') {
    return new SilentLogger();
  }

  // Return console logger
  return new ConsoleLogger(level, prefix);
}
