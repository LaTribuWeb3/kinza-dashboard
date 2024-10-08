import { useEffect, useState } from 'react';
import { LiquidityData, Pair } from '../../models/ApiData';
import DataService from '../../services/DataService';
import { Grid, LinearProgress, Skeleton, Typography, useMediaQuery } from '@mui/material';
import { SimpleAlert } from '../../components/SimpleAlert';
import { FriendlyFormatNumber, PercentageFormatter, sleep } from '../../utils/Utils';
import moment from 'moment';
import Graph from '../../components/Graph';
export interface RiskLevelGraphsInterface {
  pair: Pair;
  platform: string;
  supplyCap: number;
  liquidationThreshold: number;
  chain: string;
  parameters: { liquidationThreshold: number; bonus: number; visible: boolean };
}

export interface GraphDataAtTimestamp {
  timestamp: number;
  riskValue: number;
}

export function RiskLevelGraphsSkeleton() {
  return (
    <Grid mt={5} container spacing={0}>
      <LinearProgress color="secondary" sx={{ position: 'absolute', bottom: 5, left: 0, width: '100vw' }} />
      <Grid item xs={12}>
        <Skeleton height={500} variant="rectangular" />
      </Grid>
    </Grid>
  );
}
function findRiskLevelFromParameters(
  volatility: number,
  liquidity: number,
  liquidationBonus: number,
  liquidationThreshold: number,
  borrowCap: number
) {
  const sigma = volatility;
  const d = borrowCap;
  const beta = liquidationBonus;
  const l = liquidity;

  const sigmaTimesSqrtOfD = sigma * Math.sqrt(d);
  const ltPlusBeta = liquidationThreshold + beta;
  const lnOneDividedByLtPlusBeta = Math.log(1 / ltPlusBeta);
  const lnOneDividedByLtPlusBetaTimesSqrtOfL = lnOneDividedByLtPlusBeta * Math.sqrt(l);
  const r = sigmaTimesSqrtOfD / lnOneDividedByLtPlusBetaTimesSqrtOfL;
  return r;
}

export function RiskLevelGraphs(props: RiskLevelGraphsInterface) {
  const [liquidityData, setLiquidityData] = useState<LiquidityData>();
  const [isLoading, setIsLoading] = useState(true);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [graphData, setGraphData] = useState<GraphDataAtTimestamp[]>([]);
  const screenBigEnough = useMediaQuery('(min-width:600px)');

  const slippageBps = Number(props.parameters.bonus * 1e4).toFixed(0);
  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  useEffect(() => {
    setIsLoading(true);
    async function fetchAndComputeDataForGraph() {
      try {
        const data = await DataService.GetLiquidityData(props.platform, props.pair.base, props.pair.quote, props.chain);
        const graphData: GraphDataAtTimestamp[] = [];
        let i = 0;
        for (const [timestamp, timestampData] of Object.entries(data.liquidity)) {
          if (!screenBigEnough && i % 4 == 0) {
            continue;
          }
          i++;
          const currentBlockData: GraphDataAtTimestamp = {
            timestamp: Number(timestamp),
            riskValue: 0
          };
          if (props.parameters.visible) {
            const liquidationBonus = Math.round(props.parameters.bonus * 10000);
            const liquidity = timestampData.avgSlippageMap[liquidationBonus];
            if (liquidity > 0) {
              const liquidationThreshold = props.liquidationThreshold;
              const cap = props.supplyCap == 0 ? 1 : props.supplyCap;
              currentBlockData.riskValue = findRiskLevelFromParameters(
                timestampData.volatility,
                liquidity,
                liquidationBonus / 10000,
                liquidationThreshold,
                cap
              );
            }
          }
          graphData.push(currentBlockData);
        }

        graphData.sort((a, b) => a.timestamp - b.timestamp);
        setGraphData(graphData);
        setLiquidityData(data);
        await sleep(1);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
        if (error instanceof Error) {
          setAlertMsg(`${error.toString()}`);
        } else {
          setAlertMsg(`Unknown error`);
        }
      }
    }
    fetchAndComputeDataForGraph()
      .then(() => setIsLoading(false))
      .catch(console.error);
    // platform is not in the deps for this hooks because we only need to reload the data
    // if the pair is changing
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.pair.base, props.pair.quote, props.supplyCap, props.parameters, props.liquidationThreshold, props.chain]);

  if (!liquidityData) {
    return <RiskLevelGraphsSkeleton />;
  }

  const updated = moment(liquidityData.updated).fromNow();
  return (
    <>
      {isLoading ? (
        <RiskLevelGraphsSkeleton />
      ) : (
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <Typography
              textAlign={'center'}
              mt={2}
            >{`${props.pair.base}/${props.pair.quote} risk levels over 180 days (updated ${updated})`}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Graph
              title={`${props.pair.base}/${props.pair.quote} Risk Levels`}
              xAxisData={graphData.map((_) => _.timestamp)}
              xAxisLabel="Date"
              leftYAxis={{ formatter: FriendlyFormatNumber, label: 'Risk Level' }}
              leftAxisSeries={[
                {
                  label: 'Risk Level',
                  data: graphData.map((_) => _.riskValue),
                  formatter: FriendlyFormatNumber
                }
              ]}
            />
          </Grid>

          <Grid item xs={12}>
            <Graph
              title={`${props.pair.base}/${props.pair.quote} Liquidity & Volatility`}
              xAxisData={Object.keys(liquidityData.liquidity).map((_) => Number(_))}
              xAxisLabel="Date"
              leftYAxis={{ min: 0, formatter: FriendlyFormatNumber, label: 'Liquidity' }}
              leftAxisSeries={[
                {
                  label: `${props.pair.base} liquidity for ${slippageBps / 100}% slippage`,
                  data: Object.values(liquidityData.liquidity).map((_) => _.avgSlippageMap[slippageBps]),
                  formatter: FriendlyFormatNumber
                }
              ]}
              rightYAxis={{
                min: 0,
                max: Math.max(
                  10 / 100,
                  Math.max(...Object.values(liquidityData.liquidity).map((_) => _.volatility)) * 1.1
                ),
                formatter: PercentageFormatter,
                label: 'volatility'
              }}
              rightAxisSeries={[
                {
                  label: 'volatility',
                  data: Object.values(liquidityData.liquidity).map((_) => _.volatility),
                  formatter: PercentageFormatter
                }
              ]}
            />
          </Grid>
        </Grid>
      )}

      <SimpleAlert alertMsg={alertMsg} handleCloseAlert={handleCloseAlert} openAlert={openAlert} />
    </>
  );
}
