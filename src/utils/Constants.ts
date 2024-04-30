import { appContextType } from '../models/AppContext';

export const BSC_DATA_SOURCES = [
  'All sources',
  'Pancakeswap StableSwaps',
  'Pancakeswap v2',
  'Pancakeswap v3',
  'Wombat',
  'Curve'
];
//trigger new build
export const BSC_DATA_SOURCES_MAP = {
  'All sources': 'all',
  'Pancakeswap StableSwaps': 'pancake',
  'Pancakeswap v2': 'pancakeswapv2',
  'Pancakeswap v3': 'pancakeswapv3',
  Wombat: 'wombat',
  Curve: 'curve'
};
export const ETH_DATA_SOURCES = ['All sources', 'Uniswap v2', 'Uniswap v3', 'Sushiswap v2', 'Curve', 'Balancer'];

export const ETH_DATA_SOURCES_MAP = {
  'All sources': 'all',
  'Uniswap v2': 'uniswapv2',
  'Uniswap v3': 'uniswapv3',
  'Sushiswap v2': 'sushiswapv2',
  Curve: 'curve',
  Balancer: 'balancer'
};
export const OPBNB_DATA_SOURCES = ['All sources', 'Pancakeswap v3'];

export const OPBNB_DATA_SOURCES_MAP = {
  'All sources': 'all',
  'Pancakeswap v3': 'pancakeswapv3'
};

export const SLIPPAGES_BPS = Array.from({ length: 20 }).map((_v, i) => (i + 1) * 100);

export const initialContext: appContextType = {
  appProperties: {
    chain: 'bsc',
    overviewData: {},
    loading: true,
    availablePairs: {},
    pairsByPlatform: {},
    riskParameters: {},
    pages: {
      riskLevels: {
        selectedPair: { base: '', quote: '' },
        selectedRiskParameter: {
          pair: { base: '', quote: '' },
          ltv: 0,
          liquidationThreshold: 0,
          bonus: 0,
          visible: true,
          supplyCapInUSD: 0,
          borrowCapInUSD: 0,
          basePrice: 0
        },
        capUSD: 0,
        capInKind: 0,
        tokenPrice: 0
      },
      dataSources: {
        current: false,
        pair: { base: '', quote: '' },
        platform: 'all',
        platformsForPair: [],
        slippage: 0
      }
    }
  },
  setAppProperties: () => {}
};
