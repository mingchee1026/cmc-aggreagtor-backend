import { Module } from '@nestjs/common';
import { CryptocurrencyController } from './cryptocurrency.controller';
import { CryptocurrencyService } from './cryptocurrency.service';

@Module({
  controllers: [CryptocurrencyController],
  providers: [CryptocurrencyService],
})
export class CryptocurrencyModule {}
