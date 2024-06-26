import { Grid } from '@mui/material';
import { useContext } from 'react';
import { OverviewTable } from '../../components/OverviewTable';
import { AppContext } from '../App';

export function Overview() {
  const overviewData = useContext(AppContext).appProperties.overviewData;

  return (
    <Grid sx={{ mt: 10 }} container spacing={2}>
      <OverviewTable data={overviewData} />
    </Grid>
  );
}
