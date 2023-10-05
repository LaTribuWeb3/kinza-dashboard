import { Box, Card, CardContent, Grid, Tooltip, Typography } from '@mui/material';
import { OverviewData } from '../models/OverviewData';

export interface OverviewCardInterface {
  data: OverviewData[];
}

export function OverviewCard(props: OverviewCardInterface) {
  return (
    <Grid container spacing={1}>
      {props.data.map((overviewData, i) => (
        <Grid key={i} item xs={12} md={6}>
          <Box>
            <Card sx={{ height: 175, overflowY: 'auto' }} variant="outlined">
              <CardContent>
                <Typography textAlign={'center'} variant="h5" component="div" gutterBottom>
                  {overviewData.dataSourceName}
                </Typography>

                <Tooltip
                  title={overviewData.poolsFetched.map((_) => _.label || _.tokens.join('-') + ' pool').join(', ')}
                >
                  <Typography textAlign={'center'}>{overviewData.poolsFetched.length} Pools fetched</Typography>
                </Tooltip>

                <Grid container spacing={1} sx={{ bottom: 0 }}>
                  <Grid key={i} item xs={12} md={6}>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary">
                      Last block fetched: {overviewData.lastBlockFetched}
                    </Typography>
                  </Grid>
                  <Grid key={i} item xs={12} md={6}>
                    <Typography sx={{ fontSize: 14 }} textAlign={'right'} color="text.secondary">
                      Updated {overviewData.lastRunTimestampMs}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}
