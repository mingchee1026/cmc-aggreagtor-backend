import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  // getCryptoCurrenciesList,
  // getCryptoCurrencies,
  getQuotes,
} from '@root/shared/services/http/get-crypto-currencies';
import { CryptoCurrenciesRO } from './cryptocurrency.interface';
import { MEME_COIN_IDS } from '@root/shared/constants';

@Injectable()
export class CryptocurrencyService {
  constructor(private readonly configService: ConfigService) {}

  async findAll(query): Promise<CryptoCurrenciesRO> {
    const priceChangeWeights = [
      query.price_change_hour_weight || 0.03,
      query.price_change_day_weight || 0.07,
      query.price_change_7_day_weight || 0.1,
      query.price_change_30_day_weight || 0.15,
      query.price_change_60_day_weight || 0.25,
      query.price_change_90_day_weight || 0.4,
    ];

    // console.log(priceChangeWeights);

    const priceThread = query.price_thread || 5;

    const totalPriceWeight = query.total_price_weight || 0.3;
    const totalMarketcapWeight = query.total_marketcap_weight || 0.3;
    const totalVolume24hWeight = query.total_volume24h_weight || 0.3;
    // const totalTurnoverhWeight = query.total_turnover_weight || 0.1;
    const is_audited = query.is_audited || true;

    const symbolStr = query.symbol || '';
    const symbols = symbolStr
      .split(',')
      .map((item) => {
        const [name, value = 0] = item.split('(');
        if (name.trim()) {
          return { name: name.trim(), value: parseFloat(value) };
        }
      })
      .filter((item) => item);

    // const listApiUrl = this.configService.get<string>(
    //   'COIN_MARKET_CAP_LIST_API_URL',
    // );

    const apiUrl = this.configService.get<string>('COIN_MARKET_CAP_API_URL');
    const apiKey = this.configService.get<string>('COIN_MARKET_CAP_API_KEY');

    // const currencies1 = await getCryptoCurrenciesList(listApiUrl);
    // const currencies = await getCryptoCurrencies(apiUrl, apiKey);

    const coinIds = MEME_COIN_IDS.join(',');

    const currencies: Array<any> = await getQuotes(apiUrl, apiKey, coinIds);

    const marketCaps = currencies.map(
      (currency) => currency.quote.USD.market_cap,
    );

    const volume24hs = currencies.map(
      (currency) => currency.quote.USD.volume_24h,
    );

    const currenciesWithStats = await Promise.all(
      currencies.map(async (currency, index) => {
        const scorePrice = await this.getPriceChangeScore(
          currency.quote.USD,
          priceChangeWeights,
          priceThread,
        );
        const scoreMarketCap = await this.getMarketCapScore(marketCaps, index);
        const scoreVolume24h = await this.getMarketCapScore(volume24hs, index);

        // calculate total score
        let scoreTotal =
          (totalPriceWeight * scorePrice +
            totalMarketcapWeight * scoreMarketCap +
            totalVolume24hWeight * scoreVolume24h) * // +
          // totalTurnoverhWeight * currency.quote.USD.turnover) *
          (is_audited ? 1 : 0.9);

        const containsSymbol = symbols.find(
          (item) => item.name === currency.symbol,
        );

        if (containsSymbol) {
          scoreTotal = scoreTotal + Math.abs(scoreTotal) * containsSymbol.value;
        }

        return {
          ...currency,
          scorePrice,
          scoreMarketCap,
          scoreVolume24h,
          scoreTotal,
        };
      }),
    );

    return {
      data: currenciesWithStats.sort((a, b) => b.scoreTotal - a.scoreTotal),
      status: {},
    };
  }

  getPriceChangeScore = async (
    currency: any,
    priceChangeWeights: Array<number>,
    priceThread: number,
  ) => {
    const quotes = [
      currency.percent_change_1h / 100,
      currency.percent_change_24h / 100,
      currency.percent_change_7d / 100,
      currency.percent_change_30d / 100,
      currency.percent_change_60d / 100,
      currency.percent_change_90d / 100,
    ];
    // Calculate the mean
    const mean =
      quotes.reduce((sum, priceChange) => sum + priceChange, 0) / quotes.length;

    // Calculate the variance
    const varianceSum = quotes.reduce(
      (sum, priceChange) => sum + Math.pow(priceChange - mean, 2),
      0,
    );
    const variance = Math.sqrt(varianceSum / quotes.length);

    // Calculate the score
    const priceChangeScore = quotes.reduce(
      (sum, priceChange, index) =>
        sum +
        priceChangeWeights[index] * priceChange * (1 - variance / priceThread),
      0,
    );

    return priceChangeScore;
  };

  getMarketCapScore = async (marketCaps: any, index: number) => {
    // Calculate the mean
    const mean =
      marketCaps.reduce((sum, marketCap) => sum + marketCap, 0) /
      marketCaps.length;

    // Calculate the variance
    const varianceSum = marketCaps.reduce(
      (sum, marketCap) => sum + Math.pow(marketCap - mean, 2),
      0,
    );
    const variance = Math.sqrt(varianceSum / marketCaps.length);

    // Calculate the score
    const marketCapScore = (marketCaps[index] - mean) / variance;

    return marketCapScore;
  };

  getVolume24hScore = async (volume24hs: any, index: number) => {
    // Calculate the mean
    const mean =
      volume24hs.reduce((sum, volume24h) => sum + volume24h, 0) /
      volume24hs.length;

    // Calculate the variance
    const varianceSum = volume24hs.reduce(
      (sum, volume24h) => sum + Math.pow(volume24h - mean, 2),
      0,
    );
    const variance = Math.sqrt(varianceSum / volume24hs.length);

    // Calculate the score
    const volume24hScore = (volume24hs[index] - mean) / variance;

    return volume24hScore;
  };
}
