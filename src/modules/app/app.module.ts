import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CryptocurrencyModule } from '../cryptocurrency/app.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `./config/.${process.env.NODE_ENV || 'local'}.env`,
      isGlobal: true,
    }),
    CryptocurrencyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
