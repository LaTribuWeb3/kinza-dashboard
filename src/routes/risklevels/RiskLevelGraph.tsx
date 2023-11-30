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
  ltv: number,
  borrowCap: number
) {
  const sigma = volatility;
  const d = borrowCap;
  const beta = liquidationBonus;
  const l = liquidity;

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

        /// for each block
        for (const [block, blockData] of Object.entries(data.liquidity)) {
          const currentBlockData: GraphDataAtBlock = {
            blockNumber: Number(block)
          };
          for (const morphoParameter of MORPHO_RISK_PARAMETERS_ARRAY) {
            const liquidationBonus = morphoParameter.bonus;
            const liquidity = blockData.avgSlippageMap[liquidationBonus].base;
            if (liquidity <= 0) {
              continue;
            }
            const ltv = morphoParameter.ltv;
            const borrowCap = props.supplyCap;
            currentBlockData[`${morphoParameter.bonus}_${morphoParameter.ltv}`] = findRiskLevelFromParameters(
              blockData.volatility,
              liquidity,
              liquidationBonus / 10000,
              ltv,
              borrowCap
            );
          }
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
              xAxisData={graphData.map((_) => _.blockNumber)}
              xAxisLabel="Block"
              leftYAxis={{ formatter: FriendlyFormatNumber }}
              leftAxisSeries={MORPHO_RISK_PARAMETERS_ARRAY.map((_) => {
                const data = graphData.map((block) => block[`${_.bonus}_${_.ltv}`]);
                return {
                  label: `LTV: ${_.ltv * 100}% & Bonus: ${_.bonus/100}%`,
                  data: data,
                  formatter: FriendlyFormatNumber
                };
              })}
            />
          </Grid>
        </Grid>
      )}

      <SimpleAlert alertMsg={alertMsg} handleCloseAlert={handleCloseAlert} openAlert={openAlert} />
    </>
  );
}