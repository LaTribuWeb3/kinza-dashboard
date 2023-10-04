import { Grid } from '@mui/material';
import { OverviewData } from '../models/OverviewData';

export interface OverviewTableInterface {
  data: OverviewData[];
}

export function OverviewTable(props: OverviewTableInterface) {
  return (
    <Grid container spacing={1}>
      {props.data.map((overviewData, i) => (
        <Grid key={i} item xs={12} md={6}>
          {overviewData.dataSourceName}
        </Grid>
      ))}
    </Grid>
  );
}
