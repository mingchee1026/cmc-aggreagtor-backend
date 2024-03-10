import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { CryptocurrencyService } from './cryptocurrency.service';
import { getCryptoCurrencies } from 'src/shared/services/http/get-crypto-currencies';

@Controller('cryptocurrencies')
@ApiTags('cryptocurrencies')
export class CryptocurrencyController {
  constructor(
    private configService: ConfigService,
    private readonly appService: CryptocurrencyService,
  ) {}

  @Get('/')
  async getCryptocurrencies(): Promise<any> {
    const apiUrl = this.configService.get<string>('COIN_MARKET_CAP_API_URL');
    const data = await getCryptoCurrencies(apiUrl);

    return data;
  }
}
