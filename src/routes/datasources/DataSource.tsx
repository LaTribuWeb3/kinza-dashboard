import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DataService from '../../services/DataService';
import { Pair } from '../../models/ApiData';
import { Grid, LinearProgress, MenuItem, Select, SelectChangeEvent, Skeleton, Typography } from '@mui/material';
import { SimpleAlert } from '../../components/SimpleAlert';
import { SLIPPAGES_BPS } from '../../utils/Contants';
import { DataSourceGraphs } from './DataSourceGraphs';
import { sleep } from '../../utils/Utils';

function DataSourceSkeleton() {
  return (
    <Grid container spacing={0}>
      <LinearProgress color="secondary" sx={{ position: 'absolute', bottom: 5, left: 0, width: '100vw' }} />
      <Grid item xs={12} md={6}>
        <Skeleton height={80} variant="rectangular" />
      </Grid>
      <Grid item xs={12} md={6}>
        <Skeleton height={80} variant="rectangular" />
      </Grid>
      <Grid item xs={12}>
        <Skeleton height={500} variant="rectangular" />
      </Grid>
    </Grid>
  );
}

export default function DataSource() {
  const [isLoading, setIsLoading] = useState(true);
  const [availablePairs, setAvailablePairs] = useState<Pair[]>([]);
  const [selectedSlippage, setSelectedSlippage] = useState(500);
  const [selectedPair, setSelectedPair] = useState<Pair>();
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');

  const pathName = useLocation().pathname;
  const platform = pathName.split('/')[2];

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const handleChangeSlippage = (event: SelectChangeEvent) => {
    setSelectedSlippage(Number(event.target.value));
  };

  const handleChangePair = (event: SelectChangeEvent) => {
    console.log(`handleChangePair: ${event.target.value}`);
    setSelectedPair({ base: event.target.value.split('/')[0], quote: event.target.value.split('/')[1] });
  };

  useEffect(() => {
    setIsLoading(true);
    // Define an asynchronous function
    async function fetchData() {
      try {
        const data = await DataService.GetAvailablePairs(platform);
        setAvailablePairs(data);

        const oldPair = selectedPair;

        if (oldPair && data.some((_) => _.base == oldPair.base && _.quote == oldPair.quote)) {
          setSelectedPair(oldPair);
        } else {
          setSelectedPair(data[0]);
        }
        await sleep(1); // without this sleep, update the graph before changing the selected pair. so let it here
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

    // Call the asynchronous function
    fetchData()
      .then(() => setIsLoading(false))
      .catch(console.error);

    // You can also return a cleanup function from useEffect if needed
    return () => {
      // Perform cleanup if necessary
    };
  }, [platform]);

  if (!selectedPair) {
    return <DataSourceSkeleton />;
  }
  return (
    <Box sx={{ mt: 10 }}>
      {isLoading ? (
        <DataSourceSkeleton />
      ) : (
        <Grid container spacing={1} alignItems="baseline">
          {/* First row: pairs select and slippage select */}
          <Grid item xs={6} sm={3}>
            <Typography textAlign={'right'}>Pair: </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Select
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

          <Grid item xs={6} sm={3}>
            <Typography textAlign={'right'}>Slippage: </Typography>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Select
              labelId="slippage-select"
              id="slippage-select"
              value={selectedSlippage.toString()}
              label="Slippage"
              onChange={handleChangeSlippage}
            >
              {SLIPPAGES_BPS.map((slippageValue, index) => (
                <MenuItem key={index} value={slippageValue}>
                  {slippageValue / 100}%
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <DataSourceGraphs pair={selectedPair} platform={platform} targetSlippage={selectedSlippage} />
        </Grid>
      )}

      <SimpleAlert alertMsg={alertMsg} handleCloseAlert={handleCloseAlert} openAlert={openAlert} />
    </Box>
  );
}
