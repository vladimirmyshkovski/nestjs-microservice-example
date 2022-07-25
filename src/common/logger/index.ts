import {
  createLogger,
  format as wFormat,
  transports as wTransports,
} from 'winston';
import { ElasticsearchTransport } from 'winston-elasticsearch';
import { Injectable, ConsoleLogger as CommonLogger } from '@nestjs/common';
import { Logger as WinstonLogger } from 'winston';

export const levels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
};

type Levels = typeof levels;

export const format = wFormat.combine(wFormat.timestamp(), wFormat.json());

export type Transport =
  | typeof wTransports.Console
  | typeof wTransports.File
  | ElasticsearchTransport;

const getExceptionHandlers = () => {
  if (process.env.NODE_ENV === 'production') {
    return [];
  }
  const exceptionsFileTransport = new wTransports.File({
    filename: 'exceptions.log',
  });
  return [exceptionsFileTransport];
};

const getRejectionHandlers = () => {
  if (process.env.NODE_ENV === 'production') {
    return [];
  }
  const rejectionsFileTransport = new wTransports.File({
    filename: 'rejections.log',
  });
  return [rejectionsFileTransport];
};

const getTransports = () => {
  if (process.env.NODE_ENV === 'production') {
    const elasticSearchTransportOptions = {
      level: process.env.LOGGING_LEVEL || 'info',
      clientOpts: {
        node: process.env.LOGGING_NODE,
        host: process.env.LOGGING_HOST,
      },
      transformer: (logData) => {
        return {
          '@timestamp': new Date().getTime(),
          severity: logData.level,
          message: `[${logData.level}] LOG Message: ${logData.message}`,
          fields: {},
        };
      },
    };
    const elasticSearchTransport = new ElasticsearchTransport(
      elasticSearchTransportOptions,
    );
    return [elasticSearchTransport];
  }
  const consoleTransport = new wTransports.Console({ level: 'info' });

  const fileTransport = new wTransports.File({ filename: 'file.log' });
  const defaultTransports: Transport[] = [];

  const devTransports = defaultTransports.concat([
    consoleTransport,
    fileTransport,
  ]);
  return devTransports;
};

export const transports = getTransports();
export const exceptionHandlers = getExceptionHandlers();
export const rejectionHandlers = getRejectionHandlers();

@Injectable()
export class Logger extends CommonLogger {
  private logger: WinstonLogger;

  constructor(
    service: string,
    levels: Levels,
    transports: Transport[],
    exceptionHandlers: Transport[],
    rejectionHandlers: Transport[],
  ) {
    super();
    this.logger = createLogger({
      levels,
      format,
      defaultMeta: {
        service,
      },
      transports,
      exceptionHandlers,
      rejectionHandlers,
    });
  }
}

export const logger = new Logger(
  process.env.SERVICE_NAME,
  levels,
  transports,
  exceptionHandlers,
  rejectionHandlers,
);
