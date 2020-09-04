import winston from 'winston';
import express from 'express';
import 'winston-daily-rotate-file';

const logger: winston.Logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.prettyPrint(),
  ),
  transports: [
    new winston.transports.DailyRotateFile({
      filename: 'log/error-%DATE%.log', 
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
    new winston.transports.DailyRotateFile({
        filename: 'log/combined-%DATE%.log', 
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '40m',
        maxFiles: '14d',
    }),
  ],
  exitOnError: false,
});

function log (msg: string, lvl: string = 'error'): void {
  logger.log(lvl, msg);
}

function respond (res: express.Response): void;
function respond (res: express.Response, body: object): void;
function respond (res: express.Response, status: number, msg: string): void;
function respond (res: express.Response, status: number, msg: string, err: Error): void;

function respond (res: express.Response, p1?: object|number, p2?: string, err?: Error): void {
    res.status(200).send({
        success: typeof p1 !== 'number' || p1 === 200,
        code: typeof p1 === 'number' ? p1 : 200,
        msg: p2,
        body: typeof p1 !== 'number' ? p1 : undefined,
    });
    if (typeof p1 === 'number' && p1 >= 500 && p1 < 600 && err) log(err.stack||err.toString());
}

export default {
  log,
  respond,
};