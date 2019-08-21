import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '../config/config.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailModule } from '../mail/mail.module';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRoot(),
    GraphQLModule.forRoot({ autoSchemaFile: 'schema.graphql' }),
    AuthModule,
    MailModule
  ],
  controllers: [AppController],
  providers: [AppService]
  // exports: [ConfigModule, AuthModule, MailModule, AdsModule, StorageModule]
})
export class AppModule {}
