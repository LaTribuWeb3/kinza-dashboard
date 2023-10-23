export interface Pair {
  base: string;
  quote: string;
}

export interface LiquidityData {
  updated: number; // timestamp ms
  liquidity: { [blockNumber: string]: DataAtBlock };
}

export interface DataAtBlock {
  price: number;
  slippageMap: { [slippageBps: number]: {base: number, quote: number, avgSlippage: number} };
  avgSlippageMap: { [slippageBps: number]: {base: number, quote: number} };
  volatility: number;
}
