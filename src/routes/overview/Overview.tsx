import { Grid, LinearProgress, Skeleton } from '@mui/material';
import { useContext } from 'react';
import { BSC_DATA_SOURCES, ETH_DATA_SOURCES, OPBNB_DATA_SOURCES } from '../../utils/Constants';
import { OverviewTable } from '../../components/OverviewTable';
import { AppContext } from '../App';

function OverviewSkeleton() {
  const chain = useContext(AppContext).appProperties.chain;
  const DATA_SOURCES = chain === 'bsc' ? BSC_DATA_SOURCES : chain === 'opbnb' ? OPBNB_DATA_SOURCES : ETH_DATA_SOURCES;
  const nbSkeletons = DATA_SOURCES.length - 1; // -1 because "all" sources will not be displaying data
  return (
    <Grid container spacing={1}>
      <LinearProgress color="secondary" sx={{ position: 'absolute', bottom: 5, left: 0, width: '100vw' }} />
      {Array.from({ length: nbSkeletons }).map((_, i) => (
        <Grid key={i} item xs={12} md={6}>
          <Skeleton height={175} variant="rectangular" />
        </Grid>
      ))}
    </Grid>
  );
}

export function Overview() {
  const overviewData = useContext(AppContext).appProperties.overviewData;
  const isLoading = useContext(AppContext).appProperties.loading;

  return (
    <Grid sx={{ mt: 10 }} container spacing={2}>
      {isLoading ? <OverviewSkeleton /> : <OverviewTable data={overviewData} />}
    </Grid>
  );
}
