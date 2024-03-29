import { Avatar, Box, Typography, styled } from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
const drawerWidth = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open'
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}));

export interface MainAppBarProperties {
  toggleDrawerFct: () => void;
}

export function MainAppBar(props: MainAppBarProperties) {
  return (
    <AppBar position="absolute">
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={props.toggleDrawerFct}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Avatar
          variant="rounded"
          alt="b protocol logo"
          src="/favicon.svg"
          sx={{ width: { xs: 40, md: 56 }, height: { xs: 30, md: 45 }, padding: 0.25, mr: 0.25 }}
        />
        <Box
          sx={{
            height: '100%',
            width: '95%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1
          }}
        >
          <Avatar
            alt="Kinza logo"
            src="/kinza-logo.png"
            sx={{ display: { xs: 'none', sm: 'flex' }, width: 45, height: 45, padding: 0.25 }}
          />
          <Typography
            sx={{ display: { xs: 'none', sm: 'flex' } }}
            variant="h6"
            color="inherit"
            textAlign="center"
            noWrap
          >
            Kinza SmartLTV Monitor
          </Typography>
          <Typography sx={{ display: { xs: 'flex', sm: 'none' } }} color="inherit" textAlign="center" noWrap>
            Kinza SmartLTV Monitor
          </Typography>
        </Box>
        <Avatar
          alt="Kinza logo"
          src="/kinza-logo.png"
          sx={{ display: { xs: 'flex', sm: 'none' }, width: 35, height: 35 }}
        />
      </Toolbar>
    </AppBar>
  );
}
