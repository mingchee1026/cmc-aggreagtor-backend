import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './modules/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .addBearerAuth()
      .setTitle('CoinMarketCap Aggregator API docs')
      .setVersion('1.0')
      .build(),
  );

  SwaggerModule.setup('docs', app, document);

  await app.listen(8080);
}
bootstrap();
