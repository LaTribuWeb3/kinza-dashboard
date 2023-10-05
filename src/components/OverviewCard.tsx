import { Card, CardContent, Grid, Tooltip, Typography } from '@mui/material';
import { OverviewData } from '../models/OverviewData';
import moment from 'moment';

export interface OverviewCardInterface {
  data: OverviewData[];
}

export function OverviewCard(props: OverviewCardInterface) {
  return (
    <Grid container spacing={1}>
      {props.data.map((overviewData, i) => (
        <Grid key={i} item xs={12} lg={6}>
          <Card sx={{ overflowY: 'auto' }} variant="outlined">
            <CardContent>
              <Grid container spacing={1}>
                {/* first row */}
                <Grid item xs={0} sm={3}></Grid>
                <Grid item xs={12} sm={6}>
                  <Typography textAlign={'center'} variant="h5" gutterBottom>
                    {overviewData.dataSourceName}
                  </Typography>
                </Grid>
                <Grid item xs={0} sm={3}></Grid>

                {/* second row */}
                <Grid item xs={0} sm={3}></Grid>
                <Grid item xs={12} sm={6}>
                  <Tooltip
                    title={overviewData.poolsFetched.map((_) => _.label || _.tokens.join('-') + ' pool').join(', ')}
                  >
                    <Typography textAlign={'center'}>{overviewData.poolsFetched.length} Pools fetched</Typography>
                  </Tooltip>
                </Grid>
                <Grid item xs={0} sm={3}></Grid>

                {/* bottom row */}
                <Grid item xs={0} sm={4}></Grid>
                <Grid item xs={12} sm={8}>
                  <Typography sx={{ fontSize: 14, textAlign: 'right' }} color="text.secondary">
                    Block {overviewData.lastBlockFetched}
                  </Typography>

                  <Tooltip title={moment(overviewData.lastRunTimestampMs).toISOString()}>
                    <Typography sx={{ fontSize: 14, textAlign: 'right' }} color="text.secondary">
                      Updated {moment(overviewData.lastRunTimestampMs).fromNow()}
                    </Typography>
                  </Tooltip>
                </Grid>
              </Grid>

              {/* <Grid container spacing={1} sx={{ mt: 5 }}>
                  <Grid key={i} item xs={12} md={6}>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary">
                      Last block fetched: {overviewData.lastBlockFetched}
                    </Typography>
                  </Grid>
                  <Grid key={i} item xs={12} md={6}>
                    <Tooltip title={moment(overviewData.lastRunTimestampMs).toISOString()}>
                      <Typography sx={{ fontSize: 14 }} textAlign={'right'} color="text.secondary">
                        Updated {moment(overviewData.lastRunTimestampMs).fromNow()}
                      </Typography>
                    </Tooltip>
                  </Grid>
                </Grid> */}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
