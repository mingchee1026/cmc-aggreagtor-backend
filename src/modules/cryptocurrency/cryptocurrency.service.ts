import { Injectable } from '@nestjs/common';

@Injectable()
export class CryptocurrencyService {
  getCryptocurrencies(): string {
    return 'Hello World!';
  }
}
