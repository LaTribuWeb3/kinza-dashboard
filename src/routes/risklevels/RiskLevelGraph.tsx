import { useEffect, useState } from 'react';
import { LiquidityData, Pair } from '../../models/ApiData';
import DataService from '../../services/DataService';
import { Grid, LinearProgress, Skeleton, Typography } from '@mui/material';
import { SimpleAlert } from '../../components/SimpleAlert';
import { FriendlyFormatNumber, sleep } from '../../utils/Utils';
import moment from 'moment';
import { MORPHO_RISK_PARAMETERS_ARRAY } from '../../utils/Constants';
import Graph from '../../components/Graph';
export interface RiskLevelGraphsInterface {
  pair: Pair;
  platform: string;
  supplyCap: number;
}

export interface GraphDataAtBlock {
  blockNumber: number;
  [property: string]: number;
}

function RiskLevelGraphsSkeleton() {
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
  ltv: number,
  borrowCap: number
) {
  const sigma = volatility;
  const d = borrowCap;
  const beta = liquidationBonus;
  const l = liquidity;
  ltv = Number(ltv) / 100;

  const sigmaTimesSqrtOfD = sigma * Math.sqrt(d);
  const ltvPlusBeta = ltv + beta;
  const lnOneDividedByLtvPlusBeta = Math.log(1 / ltvPlusBeta);
  const lnOneDividedByLtvPlusBetaTimesSqrtOfL = lnOneDividedByLtvPlusBeta * Math.sqrt(l);
  const r = sigmaTimesSqrtOfD / lnOneDividedByLtvPlusBetaTimesSqrtOfL;

  return r;
}

export function RiskLevelGraphs(props: RiskLevelGraphsInterface) {
  const [liquidityData, setLiquidityData] = useState<LiquidityData>();
  const [isLoading, setIsLoading] = useState(true);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [graphData, setGraphData] = useState<GraphDataAtBlock[]>([]);

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  useEffect(() => {
    setIsLoading(true);
    async function fetchAndComputeDataForGraph() {
      try {
        const data = await DataService.GetLiquidityData(props.platform, props.pair.base, props.pair.quote);
        const graphData: GraphDataAtBlock[] = [];

        /// get token price
        const liquidityObjectToArray = Object.keys(data.liquidity).map((_) => parseInt(_));
        const maxBlock = Math.max.apply(null, liquidityObjectToArray).toString();
        const tokenPrice = data.liquidity[maxBlock].priceMedian;

        /// for each block
        for (const [block, blockData] of Object.entries(data.liquidity)) {
          const currentBlockData: GraphDataAtBlock = {
            blockNumber: Number(block)
          };
          MORPHO_RISK_PARAMETERS_ARRAY.forEach((_) => {
            const liquidationBonus = _.bonus;
            const liquidity = blockData.slippageMap[liquidationBonus].base * tokenPrice;
            const ltv = _.ltv;
            const borrowCap = props.supplyCap * tokenPrice;
            currentBlockData[`${_.bonus}_${_.ltv}`] = findRiskLevelFromParameters(
              blockData.volatility,
              liquidity,
              liquidationBonus,
              ltv,
              borrowCap
            );
          });
          graphData.push(currentBlockData);
        }
        graphData.sort((a, b) => a.blockNumber - b.blockNumber);
        setGraphData(graphData);
        setLiquidityData(data);
        await sleep(1);
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
    fetchAndComputeDataForGraph()
      .then(() => setIsLoading(false))
      .catch(console.error);
    console.log(liquidityData);
    // platform is not in the deps for this hooks because we only need to reload the data
    // if the pair is changing
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.pair.base, props.pair.quote, props.supplyCap]);

  if (!liquidityData) {
    return <RiskLevelGraphsSkeleton />;
  }

  const updated = moment(liquidityData.updated).fromNow();
  return (
    <>
      {isLoading ? (
        <RiskLevelGraphsSkeleton />
      ) : (
        <Grid width={'100vw'} container spacing={0}>
          <Grid item xs={12}>
            <Typography
              textAlign={'center'}
              mt={2}
            >{`${props.pair.base}/${props.pair.quote} data over 180 days (updated ${updated})`}</Typography>
          </Grid>

          <Grid item xs={12} lg={6}>
            <Graph
              title={`${props.pair.base}/${props.pair.quote} liquidity`}
              xAxisData={graphData.map((_) => _.blockNumber)}
              xAxisLabel="Block"
              leftYAxis={{ min: 0, formatter: FriendlyFormatNumber }}
              rightYAxis={{ min: 0, formatter: FriendlyFormatNumber }}
              leftAxisSeries={[
                {
                  label: `Amount ${props.pair.base} sold`,
                  data: graphData.map((_) => _.blockNumber),
                  formatter: FriendlyFormatNumber
                }
              ]}
              rightAxisSeries={[
                {
                  label: `Amount ${props.pair.quote} received`,
                  data: graphData.map((_) => _.blockNumber),
                  formatter: FriendlyFormatNumber
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
