import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

import { REQUEST_ID_TOKEN_HEADER } from '../constants';
import { BaseApiException } from '../exceptions/base-api.exception';
import { AppLogger } from '../logger/logger.service';
import { createRequestContext } from '../request-context/util';

@Catch()
export class AllExceptionsFilter<T> implements ExceptionFilter {
  constructor(
    private config: ConfigService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(AllExceptionsFilter.name);
  }

  catch(exception: any, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const req: Request = ctx.getRequest<Request>();
    const res: Response = ctx.getResponse<Response>();

    const path = req.url;
    const timestamp = new Date().toDateString();
    const requestId = req.headers[REQUEST_ID_TOKEN_HEADER];
    const reqCtx = createRequestContext(req);

    let stack: any;
    let statusCode: HttpStatus;
    let errorName: string;
    let message: string;
    let details: string | Record<string, any>;

    const errorData = this.getErrorData(exception);

    if (errorData?.message) {
      message = errorData.message;
    }

    if (errorData?.errorName) {
      errorName = errorData.errorName;
    }

    if (errorData?.statusCode) {
      statusCode = errorData.statusCode;
    }

    if (errorData?.details) {
      details = errorData.details;
    }

    if (errorData?.stack) {
      stack = errorData.stack;
    }

    statusCode = statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    errorName = errorName || 'InternalException';
    message = message || 'Internal server error';

    const error = {
      statusCode,
      message,
      errorName,
      details,
      path,
      requestId,
      timestamp,
    };

    this.logger.warn(reqCtx, error.message, {
      error,
      stack,
    });

    const isProdMod = this.config.get<string>('env') !== 'dev';
    if (isProdMod && statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
      error.message = 'Internal server error';
    }

    res.status(statusCode).json({ error });
  }

  private getErrorData(exception: any) {
    switch (exception.constructor) {
      case BaseApiException: {
        return {
          statusCode: exception.getStatus(),
          errorName: exception.constructor.name,
          message: exception.message,
          details: exception.details || exception.getResponse(),
        };
      }
      case UnauthorizedException: {
        return {
          statusCode: exception.getStatus(),
          errorName: exception.constructor.name,
          message: exception.message,
          details: exception.details || exception.getResponse(),
        };
      }
      case ForbiddenException: {
        return {
          statusCode: exception.getStatus(),
          errorName: exception.constructor.name,
          message: exception.message,
          details: exception.details || exception.getResponse(),
        };
      }
      case NotFoundException: {
        return {
          statusCode: exception.getStatus(),
          errorName: exception.constructor.name,
          message: exception.message,
          details: exception.details || exception.getResponse(),
        };
      }
      case BadRequestException: {
        return {
          statusCode: exception.getStatus(),
          errorName: exception.constructor.name,
          message: exception.message,
          details: exception.details || exception.getResponse(),
        };
      }
      case HttpException: {
        return {
          statusCode: exception.getStatus(),
          errorName: exception.constructor.name,
          message: exception.message,
          details: exception.details || exception.getResponse(),
        };
      }

      case Error: {
        return {
          errorName: exception.constructor.name,
          message: exception.message,
          stack: exception.stack,
        };
      }
    }
  }
}
