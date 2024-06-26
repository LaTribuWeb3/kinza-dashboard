import axios, { AxiosResponse } from 'axios';
import { LiquidityData, Pair } from '../models/ApiData';
import { LastUpdateData } from '../models/LastUpdateData';
import SimpleCacheService from './CacheService';
import { OverviewData } from '../models/OverviewData';
import { getChainAPIUrl } from '../utils/Utils';

export default class DataService {
  static async GetLastUpdate(chain: string): Promise<LastUpdateData[]> {
    const apiUrl = getChainAPIUrl(chain);
    const lastUpdateData = await SimpleCacheService.GetAndCache(
      `GetLastUpdate-${chain}`,
      async () => {
        // await sleep(500); // add sleep to simulate waiting
        const fullUrl = apiUrl + `/api/dashboard/overview`;
        try {
          const response: AxiosResponse<LastUpdateData[]> = await axios.get(fullUrl);
          console.log(`found ${response.data.length} last update data`);
          return response.data;
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error('error message: ', error.message);
            throw new Error(`Error fetching data on ${fullUrl}: ${error.message}`);
          } else {
            console.error('unexpected error: ', error);
            throw new Error(`Error fetching data on ${fullUrl}`);
          }
        }
      },
      600 * 1000
    );

    // throw new Error('Could not reach data');
    return lastUpdateData;
  }

  static async GetOverview(chain: string): Promise<OverviewData> {
    const apiUrl = getChainAPIUrl(chain);
    const overviewData = await SimpleCacheService.GetAndCache(
      `GetOverview-${chain}`,
      async () => {
        // await sleep(500); // add sleep to simulate waiting
        const fullUrl = apiUrl + `/api/dashboard/kinza-overview`;
        try {
          const response: AxiosResponse<OverviewData> = await axios.get(fullUrl);
          console.log(`found ${Object.keys(response.data).length} overview data`);
          return response.data;
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error('error message: ', error.message);
            throw new Error(`Error fetching data on ${fullUrl}: ${error.message}`);
          } else {
            console.error('unexpected error: ', error);
            throw new Error(`Error fetching data on ${fullUrl}`);
          }
        }
      },
      600 * 1000
    );

    // throw new Error('Could not reach data');
    return overviewData;
  }

  static async GetAvailablePairs(platform: string, chain: string): Promise<Pair[]> {
    const apiUrl = getChainAPIUrl(chain);
    console.log(`getting available pairs for ${platform} on ${chain} chain`);
    const pairLoadingFunction = async () => {
      // await sleep(500); // add sleep to simulate waiting
      const fullUrl = apiUrl + `/api/dashboard/available/${platform}`;
      try {
        const response: AxiosResponse<Pair[]> = await axios.get(fullUrl);
        console.log(`found ${response.data.length} available pairs`);
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('error message: ', error.message);
          throw new Error(`Error fetching data on ${fullUrl}: ${error.message}`);
        } else {
          console.error('unexpected error: ', error);
          throw new Error(`Error fetching data on ${fullUrl}`);
        }
      }
    };

    const availablePairs = await SimpleCacheService.GetAndCache(
      `GetAvailablePairs-${platform}-${chain}`,
      pairLoadingFunction,
      600 * 1000
    );

    return availablePairs;
  }

  static async GetLiquidityData(platform: string, base: string, quote: string, chain: string): Promise<LiquidityData> {
    const apiUrl = getChainAPIUrl(chain);
    console.log(`getting liquidity data for for ${platform} ${base} ${quote} on ${chain} chain`);

    const liquidityDataLoadingFunction = async () => {
      // await sleep(1000); // add sleep to simulate waiting
      const fullUrl = apiUrl + `/api/dashboard/${platform}/${base}/${quote}`;
      try {
        const response: AxiosResponse<LiquidityData> = await axios.get(fullUrl);
        console.log(
          `found ${Object.keys(response.data).length} block data for pair ${base} ${quote} on platform ${platform}`
        );

        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('error message: ', error.message);
          const apiErrorMessage = Object.values(error.response?.data as object);
          if (apiErrorMessage.length > 0) {
            const errorMessage = apiErrorMessage[0] as string;
            if (errorMessage.includes('Could not find data for') && errorMessage.includes(platform.toLowerCase())) {
              throw new Error('No data available for this pair on this platform.');
            }
          }
          throw new Error(`Error fetching data on ${fullUrl}`);
        } else {
          console.error('unexpected error: ', error);
          throw new Error(`Error fetching data on ${fullUrl}`);
        }
      }
    };

    const liquidityData = await SimpleCacheService.GetAndCache(
      `GetLiquidityData-${platform}-${base}-${quote}-${chain}`,
      liquidityDataLoadingFunction,
      600 * 1000
    );

    return liquidityData;
  }
}
