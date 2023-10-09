import { useEffect, useState } from 'react';
import { LiquidityData, Pair } from '../models/ApiData';
import DataService from '../services/DataService';
import { Grid, LinearProgress, Skeleton, Typography } from '@mui/material';
import { LineChart } from '@mui/x-charts';
import { SimpleAlert } from './SimpleAlert';
import { FriendlyFormatNumber } from '../utils/Utils';
export interface DataSourceGraphsInterface {
  pair: Pair;
  platform: string;
  targetSlippage: number;
}

function DataSourceGraphsSkeleton() {
  return (
    <Grid mt={5} container spacing={0}>
      <LinearProgress color="secondary" sx={{ position: 'absolute', bottom: 5, left: 0, width: '100vw' }} />
      <Grid item xs={12}>
        <Skeleton height={500} variant="rectangular" />
      </Grid>
    </Grid>
  );
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
          setAlertMsg(`${error.toString()}`);
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
    return <DataSourceGraphsSkeleton />;
  }
  return (
    <>
      {isLoading ? (
        <DataSourceGraphsSkeleton />
      ) : (
        <Grid width={'100vw'} container spacing={0}>
          <Grid item xs={12}>
            <Typography
              textAlign={'center'}
              mt={2}
            >{`${props.pair.base}/${props.pair.quote} data over 180 days`}</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography textAlign={'center'} mt={5}>{`${props.pair.base}/${props.pair.quote} liquidity`}</Typography>
            <LineChart
              legend={{
                direction: 'column',
                position: {
                  vertical: 'top',
                  horizontal: 'middle'
                }
              }}
              sx={{
                marginTop: '-100px',
                '--ChartsLegend-rootOffsetX': '0px',
                '--ChartsLegend-rootOffsetY': '0px'
              }}
              xAxis={[
                {
                  label: 'Block',
                  data: Object.keys(liquidityData).map((_) => Number(_)),
                  tickMinStep: 50000,
                  min: Object.keys(liquidityData).map((_) => Number(_))[0],
                  max: Object.keys(liquidityData)
                    .map((_) => Number(_))
                    .at(-1)
                }
              ]}
              yAxis={[
                {
                  min: 0,
                  valueFormatter: FriendlyFormatNumber
                }
              ]}
              series={[
                {
                  label: 'liquidity',
                  data: Object.values(liquidityData).map((_) => _.slippageMap[props.targetSlippage]),
                  valueFormatter: FriendlyFormatNumber,
                  showMark: false
                }
              ]}
              height={450}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography textAlign={'center'} mt={5}>{`${props.pair.base}/${props.pair.quote} price`}</Typography>

            <LineChart
              legend={{
                direction: 'column',
                position: {
                  vertical: 'top',
                  horizontal: 'middle'
                }
              }}
              sx={{
                width: '150%',
                marginTop: '-100px',
                '--ChartsLegend-rootOffsetX': '0px',
                '--ChartsLegend-rootOffsetY': '0px'
              }}
              xAxis={[
                {
                  label: 'Block',
                  data: Object.keys(liquidityData).map((_) => Number(_)),
                  tickMinStep: 50000,
                  min: Object.keys(liquidityData).map((_) => Number(_))[0],
                  max: Object.keys(liquidityData)
                    .map((_) => Number(_))
                    .at(-1)
                }
              ]}
              yAxis={[
                {
                  max: Math.max(...Object.values(liquidityData).map((_) => _.price)) * 1.1,
                  min: Math.min(...Object.values(liquidityData).map((_) => _.price)) * 0.9,
                  valueFormatter: FriendlyFormatNumber
                }
              ]}
              series={[
                {
                  label: 'price',
                  data: Object.values(liquidityData).map((_) => _.price),
                  valueFormatter: FriendlyFormatNumber,
                  showMark: false
                }
              ]}
              height={450}
            />
          </Grid>
        </Grid>
      )}

      <SimpleAlert alertMsg={alertMsg} handleCloseAlert={handleCloseAlert} openAlert={openAlert} />
    </>
  );
}
