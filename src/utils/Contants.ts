export const DATA_SOURCES = ['All sources', 'Uniswap v2', 'Uniswap v3', 'Curve', 'Sushiswap v2'];

export const DATA_SOURCES_MAP = {
  'All sources': 'all',
  'Uniswap v2': 'uniswapv2',
  'Uniswap v3': 'uniswapv3',
  Curve: 'curve',
  'Sushiswap v2': 'sushiswapv2'
};

export const SLIPPAGES_BPS = Array.from({ length: 20 }).map((_v, i) => (i + 1) * 100);
