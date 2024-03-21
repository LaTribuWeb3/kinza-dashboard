import { Pair } from './ApiData';
import { KinzaRiskParameter } from './RiskData';

export interface AppContextProperties {
  riskParameter: KinzaRiskParameter;
  dataSources: {
    current: boolean;
    pair: Pair;
    source: string;
    slippage: number;
  };
}
