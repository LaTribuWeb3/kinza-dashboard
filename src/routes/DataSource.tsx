import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DataService from '../services/DataService';
import { Pair } from '../models/ApiData';
import { Grid, LinearProgress, MenuItem, Select, SelectChangeEvent, Skeleton } from '@mui/material';
import { SimpleAlert } from '../components/SimpleAlert';
import { SLIPPAGES_BPS } from '../utils/Contants';

function DataSourceSkeleton() {
  const nbSkeletons = 2; // -1 because "all" sources will not be displaying data
  return (
    <Grid container spacing={1}>
      <LinearProgress color="secondary" sx={{ position: 'absolute', bottom: 5, left: 0, width: '100vw' }} />
      {Array.from({ length: nbSkeletons }).map((_, i) => (
        <Grid key={i} item xs={12} md={6}>
          <Skeleton height={250} variant="rectangular" />
        </Grid>
      ))}
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
  console.log(platform);

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const handleChangeSlippage = (event: SelectChangeEvent) => {
    setSelectedSlippage(Number(event.target.value));
  };

  useEffect(() => {
    setIsLoading(true);
    // Define an asynchronous function
    async function fetchData() {
      try {
        // Perform async operations (e.g., fetch data from an API)
        const availablePairs = await DataService.GetAvailablePairs(platform);

        // Update component state or perform other actions with the data
        console.log(availablePairs);
        setAvailablePairs(availablePairs);
        setSelectedPair(availablePairs[0]);
        setIsLoading(false);
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
    fetchData().catch(console.error);

    // You can also return a cleanup function from useEffect if needed
    return () => {
      // Perform cleanup if necessary
    };
  }, [platform]); // Empty dependency array means this effect runs once, similar to componentDidMount

  return (
    <Box sx={{ mt: 10 }}>
      {isLoading ? (
        <DataSourceSkeleton />
      ) : (
        <Grid container spacing={1}>
          {/* First row: pairs select and slippage select */}
          <Grid item xs={12} sm={6}>
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
        </Grid>
      )}

      <SimpleAlert alertMsg={alertMsg} handleCloseAlert={handleCloseAlert} openAlert={openAlert} />
    </Box>
  );
}
