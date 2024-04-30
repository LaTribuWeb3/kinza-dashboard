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
        const overviewData = await DataService.GetOverview(chain);
        const entries = Object.entries(overviewData);
        entries.sort((a, b) => b[1].riskLevel - a[1].riskLevel);
        const sortedOverviewData: OverviewData = entries.reduce((acc, [symbol, data]) => {
          acc[symbol] = data;
          return acc;
        }, {} as OverviewData);
        setAppProperties({ ...appProperties, overviewData: sortedOverviewData });
        console.log('sortedOverviewData', sortedOverviewData);
        console.log('appPropertiesFromOverview', appProperties);

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
        setAppProperties({ ...appProperties, riskParameters: kinzaRiskParameters });
        const data = [];
        for (const symbol of Object.keys(overviewData)) {
          for (const subMarket of overviewData[symbol].subMarkets) {
            data.push({ base: symbol, quote: subMarket.quote });
          }
        }
        const availablePairs = {
          chain: [] as Pair[]
        };
        availablePairs.chain = data.sort((a, b) => a.base.localeCompare(b.base));
        setAppProperties({ ...appProperties, availablePairs });
        const navPair = pathName.split('/')[2]
          ? { base: pathName.split('/')[2].split('-')[0], quote: pathName.split('/')[2].split('-')[1] }
          : undefined;
        if (navPair && data.some((_) => _.base == navPair.base && _.quote == navPair.quote)) {
          setAppProperties({
            ...appProperties,
            pages: {
              ...appProperties.pages,
              riskLevels: { ...appProperties.pages.riskLevels, selectedPair: navPair },
              dataSources: { ...appProperties.pages.dataSources, pair: navPair }
            }
          });
        } else if (data.length > 0) {
          setAppProperties({
            ...appProperties,
            pages: {
              ...appProperties.pages,
              riskLevels: { ...appProperties.pages.riskLevels, selectedPair: data[0] },
              dataSources: { ...appProperties.pages.dataSources, pair: data[0] }
            }
          });
        }
        const pairSet = navPair ? navPair : data[0];
        console.log('pairSet', pairSet);
        setAppProperties({
          ...appProperties,
          pages: {
            ...appProperties.pages,
            riskLevels: {
              ...appProperties.pages.riskLevels,
              selectedRiskParameter: kinzaRiskParameters[pairSet.base][pairSet.quote]
            }
          }
        });
        const capUSDToSet = Math.max(
          1,
          Math.min(
            kinzaRiskParameters[pairSet.base][pairSet.quote].supplyCapInUSD,
            kinzaRiskParameters[pairSet.base][pairSet.quote].borrowCapInUSD
          )
        );
        setAppProperties({
          ...appProperties,
          pages: { ...appProperties.pages, riskLevels: { ...appProperties.pages.riskLevels, capUSD: capUSDToSet } }
        });
        const capInKindToSet = capUSDToSet / kinzaRiskParameters[pairSet.base][pairSet.quote].basePrice;
        setAppProperties({
          ...appProperties,
          pages: {
            ...appProperties.pages,
            riskLevels: { ...appProperties.pages.riskLevels, capInKind: capInKindToSet }
          }
        });
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
