import {
  Alert,
  AlertTitle,
  Box,
  CircularProgress,
  Container,
  Grid,
  LinearProgress,
  Skeleton,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import DataService from '../services/DataService';
import { SimpleAlert } from './SimpleAlert';
import { DATA_SOURCES } from '../utils/Contants';
import { OverviewData } from '../models/OverviewData';
import { OverviewTable } from './OverviewTable';

function OverviewSkeleton() {
  const nbSkeletons = DATA_SOURCES.length - 1; // -1 because "all" sources will not be displaying data
  return (
    <Grid container spacing={1}>
      {Array.from({ length: nbSkeletons }).map((v, i) => (
        <Grid key={i} item xs={12} md={6}>
          <Skeleton height={250} variant="rectangular" />
        </Grid>
      ))}
    </Grid>
  );
}

export function Overview() {
  const [isLoading, setIsLoading] = useState(true);
  const [overviewData, setOverviewData] = useState<OverviewData[]>([]);
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
      <Grid item xs={12}>
        <Container sx={{ textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Overview
          </Typography>
        </Container>
      </Grid>
      {isLoading ? <OverviewSkeleton /> : <OverviewTable data={overviewData} />}

      <SimpleAlert alertMsg={alertMsg} handleCloseAlert={handleCloseAlert} openAlert={openAlert} />
    </Grid>
  );
}
