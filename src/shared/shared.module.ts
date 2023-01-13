import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserSubscriber } from '../user/subscribes/user.subscriber';
import { configurationModuleOptions } from './configs/module-options';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { AppLoggerModule } from './logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot(configurationModuleOptions),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('db.host'),
        port: configService.get<number | undefined>('db.port'),
        database: configService.get<string>('db.name'),
        username: configService.get<string>('db.user'),
        password: configService.get<string>('db.pass'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        // Timezone configure=d on the MySQL server.
        // This is used to typecast server date/time values to JavaScript Date object and vice versa.
        migrations: [__dirname + '/src/migrations/*{.ts,.js}'],
        cli: {
          migrationsDir: __dirname + '/src/migrations',
        },
        timezone: 'Z',
        synchronize: false,
        debug: configService.get<string>('env') === 'dev',
        // ssl: true,
        // extra: {
        //   ssl: {
        //     rejectUnauthorized: false,
        //   },
        // },
        subscribers: [UserSubscriber],
      }),
    }),
    AppLoggerModule,
  ],
  exports: [AppLoggerModule, ConfigModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class SharedModule {}
