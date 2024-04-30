import { Box } from '@mui/material';
import { Overview } from './overview/Overview';
import { Outlet, useLocation } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import DataService from '../services/DataService';
import { AppContext } from './App';
import { OverviewData } from '../models/OverviewData';

export default function DataLoadingWrapper() {
  const pathName = useLocation().pathname;
  const { appProperties, setAppProperties } = useContext(AppContext);
  const chain = appProperties.chain;

  function setLoadingDone() {
    setAppProperties({ ...appProperties, loading: false });
  }
  useEffect(() => {
    async function fetchData() {
      try {
        const overviewData = await DataService.GetOverview(chain);
        const entries = Object.entries(overviewData);
        entries.sort((a, b) => b[1].riskLevel - a[1].riskLevel);
        const sortedOverviewData: OverviewData = entries.reduce((acc, [symbol, data]) => {
          acc[symbol] = data;
          return acc;
        }, {} as OverviewData);
        setAppProperties((prev) => ({ ...prev, overviewData: sortedOverviewData }));
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error instanceof Error) {
          console.log('Error fetching data:', error.toString());
        } else {
          console.log('Unknown error');
        }
      }
    }
    fetchData().then(setLoadingDone).catch(console.error);
  }, [chain]);

  return (
    <Box
      component="main"
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
        flexGrow: 1,
        height: '100vh',
        width: '100vw',
        overflow: 'auto',
        direction: 'row'
      }}
    >
      <Box sx={{ mt: 8, ml: 1.5 }}>
        {pathName === '/' && <Overview />}
        <Outlet />
      </Box>
    </Box>
  );
}
