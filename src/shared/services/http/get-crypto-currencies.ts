import axios from 'axios';

// import { readConfigOrThrow } from 'src/shared/helper/read-config';

export const getCryptoCurrenciesList = async (apiUrl: string) => {
  try {
    const data = await axios
      .get(`${apiUrl}/v3/cryptocurrency/listing`, {
        params: {
          start: 1,
          limit: 10,
          sortBy: 'market_cap', // market_cap, circulating_supply, price, volume_24h
          sortType: 'desc',
          convert: 'USD,BTC,ETH',
          cryptoType: 'all',
          tagType: 'all',
          //   audited: false,
          //   'ath,atl,high24h,low24h,num_market_pairs,cmc_rank,date_added,tags,platform,max_supply,circulating_supply,self_reported_circulating_supply,self_reported_market_cap,total_supply,volume_7d,volume_30d',
          tagSlugs: 'memes',
        },
      })
      .then((response) => response.data);

    return data;
  } catch (error) {
    console.log(error.message);
    return {};
  }
};

export const getCryptoCurrencies = async (apiUrl: string, apiKey: string) => {
  try {
    const data = await axios
      .get(`${apiUrl}/v1/cryptocurrency/listings/latest`, {
        headers: {
          'X-CMC_PRO_API_KEY': apiKey,
        },
        params: {
          start: 1,
          limit: 10,
          sort: 'market_cap',
          sort_dir: 'desc',
          convert: 'USD',
          cryptocurrency_type: 'all',
          tag: 'all',
        },
      })
      .then((response) => response.data);

    return data;
  } catch (error) {
    console.log(error.message);
    return {};
  }
};
