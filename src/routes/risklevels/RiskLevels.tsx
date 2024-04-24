import { Box, Grid, InputAdornment, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import DataService from '../../services/DataService';
import { Pair } from '../../models/ApiData';
import { FriendlyFormatNumber, sleep } from '../../utils/Utils';
import { SimpleAlert } from '../../components/SimpleAlert';
import { RiskLevelGraphs, RiskLevelGraphsSkeleton } from './RiskLevelGraph';
import { KinzaRiskParameter, KinzaRiskParameters } from '../../models/RiskData';
import { useLocation } from 'react-router-dom';
import { AppContext } from '../App';

export default function RiskLevels() {
  const [isLoading, setIsLoading] = useState(true);
  const [availablePairs, setAvailablePairs] = useState<Pair[]>([]);
  const [selectedPair, setSelectedPair] = useState<Pair>();
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [capUSD, setCapUSD] = useState<number>(0);
  const [capInKind, setCapInKind] = useState<number | undefined>(undefined);
  const [tokenPrice, setTokenPrice] = useState<number | undefined>(undefined);
  const [parameters, setParameters] = useState<KinzaRiskParameters | undefined>(undefined);
  const [riskParameter, setRiskParameter] = useState<KinzaRiskParameter | undefined>(undefined);
  const [liquidationThreshold, setLiquidationThreshold] = useState<number | undefined>(undefined);
  const { appProperties, setAppProperties } = useContext(AppContext);
  const chain = appProperties.chain;
  const pathName = useLocation().pathname;

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };
  const handleChangePair = (event: SelectChangeEvent) => {
    const base = event.target.value.split('/')[0];
    const quote = event.target.value.split('/')[1];
    setAppProperties({
      ...appProperties,
      riskParameter: { ...appProperties.riskParameter, pair: { base: base, quote: quote } }
    });
    setSelectedPair({ base: base, quote: quote });
    if (parameters) {
      setRiskParameter(parameters[base][quote]);
      const updatedAppProperties = parameters[base][quote];
      updatedAppProperties.pair = { base: base, quote: quote };
      setAppProperties({ ...appProperties, riskParameter: updatedAppProperties });
    }
  };
  const handleChangeCap = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target && event.target.value && tokenPrice) {
      setCapInKind(Number(event.target.value));
      setCapUSD(Number(event.target.value) * tokenPrice);
      setAppProperties({
        ...appProperties,
        riskParameter: {
          ...appProperties.riskParameter,
          basePrice: tokenPrice,
          supplyCapInUSD: Number(event.target.value) * tokenPrice
        }
      });
    }
  };

  const handleChangeLT = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target && event.target.value) {
      const newLT = Number(event.target.value);
      if (newLT >= 1 && newLT < 100 - riskParameter!.bonus * 100) {
        setLiquidationThreshold(newLT);
        setAppProperties({
          ...appProperties,
          riskParameter: { ...appProperties.riskParameter, liquidationThreshold: newLT / 100 }
        });
      }
    }
  };

  //// useEffect to load data
  useEffect(() => {
    setIsLoading(true);
    // Define an asynchronous function
    async function fetchData() {
      try {
        const overviewData = await DataService.GetOverview(chain);
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
        setParameters(kinzaRiskParameters);
        const data = [];
        for (const symbol of Object.keys(overviewData)) {
          for (const subMarket of overviewData[symbol].subMarkets) {
            data.push({ base: symbol, quote: subMarket.quote });
          }
        }
        setAvailablePairs(data.sort((a, b) => a.base.localeCompare(b.base)));
        const navPair = pathName.split('/')[2]
          ? { base: pathName.split('/')[2].split('-')[0], quote: pathName.split('/')[2].split('-')[1] }
          : undefined;
        if (navPair && data.some((_) => _.base == navPair.base && _.quote == navPair.quote)) {
          setSelectedPair(navPair);
          setAppProperties({ ...appProperties, riskParameter: { ...appProperties.riskParameter, pair: navPair } });
        } else if (appProperties.riskParameter.pair.base && appProperties.riskParameter.pair.quote) {
          setSelectedPair(appProperties.riskParameter.pair);
        } else if (data.length > 0) {
          setSelectedPair(data[0]);
        }
        const pairSet = navPair ? navPair : data[0];
        setRiskParameter(kinzaRiskParameters[pairSet.base][pairSet.quote]);
        setLiquidationThreshold(kinzaRiskParameters[pairSet.base][pairSet.quote].liquidationThreshold * 100);
        const capUSDToSet = Math.max(
          1,
          Math.min(
            kinzaRiskParameters[pairSet.base][pairSet.quote].supplyCapInUSD,
            kinzaRiskParameters[pairSet.base][pairSet.quote].borrowCapInUSD
          )
        );
        setCapUSD(capUSDToSet);
        const capInKindToSet = capUSDToSet / kinzaRiskParameters[pairSet.base][pairSet.quote].basePrice;
        setCapInKind(capInKindToSet);
        await sleep(1); // without this sleep, update the graph before changing the selected pair. so let it here
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
        if (error instanceof Error) {
          setAlertMsg(`Error fetching data: ${error.toString()}`);
        } else {
          setAlertMsg(`Unknown error`);
        }
      }
    }
    fetchData()
      .then(() => setIsLoading(false))
      .catch(console.error);
  }, [chain]);

  useEffect(() => {
    setIsLoading(true);
    async function getTokenPrice() {
      try {
        if (!selectedPair) {
          return;
        }
        const data = await DataService.GetLiquidityData('all', selectedPair.base, selectedPair.quote, chain);
        /// get token price
        const liquidityObjectToArray = Object.keys(data.liquidity).map((_) => parseInt(_));
        const maxBlock = liquidityObjectToArray.at(-1)!.toString();
        const tokenPrice = data.liquidity[maxBlock].priceMedian;

        if (selectedPair && capInKind && tokenPrice && parameters) {
          const capUSDToSet = Math.max(
            1,
            Math.min(
              parameters[selectedPair.base][selectedPair.quote].supplyCapInUSD,
              parameters[selectedPair.base][selectedPair.quote].borrowCapInUSD
            )
          );
          setCapUSD(capUSDToSet);

          const capInKindToSet = capUSDToSet / parameters[selectedPair.base][selectedPair.quote].basePrice;
          setTokenPrice(parameters[selectedPair.base][selectedPair.quote].basePrice);

          setCapInKind(Number(capInKindToSet.toFixed(2)));
          await sleep(1); // without this sleep, update the graph before changing the selected pair. so let it here
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setOpenAlert(true);
        setIsLoading(false);
        if (error instanceof Error) {
          setAlertMsg(`Error fetching data: ${error.toString()}`);
        } else {
          setAlertMsg(`Unknown error`);
        }
      }
    }
    getTokenPrice()
      .then(() => setIsLoading(false))
      .catch(console.error);
  }, [selectedPair]);

  if (!selectedPair || !tokenPrice || capInKind == undefined || isLoading) {
    return <RiskLevelGraphsSkeleton />;
  }
  return (
    <Box sx={{ mt: 10 }}>
      {isLoading || !riskParameter || !liquidationThreshold ? (
        <RiskLevelGraphsSkeleton />
      ) : (
        <Grid container spacing={1} alignItems="baseline" justifyContent="center">
          {/* First row: pairs select and slippage select */}
          <Grid item xs={8} sm={6} md={4} lg={3} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Typography textAlign={'right'}>Pair: </Typography>
            <Select
              sx={{ width: '95%' }}
              labelId="pair-select"
              id="pair-select"
              value={`${selectedPair.base}/${selectedPair.quote}`}
              label="Pair"
              onChange={handleChangePair}
            >
              {availablePairs.map((pair, index) => (
                <MenuItem key={index} value={`${pair.base}/${pair.quote}`}>
                  {`${pair.base}/${pair.quote}`}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={0} lg={1} sx={{ marginTop: '20px' }} />
          <Grid item xs={8} sm={6} md={4} lg={3} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Typography textAlign={'right'}>liquidationThreshold: </Typography>
            <TextField
              sx={{
                width: '95%',
                '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                  display: 'none'
                },
                '& input[type=number]': {
                  MozAppearance: 'textfield'
                }
              }}
              required
              id="lt-input"
              type="number"
              label={`Must be < ${100 - riskParameter.bonus * 100}%`}
              onChange={handleChangeLT}
              value={liquidationThreshold}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>
              }}
            />
          </Grid>
          <Grid item xs={0} lg={1} sx={{ marginTop: '20px' }} />
          <Grid item xs={8} sm={6} md={4} lg={3} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Typography textAlign={'right'}>Cap: </Typography>
            <TextField
              sx={{
                '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                  display: 'none'
                },
                '& input[type=number]': {
                  MozAppearance: 'textfield'
                }
              }}
              required
              id="supply-cap-input"
              type="number"
              label={selectedPair.base}
              value={capInKind}
              onChange={handleChangeCap}
            />
            <Typography sx={{ ml: '10px' }}>${FriendlyFormatNumber(capUSD)}</Typography>
          </Grid>
          <Grid item xs={12} lg={12}>
            <RiskLevelGraphs
              pair={selectedPair}
              parameters={riskParameter}
              liquidationThreshold={liquidationThreshold / 100}
              supplyCap={capInKind}
              platform={'all'}
              chain={chain}
            />
          </Grid>
        </Grid>
      )}

      <SimpleAlert alertMsg={alertMsg} handleCloseAlert={handleCloseAlert} openAlert={openAlert} />
    </Box>
  );
}
