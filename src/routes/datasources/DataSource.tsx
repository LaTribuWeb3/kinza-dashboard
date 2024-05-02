import Box from '@mui/material/Box';
import { useContext } from 'react';
import {
  Grid,
  LinearProgress,
  MenuItem,
  Select,
  SelectChangeEvent,
  Skeleton,
  Typography,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  BSC_DATA_SOURCES,
  BSC_DATA_SOURCES_MAP,
  ETH_DATA_SOURCES,
  ETH_DATA_SOURCES_MAP,
  OPBNB_DATA_SOURCES,
  OPBNB_DATA_SOURCES_MAP,
  SLIPPAGES_BPS
} from '../../utils/Constants';
import { DataSourceGraphs } from './DataSourceGraphs';
import { AppContext } from '../App';

function DataSourceSkeleton() {
  return (
    <Grid container spacing={0}>
      <LinearProgress color="secondary" sx={{ position: 'absolute', bottom: 5, left: 0, width: '100vw' }} />
      <Grid item xs={12} md={6}>
        <Skeleton height={80} variant="rectangular" />
      </Grid>
      <Grid item xs={12} md={6}>
        <Skeleton height={80} variant="rectangular" />
      </Grid>
      <Grid item xs={12}>
        <Skeleton height={500} variant="rectangular" />
      </Grid>
    </Grid>
  );
}

export default function DataSource() {
  const { appProperties, setAppProperties } = useContext(AppContext);
  const chain = appProperties.chain;
  const isLoading = appProperties.loading;
  const selectedPair = appProperties.pages.dataSources.pair;
  const platform = appProperties.pages.dataSources.platform;
  const selectedSlippage = appProperties.pages.dataSources.slippage;
  const availablePairs = appProperties.availablePairs[chain];
  const platformsForPairs = appProperties.platformsByPair;

  const DATA_SOURCES = chain === 'bsc' ? BSC_DATA_SOURCES : chain === 'opbnb' ? OPBNB_DATA_SOURCES : ETH_DATA_SOURCES;
  const DATA_SOURCES_MAP =
    chain === 'bsc' ? BSC_DATA_SOURCES_MAP : chain === 'opbnb' ? OPBNB_DATA_SOURCES_MAP : ETH_DATA_SOURCES_MAP;

  const handleChangePlatform = (event: SelectChangeEvent) => {
    setAppProperties({
      ...appProperties,
      pages: {
        ...appProperties.pages,
        dataSources: { ...appProperties.pages.dataSources, platform: event.target.value }
      }
    });
  };

  const handleChangeSlippage = (event: SelectChangeEvent) => {
    setAppProperties({
      ...appProperties,
      pages: {
        ...appProperties.pages,
        dataSources: { ...appProperties.pages.dataSources, slippage: Number(event.target.value) }
      }
    });
  };

  const handleChangePair = (event: SelectChangeEvent) => {
    setAppProperties({
      ...appProperties,
      pages: {
        ...appProperties.pages,
        dataSources: {
          ...appProperties.pages.dataSources,
          pair: { base: event.target.value.split('/')[0], quote: event.target.value.split('/')[1] }
        }
      }
    });
  };

  if (
    !selectedPair ||
    isLoading ||
    !platformsForPairs[`${selectedPair.base}/${selectedPair.quote}`] ||
    !availablePairs
  ) {
    return <DataSourceSkeleton />;
  }
  return (
    <Box sx={{ mt: 10 }}>
      {isLoading ? (
        <DataSourceSkeleton />
      ) : (
        <Grid container spacing={1} alignItems="baseline">
          {/* First row: pairs select and slippage select */}
          <Grid item xs={12} sm={12} display="flex" justifyContent="center">
            <FormControl>
              <InputLabel id="data-source-select-label">Data Source</InputLabel>
              <Select
                labelId="data-source-select-label"
                id="data-source-select"
                value={platform}
                label="Data Source"
                onChange={handleChangePlatform}
              >
                {DATA_SOURCES.map((source, index) => {
                  // Map source to its value in the DATA_SOURCES_MAP
                  const value = DATA_SOURCES_MAP[source as keyof typeof DATA_SOURCES_MAP];
                  // Render MenuItem only if the platform is available for the specific pair
                  if (platformsForPairs[`${selectedPair.base}/${selectedPair.quote}`].includes(value)) {
                    return (
                      <MenuItem key={index} value={value}>
                        {source}
                      </MenuItem>
                    );
                  }
                  return null;
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography textAlign={'right'}>Pair: </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Select
              labelId="pair-select"
              id="pair-select"
              value={`${selectedPair.base}/${selectedPair.quote}`}
              label="Pair"
              onChange={handleChangePair}
            >
              {availablePairs.map((pair, index) => (
                <MenuItem key={index} value={`${pair.base}/${pair.quote}`}>
                  {`${pair.base}/${pair.quote}`}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Typography textAlign={'right'}>Slippage: </Typography>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Select
              labelId="slippage-select"
              id="slippage-select"
              value={selectedSlippage.toString()}
              label="Slippage"
              onChange={handleChangeSlippage}
            >
              {SLIPPAGES_BPS.map((slippageValue, index) => (
                <MenuItem key={index} value={slippageValue}>
                  {slippageValue / 100}%
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <DataSourceGraphs pair={selectedPair} platform={platform} targetSlippage={selectedSlippage} />
        </Grid>
      )}
    </Box>
  );
}
