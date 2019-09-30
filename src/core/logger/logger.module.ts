import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbLoggerService } from './db-logger.service';
import { Log } from './log.entity';

/** This module uses NoSql db for efficient storing. */
@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Log], 'log_db')],
  providers: [DbLoggerService],
  exports: [DbLoggerService],
})
export class LoggerModule {}
