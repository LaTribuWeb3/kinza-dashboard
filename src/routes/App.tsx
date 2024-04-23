import { Box } from '@mui/material';
import { createContext, useEffect, useMemo, useState } from 'react';
import { ResponsiveNavBar } from '../components/ResponsiveNavBar';
import { MainAppBar } from '../components/MainAppBar';
import { Outlet, useLocation } from 'react-router-dom';
import { Overview } from './overview/Overview';
import { AppContextProperties, appContextType } from '../models/AppContext';
import {
  BSC_DATA_SOURCES,
  BSC_DATA_SOURCES_MAP,
  ETH_DATA_SOURCES,
  ETH_DATA_SOURCES_MAP,
  initialContext
} from '../utils/Constants';
import DataService from '../services/DataService';

const drawerWidth = 240;

export const AppContext = createContext<appContextType>(initialContext);

function App() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [appProperties, setAppProperties] = useState<AppContextProperties>(initialContext.appProperties);

  const contextValue = useMemo(() => ({ appProperties, setAppProperties }), [appProperties, setAppProperties]);
  const chain = appProperties.chain;
  const DATA_SOURCES = chain === 'bsc' ? BSC_DATA_SOURCES : ETH_DATA_SOURCES;
  const DATA_SOURCES_MAP = chain === 'bsc' ? BSC_DATA_SOURCES_MAP : ETH_DATA_SOURCES_MAP;

  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  useEffect(
    () => {
      async function fetchAvailablePairs() {
        for (const platform of Object.values(DATA_SOURCES_MAP)) {
          const pairs = await DataService.GetAvailablePairs(platform, chain);
          setAppProperties((prev) => ({
            ...prev,
            availablePairs: {
              ...prev.availablePairs,
              [platform]: pairs
            }
          }));
        }
      }
      fetchAvailablePairs().catch(console.error);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chain]
  );

  const pathName = useLocation().pathname;

  return (
    <Box sx={{ display: 'flex' }}>
      <AppContext.Provider value={contextValue}>
        <MainAppBar toggleDrawerFct={toggleDrawer} />
        <ResponsiveNavBar drawerWidth={drawerWidth} open={openDrawer} toggleDrawerFct={toggleDrawer} />
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
      </AppContext.Provider>
    </Box>
  );
}

export default App;
