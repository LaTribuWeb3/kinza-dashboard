import axios, { AxiosResponse } from 'axios';
import { LiquidityData, Pair } from '../models/ApiData';
import { OverviewData } from '../models/OverviewData';
import { sleep } from '../utils/Utils';

const overviewDummy: OverviewData[] = [
  {
    dataSourceName: 'Uniswap V2',
    lastBlockFetched: 19_000_000,
    lastRunTimestampMs: Date.now(),
    poolsFetched: [
      {
        address: '0x1234597',
        tokens: ['WETH', 'USDC'],
        label: ''
      },
      {
        address: '0x1234597',
        tokens: ['WBTC', 'USDT'],
        label: ''
      }
    ]
  },
  {
    dataSourceName: 'Curve',
    lastBlockFetched: 19_000_000,
    lastRunTimestampMs: Date.now(),
    poolsFetched: [
      {
        address: '0x1234597',
        tokens: ['sUSD', 'USDC', 'DAI', 'USDT'],
        label: 'sUSD pool'
      },
      {
        address: '0x1234597',
        tokens: ['USDT', 'WETH', 'WBTC'],
        label: 'Tricrypto2'
      }
    ]
  },
  {
    dataSourceName: 'Uniswap V3',
    lastBlockFetched: 19_100_000,
    lastRunTimestampMs: Date.now(),
    poolsFetched: [
      {
        address: '0x1234597',
        tokens: ['wstETH', 'WETH'],
        label: 'wstETH-WETH 0.1% fee'
      },
      {
        address: '0x1234597',
        tokens: ['wstETH', 'WETH'],
        label: 'wstETH-WETH 0.3% fee'
      },
      {
        address: '0x1234597',
        tokens: ['wstETH', 'WETH'],
        label: 'wstETH-WETH 1% fee'
      },
      {
        address: '0x1234597',
        tokens: ['wstETH', 'WETH'],
        label: 'wstETH-WETH 0.1% fee'
      },
      {
        address: '0x1234597',
        tokens: ['wstETH', 'WETH'],
        label: 'wstETH-WETH 0.3% fee'
      },
      {
        address: '0x1234597',
        tokens: ['wstETH', 'WETH'],
        label: 'wstETH-WETH 1% fee'
      },
      {
        address: '0x1234597',
        tokens: ['wstETH', 'WETH'],
        label: 'wstETH-WETH 0.1% fee'
      },
      {
        address: '0x1234597',
        tokens: ['wstETH', 'WETH'],
        label: 'wstETH-WETH 0.3% fee'
      },
      {
        address: '0x1234597',
        tokens: ['wstETH', 'WETH'],
        label: 'wstETH-WETH 1% fee'
      },
      {
        address: '0x1234597',
        tokens: ['wstETH', 'WETH'],
        label: 'wstETH-WETH 0.1% fee'
      },
      {
        address: '0x1234597',
        tokens: ['wstETH', 'WETH'],
        label: 'wstETH-WETH 0.3% fee'
      },
      {
        address: '0x1234597',
        tokens: ['wstETH', 'WETH'],
        label: 'wstETH-WETH 1% fee'
      },
      {
        address: '0x1234597',
        tokens: ['wstETH', 'WETH'],
        label: 'wstETH-WETH 0.1% fee'
      },
      {
        address: '0x1234597',
        tokens: ['wstETH', 'WETH'],
        label: 'wstETH-WETH 0.3% fee'
      },
      {
        address: '0x1234597',
        tokens: ['wstETH', 'WETH'],
        label: 'wstETH-WETH 1% fee'
      },
      {
        address: '0x1234597',
        tokens: ['wstETH', 'WETH'],
        label: 'wstETH-WETH 0.1% fee'
      },
      {
        address: '0x1234597',
        tokens: ['wstETH', 'WETH'],
        label: 'wstETH-WETH 0.3% fee'
      },
      {
        address: '0x1234597',
        tokens: ['wstETH', 'WETH'],
        label: 'wstETH-WETH 1% fee'
      },
      {
        address: '0x1234597',
        tokens: ['wstETH', 'WETH'],
        label: 'wstETH-WETH 0.1% fee'
      },
      {
        address: '0x1234597',
        tokens: ['wstETH', 'WETH'],
        label: 'wstETH-WETH 0.3% fee'
      },
      {
        address: '0x1234597',
        tokens: ['wstETH', 'WETH'],
        label: 'wstETH-WETH 1% fee'
      },
      {
        address: '0x1234597',
        tokens: ['wstETH', 'WETH'],
        label: 'wstETH-WETH 0.1% fee'
      },
      {
        address: '0x1234597',
        tokens: ['wstETH', 'WETH'],
        label: 'wstETH-WETH 0.3% fee'
      },
      {
        address: '0x1234597',
        tokens: ['wstETH', 'WETH'],
        label: 'wstETH-WETH 1% fee'
      },
      {
        address: '0x1234597',
        tokens: ['wstETH', 'WETH'],
        label: 'wstETH-WETH 0.1% fee'
      },
      {
        address: '0x1234597',
        tokens: ['wstETH', 'WETH'],
        label: 'wstETH-WETH 0.3% fee'
      },
      {
        address: '0x1234597',
        tokens: ['wstETH', 'WETH'],
        label: 'wstETH-WETH 1% fee'
      },
      {
        address: '0x1234597',
        tokens: ['wstETH', 'WETH'],
        label: 'wstETH-WETH 0.1% fee'
      },
      {
        address: '0x1234597',
        tokens: ['wstETH', 'WETH'],
        label: 'wstETH-WETH 0.3% fee'
      },
      {
        address: '0x1234597',
        tokens: ['wstETH', 'WETH'],
        label: 'wstETH-WETH 1% fee'
      },
      {
        address: '0x1234597',
        tokens: ['wstETH', 'WETH'],
        label: 'wstETH-WETH 0.1% fee'
      },
      {
        address: '0x1234597',
        tokens: ['wstETH', 'WETH'],
        label: 'wstETH-WETH 0.3% fee'
      },
      {
        address: '0x1234597',
        tokens: ['wstETH', 'WETH'],
        label: 'wstETH-WETH 1% fee'
      }
    ]
  },
  {
    dataSourceName: 'Sushiswap V2',
    lastBlockFetched: 19_100_000,
    lastRunTimestampMs: Date.now(),
    poolsFetched: [
      {
        address: '0x1234597',
        tokens: ['WETH', 'USDC'],
        label: ''
      },
      {
        address: '0x1234597',
        tokens: ['WBTC', 'USDT'],
        label: ''
      }
    ]
  }
];

const apiUrl: string = import.meta.env.VITE_API_URL as string;
export default class DataService {
  static async GetOverview(): Promise<OverviewData[]> {
    await sleep(2000);
    // throw new Error('Could not reach data');
    return overviewDummy;
  }

  static async GetAvailablePairs(platform: string): Promise<Pair[]> {
    console.log(`getting available pairs for ${platform}`);
    await sleep(2000); // add sleep to simulate waiting
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
  }

  static async GetLiquidityData(platform: string, base: string, quote: string): Promise<LiquidityData> {
    console.log(`getting liquidity data for for ${platform} ${base} ${quote}`);
    await sleep(2000); // add sleep to simulate waiting
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
        throw new Error(`Error fetching data on ${fullUrl}: ${error.message}`);
      } else {
        console.error('unexpected error: ', error);
        throw new Error(`Error fetching data on ${fullUrl}`);
      }
    }
  }
}
