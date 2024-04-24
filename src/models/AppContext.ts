import { Pair } from './ApiData';
import { KinzaRiskParameter } from './RiskData';

export interface AppContextProperties {
  chain: string;
  availablePairs?: {
    [key: string]: Pair[];
  };
  riskParameter: KinzaRiskParameter;
  dataSources: {
    current: boolean;
    pair: Pair;
    platform: string;
    slippage: number;
  };
}

export interface appContextType {
  appProperties: AppContextProperties;
  setAppProperties: React.Dispatch<React.SetStateAction<AppContextProperties>>;
}
