export interface Pair {
  base: string;
  quote: string;
}

export interface LiquidityData {
  [blockNumber: string]: DataAtBlock;
}

export interface DataAtBlock {
  price: number;
  slippageMap: { [slippageBps: number]: number };
  avgSlippageMap: { [slippageBps: number]: number };
}
