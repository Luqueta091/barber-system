type LogPayload = unknown[];

const format = (level: string, message: string): string => `[${level}] ${message}`;

export const logger = {
  info: (message: string, ...args: LogPayload): void => {
    console.log(format('INFO', message), ...args);
  },
  warn: (message: string, ...args: LogPayload): void => {
    console.warn(format('WARN', message), ...args);
  },
  error: (message: string, ...args: LogPayload): void => {
    console.error(format('ERROR', message), ...args);
  },
};
