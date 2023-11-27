import { useEffect, useState } from 'react';
import { LiquidityData, Pair } from '../../models/ApiData';
import DataService from '../../services/DataService';
import { Grid, LinearProgress, Skeleton, Typography } from '@mui/material';
import { SimpleAlert } from '../../components/SimpleAlert';
import { sleep } from '../../utils/Utils';
import moment from 'moment';
export interface RiskLevelGraphsInterface {
    pair: Pair;
    platform: string;
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

export function RiskLevelGraphs(props: RiskLevelGraphsInterface) {
    const [liquidityData, setLiquidityData] = useState<LiquidityData>();
    const [isLoading, setIsLoading] = useState(true);
    const [openAlert, setOpenAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');

    const handleCloseAlert = () => {
        setOpenAlert(false);
    };

    useEffect(() => {
        setIsLoading(true);
        async function fetchDataForPair() {
            try {
                const data = await DataService.GetLiquidityData(props.platform, props.pair.base, props.pair.quote);

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
        fetchDataForPair()
            .then(() => setIsLoading(false))
            .catch(console.error);
        // platform is not in the deps for this hooks because we only need to reload the data
        // if the pair is changing
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.pair.base, props.pair.quote]);

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

                    {/* probably map output to graph */}
                    <Grid item xs={12} lg={6}>
                        {/* <Graph
                            title={`${props.pair.base}/${props.pair.quote} liquidity`}
                            xAxisData={Object.keys(liquidityData.liquidity).map((_) => Number(_))}
                            xAxisLabel="Block"
                            leftYAxis={{ min: 0, formatter: FriendlyFormatNumber }}
                            rightYAxis={{ min: 0, formatter: FriendlyFormatNumber }}
                            leftAxisSeries={[
                                {
                                    label: `Amount ${props.pair.base} sold`,
                                    data: Object.values(liquidityData.liquidity).map((_) => _.slippageMap[props.targetSlippage].base),
                                    formatter: FriendlyFormatNumber
                                }
                            ]}
                            rightAxisSeries={[
                                {
                                    label: `Amount ${props.pair.quote} received`,
                                    data: Object.values(liquidityData.liquidity).map((_) => _.slippageMap[props.targetSlippage].quote),
                                    formatter: FriendlyFormatNumber
                                }
                            ]}
                        /> */}
                    </Grid>
                </Grid>
            )}

            <SimpleAlert alertMsg={alertMsg} handleCloseAlert={handleCloseAlert} openAlert={openAlert} />
        </>
    );
}
