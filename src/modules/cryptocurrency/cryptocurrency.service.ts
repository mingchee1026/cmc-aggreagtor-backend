import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  getCryptoCurrencies,
  getCryptoCurrenciesList,
} from 'src/shared/services/http/get-crypto-currencies';
import { CryptoCurrenciesRO } from './cryptocurrency.interface';

@Injectable()
export class CryptocurrencyService {
  constructor(private readonly configService: ConfigService) {}

  async findAll(query): Promise<CryptoCurrenciesRO> {
    const listApiUrl = this.configService.get<string>(
      'COIN_MARKET_CAP_LIST_API_URL',
    );
    const apiUrl = this.configService.get<string>('COIN_MARKET_CAP_API_URL');
    const apiKey = this.configService.get<string>('COIN_MARKET_CAP_API_KEY');

    const currencies = await getCryptoCurrenciesList(listApiUrl);
    // const data = await getCryptoCurrencies(apiUrl, apiKey);
    return currencies;
  }
}
