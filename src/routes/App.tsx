import { Box } from '@mui/material';
import React from 'react';
import { ResponsiveNavBar } from '../components/ResponsiveNavBar';
import { MainAppBar } from '../components/MainAppBar';
import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Overview } from '../components/Overview';

const drawerWidth = 240;

function App() {
  const [openDrawer, setOpenDrawer] = React.useState(false);

  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  const pathName = useLocation().pathname;
  console.log('pathName', pathName);

  return (
    <Box sx={{ display: 'flex' }}>
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
        <Box sx={{ mt: 8, ml: 8 }}>
          {pathName == '/' && <Overview />}
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default App;
