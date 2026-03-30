export type LogLevel = 'silent' | 'error' | 'warn' | 'info' | 'debug';

export interface LogEntry {
  level: Exclude<LogLevel, 'silent'>;
  message: string;
  data?: unknown;
  timestamp: number;
}

export interface Logger {
  error(message: string, data?: unknown): void;
  warn(message: string, data?: unknown): void;
  info(message: string, data?: unknown): void;
  debug(message: string, data?: unknown): void;
}

export interface LoggerConfig {
  level?: LogLevel;
  custom?: Logger;
  prefix?: string;
}
