import { useEffect, useState } from 'react';
import { LiquidityData, Pair } from '../models/ApiData';
import DataService from '../services/DataService';
import { LinearProgress } from '@mui/material';
import { LineChart } from '@mui/x-charts';
import { SimpleAlert } from './SimpleAlert';

export interface DataSourceGraphsInterface {
  pair: Pair;
  platform: string;
  targetSlippage: number;
}

export function DataSourceGraphs(props: DataSourceGraphsInterface) {
  const [liquidityData, setLiquidityData] = useState<LiquidityData>();
  const [isLoading, setIsLoading] = useState(true);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  useEffect(() => {
    setIsLoading(true);
    // Define an asynchronous function
    async function fetchDataForPair() {
      try {
        const data = await DataService.GetLiquidityData(props.platform, props.pair.base, props.pair.quote);

        setLiquidityData(data);
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
    fetchDataForPair().catch(console.error);

    // You can also return a cleanup function from useEffect if needed
    return () => {
      // Perform cleanup if necessary
    };
  }, [props.pair.base, props.pair.quote, props.platform]);

  if (!liquidityData) {
    return <LinearProgress color="secondary" sx={{ position: 'absolute', bottom: 5, left: 0, width: '100vw' }} />;
  }
  return (
    <>
      {isLoading ? (
        <LinearProgress color="secondary" sx={{ position: 'absolute', bottom: 5, left: 0, width: '100vw' }} />
      ) : (
        <LineChart
          xAxis={[
            {
              data: Object.keys(liquidityData).map((_) => Number(_)),
              tickMinStep: 50000,
              min: Object.keys(liquidityData).map((_) => Number(_))[0],
              max: Object.keys(liquidityData)
                .map((_) => Number(_))
                .at(-1)
            }
          ]}
          series={[
            {
              data: Object.values(liquidityData).map((_) => _.slippageMap[props.targetSlippage]),
              showMark: false
            }
          ]}
          width={1000}
          height={500}
        />
      )}

      <SimpleAlert alertMsg={alertMsg} handleCloseAlert={handleCloseAlert} openAlert={openAlert} />
    </>
  );
}
