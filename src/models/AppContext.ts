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
  pairsByPlatform: {
    [key: string]: Pair[];
  };
  platformsByPair: {
    [key: string]: string[];
  };
  riskParameters: KinzaRiskParameters;
  pages: {
    riskLevels: {
      currentLiquidationThreshold: number;
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
      platformsForPair: string[];
      slippage: number;
    };
  };
}

export interface appContextType {
  appProperties: AppContextProperties;
  setAppProperties: React.Dispatch<React.SetStateAction<AppContextProperties>>;
}
