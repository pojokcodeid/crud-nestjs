import { createLogger, format, transports } from 'winston';
import 'dotenv/config';

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

const options = {
  file: {
    filename: './logs/error.log',
    level: 'error',
  },
  console: {
    level: 'silly',
  },
};

const devLogger = {
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    customFormat,
  ),
  transports: [new transports.Console(options.console)],
};

const prodLogger = {
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json(),
  ),
  transports: [
    new transports.File(options.file),
    new transports.File({
      filename: './logs/combine.log',
      level: 'info',
    }),
  ],
};

const instanceLogger =
  process.env.NODE_ENV === 'production' ? prodLogger : devLogger;

export const instance = createLogger(instanceLogger);
