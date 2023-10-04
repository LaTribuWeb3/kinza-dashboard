import { Alert, AlertTitle, Box, CircularProgress, Container, Grid, LinearProgress, Skeleton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import DataService from '../services/DataService';

function OverviewSkeleton() {
  const nbSkeletons = 8;
  return (
    <Grid container spacing={1}>
      {Array.from({ length: nbSkeletons }).map((v, i) => (
        <Grid key={i} item xs={12} md={6}>
          <Skeleton height={200} variant="rectangular" />
        </Grid>
      ))}
    </Grid>
  );
}

export function Overview() {
  const [isLoading, setIsLoading] = useState(true);
  const [overviewData, setOverviewData] = useState<string[]>([]);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  useEffect(() => {
    setIsLoading(true);
    // Define an asynchronous function
    async function fetchData() {
      try {
        // Perform async operations (e.g., fetch data from an API)
        const overviewData = await DataService.GetOverview();

        // Update component state or perform other actions with the data
        console.log(overviewData);
        setOverviewData(overviewData);
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
  }, []); // Empty dependency array means this effect runs once, similar to componentDidMount

  return (
    <Grid container spacing={2}>
      <h1>This is the overview</h1>
      {isLoading && !openAlert ? <OverviewSkeleton /> : <p>{overviewData.join(', ')}</p>}
      {openAlert ? (
        <Alert
          sx={{ position: 'absolute', bottom: 10, right: 1 }}
          variant="filled"
          severity="error"
          onClose={handleCloseAlert}
        >
          {alertMsg}
        </Alert>
      ) : (
        <></>
      )}
    </Grid>
  );
}
