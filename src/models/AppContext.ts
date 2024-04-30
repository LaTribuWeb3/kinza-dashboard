import { Pair } from './ApiData';
import { OverviewData } from './OverviewData';
import { KinzaRiskParameter, KinzaRiskParameters } from './RiskData';

export interface AppContextProperties {
  chain: string;
  overviewData: OverviewData;
  loading: boolean;
  availablePairs: {
    [key: string]: Pair[];
  };
  riskParameters: KinzaRiskParameters;
  pages: {
    riskLevels: {
      selectedPair: Pair;
      selectedRiskParameter: KinzaRiskParameter;
      capUSD: number;
      capInKind: number;
      tokenPrice: number;
    };
    dataSources: {
      current: boolean;
      pair: Pair;
      platform: string;
      slippage: number;
    };
  };
}

export interface appContextType {
  appProperties: AppContextProperties;
  setAppProperties: React.Dispatch<React.SetStateAction<AppContextProperties>>;
}
