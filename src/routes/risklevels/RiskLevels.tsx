import { Box, Grid, InputAdornment, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import DataService from '../../services/DataService';
import { FriendlyFormatNumber, sleep } from '../../utils/Utils';
import { SimpleAlert } from '../../components/SimpleAlert';
import { RiskLevelGraphs, RiskLevelGraphsSkeleton } from './RiskLevelGraph';
import { KinzaRiskParameter, KinzaRiskParameters } from '../../models/RiskData';
import { useLocation } from 'react-router-dom';
import { AppContext } from '../App';

export default function RiskLevels() {
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const { appProperties, setAppProperties } = useContext(AppContext);
  const isLoading = appProperties.loading;
  const riskParameters = appProperties.riskParameters;
  const riskLevelsPage = appProperties.pages.riskLevels;
  const chain = appProperties.chain;
  const availablePairs = appProperties.availablePairs[chain];
  const selectedPair = riskLevelsPage.selectedPair;
  const capUSD = riskLevelsPage.capUSD;
  const capInKind = riskLevelsPage.capInKind;
  const tokenPrice = riskLevelsPage.tokenPrice;
  const riskParameter = riskLevelsPage.selectedRiskParameter;
  const liquidationThreshold = riskParameter.liquidationThreshold * 100;

  const pathName = useLocation().pathname;

  const handleCloseAlert = () => {
    setOpenAlert(false);
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
          selectedRiskParameter: riskParameters.base.quote
        }
      }
    });
  };
  const handleChangeCap = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target && event.target.value && tokenPrice) {
      console.log(event.target.value, tokenPrice);
      // setCapInKind(Number(event.target.value));
      // setCapUSD(Number(event.target.value) * tokenPrice);
    }
  };

  const handleChangeLT = (event: React.ChangeEvent<HTMLInputElement>) => {
    // if (event.target && event.target.value) {
    //   const newLT = Number(event.target.value);
    //   if (newLT >= 1 && newLT < 100 - riskParameter!.bonus * 100) {
    //     setLiquidationThreshold(newLT);
    //     setAppProperties({
    //       ...appProperties,
    //       riskParameter: { ...appProperties.riskParameter, liquidationThreshold: newLT / 100 }
    //     });
    //   }
    // }
  };

  console.log(selectedPair, tokenPrice, capInKind, isLoading);

  if (!selectedPair || !tokenPrice || capInKind == undefined || isLoading) {
    console.log('firing');
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
