import { Box, CircularProgress, Container, LinearProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import DataService from "../services/DataService";

export function Overview() {
  const [isLoading, setIsLoading] = useState(true);
  const [overviewData, setOverviewData] = useState<string[]>([])

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
    <Container sx={{textAlign: 'center'}}>
      <h1>This is the overview</h1>
      {isLoading ? 
        <CircularProgress /> :
        <p>
        {overviewData.join(', ')}
        </p>
    }
    </Container>);
}
