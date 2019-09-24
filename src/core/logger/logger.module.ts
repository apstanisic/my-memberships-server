import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerService } from './logger.service';
import { Log } from './log.entity';
import { ConfigService } from '../config/config.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Log]),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        host: config.get('LOG_DB_HOST'),
        database: config.get('LOG_DB_DATABASE'),
        port: config.get('LOG_DB_PORT'),
        username: config.get('LOG_DB_USER'),
        password: config.get('LOG_DB_PASSWORD'),
      }),
    }),
  ],
  providers: [LoggerService],
})
export class LoggerModule {}
