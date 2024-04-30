import { Box } from '@mui/material';
import { createContext, useMemo, useState } from 'react';
import { ResponsiveNavBar } from '../components/ResponsiveNavBar';
import { MainAppBar } from '../components/MainAppBar';
import { AppContextProperties, appContextType } from '../models/AppContext';
import { initialContext } from '../utils/Constants';
import DataLoadingWrapper from './DataLoadingWrapper';

const drawerWidth = 240;

export const AppContext = createContext<appContextType>(initialContext);

function App() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [appProperties, setAppProperties] = useState<AppContextProperties>(initialContext.appProperties);

  const contextValue = useMemo(() => ({ appProperties, setAppProperties }), [appProperties, setAppProperties]);

  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };
  return (
    <Box sx={{ display: 'flex' }}>
      <AppContext.Provider value={contextValue}>
        <MainAppBar toggleDrawerFct={toggleDrawer} />
        <ResponsiveNavBar drawerWidth={drawerWidth} open={openDrawer} toggleDrawerFct={toggleDrawer} />
        <DataLoadingWrapper />
      </AppContext.Provider>
    </Box>
  );
}

export default App;
