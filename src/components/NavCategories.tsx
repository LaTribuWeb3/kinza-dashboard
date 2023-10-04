import { Divider, Link, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const dataSources = ['All sources', 'Uniswap v2', 'Uniswap v3', 'Curve', 'Sushiswap v2'];

const dataSourcePageMap = {
  'All sources': 'all',
  'Uniswap v2': 'univ2',
  'Uniswap v3': 'univ3',
  Curve: 'curve',
  'Sushiswap v2': 'sushiv2'
};

export function NavCategories() {
  return (
    <List sx={{ mt: 8 }}>
      <ListItemButton key="overview" component={RouterLink} to="/">
        Overview
      </ListItemButton>
      <ListSubheader inset>Datasources</ListSubheader>
      {dataSources.map((_, index) => (
        <ListItemButton
          key={index}
          component={RouterLink}
          to={`/datasource/${dataSourcePageMap[_ as keyof typeof dataSourcePageMap]}`}
        >
          {_}
        </ListItemButton>
      ))}
      {/* <Divider sx={{ my: 1 }} />
          <ListSubheader component="div" inset>
            By Status
          </ListSubheader>
          <ListItemButton onClick={() => statusFilterFct(MonitoringStatusEnum.ERROR)}>
            <ListItemIcon>
              <ErrorIcon />
            </ListItemIcon>
            <ListItemText primary="Error" />
          </ListItemButton>
          <ListItemButton onClick={() => statusFilterFct(MonitoringStatusEnum.STALE)}>
            <ListItemIcon>
              <StaleIcon />
            </ListItemIcon>
            <ListItemText primary="Stale" />
          </ListItemButton>
          <ListItemButton onClick={() => statusFilterFct(MonitoringStatusEnum.RUNNING)}>
            <ListItemIcon>
              <LoopIcon />
            </ListItemIcon>
            <ListItemText primary="Running" />
          </ListItemButton>
          <ListItemButton onClick={() => statusFilterFct(MonitoringStatusEnum.SUCCESS)}>
            <ListItemIcon>
              <DoneIcon />
            </ListItemIcon>
            <ListItemText primary="Success" />
          </ListItemButton>
          <Divider sx={{ my: 1 }} />
          <ListItemButton onClick={() => displayAllFct()}>
            <ListItemText primary="All" />
          </ListItemButton> */}
    </List>
  );
}
