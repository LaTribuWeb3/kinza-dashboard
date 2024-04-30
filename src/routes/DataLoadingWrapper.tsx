import { Box } from '@mui/material';
import { Overview } from './overview/Overview';
import { Outlet, useLocation } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import DataService from '../services/DataService';
import { AppContext } from './App';
import { OverviewData } from '../models/OverviewData';
import { KinzaRiskParameters } from '../models/RiskData';
import { Pair } from '../models/ApiData';
import { sleep } from '../utils/Utils';
import {
  BSC_DATA_SOURCES,
  BSC_DATA_SOURCES_MAP,
  ETH_DATA_SOURCES,
  ETH_DATA_SOURCES_MAP,
  OPBNB_DATA_SOURCES,
  OPBNB_DATA_SOURCES_MAP,
  initialContext
} from '../utils/Constants';

export default function DataLoadingWrapper() {
  const pathName = useLocation().pathname;
  const { appProperties, setAppProperties } = useContext(AppContext);
  const chain = appProperties.chain;

  function setLoadingDone() {
    setAppProperties({ ...appProperties, loading: false });
  }
  useEffect(() => {
    async function fetchData() {
      try {
        // loading overview data
        const updatedOverviewData = initialContext.appProperties;
        updatedOverviewData.chain = chain;
        const overviewData = await DataService.GetOverview(chain);
        const entries = Object.entries(overviewData);
        entries.sort((a, b) => b[1].riskLevel - a[1].riskLevel);
        const sortedOverviewData: OverviewData = entries.reduce((acc, [symbol, data]) => {
          acc[symbol] = data;
          return acc;
        }, {} as OverviewData);
        updatedOverviewData.overviewData = sortedOverviewData;

        // loading risk levels data
        const kinzaRiskParameters = {} as KinzaRiskParameters;
        Object.keys(overviewData).forEach((symbol) => {
          const riskLevelData = overviewData[symbol];
          kinzaRiskParameters[symbol] = {};
          riskLevelData.subMarkets.forEach((subMarket) => {
            // Ensure the subMarket's quote does not already exist for robustness
            if (!kinzaRiskParameters[symbol][subMarket.quote]) {
              kinzaRiskParameters[symbol][subMarket.quote] = {
                pair: { base: symbol, quote: subMarket.quote },
                ltv: subMarket.LTV,
                liquidationThreshold: subMarket.liquidationThreshold,
                bonus: subMarket.liquidationBonus,
                visible: true, // Set all to true as per instruction
                supplyCapInUSD: subMarket.supplyCapUsd,
                borrowCapInUSD: subMarket.borrowCapUsd,
                basePrice: subMarket.basePrice
              };
            }
          });
        });
        updatedOverviewData.riskParameters = kinzaRiskParameters;
        const data = [];
        for (const symbol of Object.keys(overviewData)) {
          for (const subMarket of overviewData[symbol].subMarkets) {
            data.push({ base: symbol, quote: subMarket.quote });
          }
        }
        if (chain) {
          updatedOverviewData.availablePairs[chain] = data.sort((a, b) => a.base.localeCompare(b.base));
        }
        console.log({ updatedOverviewData });
        const navPair = pathName.split('/')[2]
          ? { base: pathName.split('/')[2].split('-')[0], quote: pathName.split('/')[2].split('-')[1] }
          : undefined;
        let pairSet = {} as Pair;
        if (navPair && data.some((_) => _.base == navPair.base && _.quote == navPair.quote)) {
          pairSet = navPair;
        } else if (data.length > 0) {
          pairSet = data[0];
        }
        updatedOverviewData.pages.riskLevels.selectedPair = pairSet;
        updatedOverviewData.pages.riskLevels.selectedRiskParameter = kinzaRiskParameters[pairSet.base][pairSet.quote];
        updatedOverviewData.pages.riskLevels.currentLiquidationThreshold =
          kinzaRiskParameters[pairSet.base][pairSet.quote].liquidationThreshold * 100;
        const capUSDToSet = Math.max(
          1,
          Math.min(
            kinzaRiskParameters[pairSet.base][pairSet.quote].supplyCapInUSD,
            kinzaRiskParameters[pairSet.base][pairSet.quote].borrowCapInUSD
          )
        );
        updatedOverviewData.pages.riskLevels.capUSD = capUSDToSet;
        const capInKindToSet = capUSDToSet / kinzaRiskParameters[pairSet.base][pairSet.quote].basePrice;
        updatedOverviewData.pages.riskLevels.capInKind = capInKindToSet;
        updatedOverviewData.pages.riskLevels.tokenPrice = kinzaRiskParameters[pairSet.base][pairSet.quote].basePrice;

        /// loading data sources data
        updatedOverviewData.pages.dataSources.pair = pairSet;
        const DATA_SOURCES_MAP =
          chain === 'bsc' ? BSC_DATA_SOURCES_MAP : chain === 'opbnb' ? OPBNB_DATA_SOURCES_MAP : ETH_DATA_SOURCES_MAP;
        for (const platform of Object.values(DATA_SOURCES_MAP)) {
          const pairs = await DataService.GetAvailablePairs(platform, chain);
          updatedOverviewData.pairsByPlatform[platform] = pairs;
        }

        const platformsForPairs: { [key: string]: string[] } = {};
        for (const pair of data) {
          const platformsAvailable = [];
          if (updatedOverviewData.pairsByPlatform) {
            for (const [platform, pairs] of Object.entries(updatedOverviewData.pairsByPlatform)) {
              // Check if the pair exists in the current platform's list
              const pairExists = pairs.some((pair_) => pair_.base === pair.base && pair_.quote === pair.quote);

              // If the pair exists, add the platform to the list
              if (pairExists) {
                platformsAvailable.push(platform);
              }
            }
          }
          platformsForPairs[`${pair.base}/${pair.quote}`] = platformsAvailable;
        }
        updatedOverviewData.platformsByPair = platformsForPairs;

        setAppProperties(updatedOverviewData);
        await sleep(1); // without this sleep, update the graph before changing the selected pair. so let it here
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error instanceof Error) {
          console.log('Error fetching data:', error.toString());
        } else {
          console.log('Unknown error');
        }
      }
    }
    fetchData().then(setLoadingDone).catch(console.error);
  }, [chain]);

  return (
    <Box
      component="main"
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
        flexGrow: 1,
        height: '100vh',
        width: '100vw',
        overflow: 'auto',
        direction: 'row'
      }}
    >
      <Box sx={{ mt: 8, ml: 1.5 }}>
        {pathName === '/' && <Overview />}
        <Outlet />
      </Box>
    </Box>
  );
}
