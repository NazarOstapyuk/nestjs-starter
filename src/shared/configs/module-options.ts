import * as Joi from '@hapi/joi';
import { ConfigModuleOptions } from '@nestjs/config';

import configuration from './configuration';

export const configurationModuleOptions: ConfigModuleOptions = {
  envFilePath: '.env',
  load: [configuration],
  validationSchema: Joi.object({
    APP_ENV: Joi.string().valid('dev', 'stage', 'production').default('dev'),
    PORT: Joi.number().required(),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.string().required(),
    DB_NAME: Joi.string().required(),
    DB_USER: Joi.string().required(),
    DB_PASS: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
    REFRESH_SECRET: Joi.string().required(),
  }),
};
