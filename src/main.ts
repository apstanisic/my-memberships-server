import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  //
  //
  //
  //
  //
  /* App should be general. Not just for gyms. Joga, pilatess, library... Everything with subscription can be applied. */
  //
  //
  //
  //
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableCircularCheck: true,
        enableImplicitConversion: true
      }
    })
  );
  await app.listen(3000);
}
bootstrap();
