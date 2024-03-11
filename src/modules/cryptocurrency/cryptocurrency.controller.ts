import { Controller, Get, Query } from '@nestjs/common';
import { ApiResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CryptocurrencyService } from './cryptocurrency.service';
import { CryptoCurrenciesRO } from './cryptocurrency.interface';

@ApiTags('cryptocurrencies')
@Controller('cryptocurrencies')
export class CryptocurrencyController {
  constructor(private readonly appService: CryptocurrencyService) {}

  @ApiOperation({ summary: 'Get all crypto currencies' })
  @ApiResponse({ status: 200, description: 'Return all crypto currencies.' })
  @Get()
  async getCryptocurrencies(@Query() query): Promise<CryptoCurrenciesRO> {
    return await this.appService.findAll(query);
  }
}
