import { Box, Grid, InputAdornment, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { FriendlyFormatNumber } from '../../utils/Utils';
import { RiskLevelGraphs, RiskLevelGraphsSkeleton } from './RiskLevelGraph';
import { AppContext } from '../App';
import { useLocation } from 'react-router-dom';
import { Pair } from '../../models/ApiData';

export default function RiskLevels() {
  const { appProperties, setAppProperties } = useContext(AppContext);
  const isLoading = appProperties.loading;
  const riskParameters = appProperties.riskParameters;
  const chain = appProperties.chain;
  const availablePairs = appProperties.availablePairs[chain];
  const selectedPair = appProperties.pages.riskLevels.selectedPair;
  const capUSD = appProperties.pages.riskLevels.capUSD;
  const capInKind = appProperties.pages.riskLevels.capInKind;
  const tokenPrice = appProperties.pages.riskLevels.tokenPrice;
  const riskParameter = appProperties.pages.riskLevels.selectedRiskParameter;
  const liquidationThreshold = appProperties.pages.riskLevels.currentLiquidationThreshold;
  const [displayLT, setDisplayLT] = useState<number | string>(liquidationThreshold);
  const pathName = useLocation().pathname;
  const navPair = pathName.split('/')[2]
    ? { base: pathName.split('/')[2].split('-')[0], quote: pathName.split('/')[2].split('-')[1] }
    : undefined;

  useEffect(() => {
    if (navPair) {
      updateNavPair(navPair);
    }
  }, []);

  const updateNavPair = (pair: Pair) => {
    const base = pair.base;
    const quote = pair.quote;
    const newRiskParameters = riskParameters[base][quote];
    const newCapInUsd = Math.min(newRiskParameters.borrowCapInUSD, newRiskParameters.supplyCapInUSD);
    const newCapInKind = newCapInUsd / newRiskParameters.basePrice;
    const newLiquidationThreshold = newRiskParameters.liquidationThreshold * 100;
    setAppProperties({
      ...appProperties,
      pages: {
        ...appProperties.pages,
        riskLevels: {
          ...appProperties.pages.riskLevels,
          selectedPair: { base, quote },
          capInKind: newCapInKind,
          capUSD: newCapInUsd,
          selectedRiskParameter: newRiskParameters,
          currentLiquidationThreshold: newLiquidationThreshold
        }
      }
    });
    setDisplayLT(newLiquidationThreshold);
  };

  const handleChangePair = (event: SelectChangeEvent) => {
    const base = event.target.value.split('/')[0];
    const quote = event.target.value.split('/')[1];
    setAppProperties({
      ...appProperties,
      pages: {
        ...appProperties.pages,
        riskLevels: {
          ...appProperties.pages.riskLevels,
          selectedPair: { base, quote },
          selectedRiskParameter: riskParameters[base][quote]
        }
      }
    });
  };
  const handleChangeCap = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target && event.target.value && tokenPrice) {
      setAppProperties({
        ...appProperties,
        pages: {
          ...appProperties.pages,
          riskLevels: {
            ...appProperties.pages.riskLevels,
            capInKind: Number(event.target.value)
          }
        }
      });
    }
  };

  const handleChangeLT = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target && event.target.value) {
      const newLT = Number(event.target.value);
      if (newLT >= 1 && newLT < 100 - riskParameter.bonus * 100) {
        setAppProperties({
          ...appProperties,
          pages: {
            ...appProperties.pages,
            riskLevels: {
              ...appProperties.pages.riskLevels,
              currentLiquidationThreshold: newLT
            }
          }
        });
        setDisplayLT(newLT);
      }
    } else if (!event.target.value) {
      setDisplayLT('');
    }
  };

  if (!selectedPair || !tokenPrice || capInKind == undefined || isLoading) {
    return <RiskLevelGraphsSkeleton />;
  }
  return (
    <Box sx={{ mt: 10 }}>
      {isLoading || !riskParameter || !liquidationThreshold || !availablePairs ? (
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
            <Typography textAlign={'right'}>LT: </Typography>
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
              value={displayLT}
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
    </Box>
  );
}
