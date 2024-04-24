import { Pair } from './ApiData';

export interface KinzaRiskParameters {
  [symbol: string]: {
    [quote: string]: KinzaRiskParameter;
  };
}

export interface KinzaRiskParameter {
  pair: Pair;
  ltv: number;
  liquidationThreshold: number;
  bonus: number;
  visible: true;
  supplyCapInUSD: number;
  borrowCapInUSD: number;
  basePrice: number;
}
