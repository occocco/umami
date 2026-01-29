import { Params } from 'nestjs-pino';
import { Request, Response } from 'express';

export const LoggerConfig: Params = {
  pinoHttp: {
    name: 'api-server',
    level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
    customProps: (req: Request) => ({
      clientIp:
        req.ip ||
        (req.headers['x-forwarded-for'] as string) ||
        req.socket.remoteAddress,
    }),
    serializers: {
      req: (req: Request) => ({
        method: req.method,
        url: req.url,
        userAgent: req.headers['user-agent'],
      }),
      res: (res: Response) => ({
        statusCode: res.statusCode,
      }),
    },

    customSuccessMessage(req, res) {
      return `${req.method} ${req.url} ${res.statusCode}`;
    },

    transport:
      process.env.NODE_ENV !== 'production'
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'yyyy-mm-dd HH:MM:ss',
              singleLine: false,
            },
          }
        : undefined,
  },
};
