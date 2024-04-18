import { appContextType } from "../models/AppContext";

export const DATA_SOURCES = ['All sources', 'Pancakeswap StableSwaps', 'Pancakeswap v2', 'Pancakeswap v3', 'Wombat'];

export const DATA_SOURCES_MAP = {
  'All sources': 'all',
  'Pancakeswap StableSwaps': 'pancake',
  'Pancakeswap v2': 'pancakeswapv2',
  'Pancakeswap v3': 'pancakeswapv3',
  Wombat: 'wombat'
};

export const SLIPPAGES_BPS = Array.from({ length: 20 }).map((_v, i) => (i + 1) * 100);

export const initialContext: appContextType = {
  appProperties: {
    chain: 'bsc',
    riskParameter: {
      pair: { base: '', quote: '' },
      ltv: 0,
      bonus: 0,
      visible: true,
      supplyCapInUSD: 0,
      borrowCapInUSD: 0,
      basePrice: 0
    },
    dataSources: {
      current: false,
      pair: { base: '', quote: '' },
      platform: 'all',
      slippage: 0
    }
  },
  setAppProperties: () => {}
};