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

export default class DataService {
  static async GetOverview(): Promise<OverviewData[]> {
    await sleep(2000);
    // throw new Error('Could not reach data');
    return overviewDummy;
  }
}
