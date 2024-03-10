import axios from 'axios';

// import { readConfigOrThrow } from 'src/shared/helper/read-config';

export const getCryptoCurrencies = async (apiUrl: string) => {
  try {
    // const cmcApiUrl = 'https://api.coinmarketcap.com/data-api'; //readConfigOrThrow('COIN_MARKET_CAP_API_URL');
    // console.log(process.env.COIN_MARKET_CAP_API_URL);
    const data = await axios
      .get(
        `${apiUrl}/v3/cryptocurrency/listing?start=1&limit=100&sortBy=market_cap&sortType=desc&convert=USD,BTC,ETH&cryptoType=all&tagType=all&audited=false&aux=ath,atl,high24h,low24h,num_market_pairs,cmc_rank,date_added,tags,platform,max_supply,circulating_supply,self_reported_circulating_supply,self_reported_market_cap,total_supply,volume_7d,volume_30d&tagSlugs=memes`,
      )
      .then((response) => response.data);

    return data;
  } catch (error) {
    console.log(error.message);
    return {};
  }
};
