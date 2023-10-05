export interface Pair {
  base: string;
  quote: string;
}

export interface LiquidityData {
  [blockNumber: number]: DataAtBlock;
}

export interface DataAtBlock {
  price: number;
  slippageMap: { [slippageBps: number]: number };
}
