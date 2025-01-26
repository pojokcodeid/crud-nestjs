import { createLogger, format, transports } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import 'dotenv/config';

/**
 * panduann
 * https://timothy.hashnode.dev/advance-your-nestjs-application-with-winston-logger-a-step-by-step-guide
 */

const customFormat = format.printf(
  ({
    timestamp,
    level,
    stack,
    message,
  }: {
    timestamp?: string;
    level: string;
    stack?: string;
    message: string;
  }) => {
    return `${timestamp || ''} - [${level.toUpperCase().padEnd(7)}] - ${stack || message}`;
  },
);

const transport = new DailyRotateFile({
  filename: './logs/app-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '1m',
  maxFiles: '14d',
  level: 'error',
  handleExceptions: true,
});

const devLogger = {
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    customFormat,
  ),
  transports: [
    new transports.Console({
      level: 'silly',
    }),
  ],
};

const prodLogger = {
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json(),
  ),

  transports: [
    transport,
    new transports.File({
      filename: './logs/combine.log',
      level: 'info',
    }),
  ],
};

const instanceLogger =
  process.env.NODE_ENV === 'production' ? prodLogger : devLogger;

export const instance = createLogger(instanceLogger);
