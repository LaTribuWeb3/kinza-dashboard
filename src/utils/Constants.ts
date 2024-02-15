export const DATA_SOURCES = ['All sources', 'Pancakeswap Stableswaps', 'Pancakeswap v2', 'Pancakeswap v3', 'Wombat'];

export const DATA_SOURCES_MAP = {
  'All sources': 'all',
  'Pancakeswap StableSwaps': 'pancake',
  'Pancakeswap v2': 'pancakeswapv2',
  'Pancakeswap v3': 'pancakeswapv3',
  'Wombat': 'wombat',
};

export const SLIPPAGES_BPS = Array.from({ length: 20 }).map((_v, i) => (i + 1) * 100);

export const KINZA_RISK_PARAMETERS_ARRAY = [
  {
    ltv: 0.98,
    bonus: 800,
    visible: false,
    color: '#2E96FF'
  },
  {
    ltv: 0.965,
    bonus: 800,
    visible: true,
    color: '#B800D8'
  },
  {
    ltv: 0.945,
    bonus: 800,
    visible: true,
    color: '#FFA726'
  },
  
  {
    ltv: 0.915,
    bonus: 800,
    visible: true,
    color: '#EF5350'
  },
  {
    ltv: 0.86,
    bonus: 800,
    visible: true,
    color: '#C91B63'
  },
  {
    ltv: 0.77,
    bonus: 800,
    visible: true,
    color: '#00A3A0'
  },
  {
    ltv: 0.625,
    bonus: 800,
    visible: true,
    color: '#173A5E'
  }
];


export const KINZA_WBETH_RISK_PARAMETERS_ARRAY = [
  {
    ltv: 0.98,
    bonus: 700,
    visible: false,
    color: '#2E96FF'
  },
  {
    ltv: 0.965,
    bonus: 700,
    visible: true,
    color: '#B800D8'
  },
  {
    ltv: 0.945,
    bonus: 700,
    visible: true,
    color: '#FFA726'
  },
  
  {
    ltv: 0.915,
    bonus: 700,
    visible: true,
    color: '#EF5350'
  },
  {
    ltv: 0.86,
    bonus: 700,
    visible: true,
    color: '#C91B63'
  },
  {
    ltv: 0.77,
    bonus: 700,
    visible: true,
    color: '#00A3A0'
  },
  {
    ltv: 0.625,
    bonus: 700,
    visible: true,
    color: '#173A5E'
  }
];
