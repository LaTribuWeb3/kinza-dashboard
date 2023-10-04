import { List, ListItemButton, ListSubheader } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { DATA_SOURCES, DATA_SOURCES_MAP } from '../utils/Contants';

export function NavCategories() {
  return (
    <List sx={{ mt: 8 }}>
      <ListItemButton key="overview" component={RouterLink} to="/">
        Overview
      </ListItemButton>
      <ListSubheader inset>Datasources</ListSubheader>
      {DATA_SOURCES.map((_, index) => (
        <ListItemButton
          key={index}
          component={RouterLink}
          to={`/datasource/${DATA_SOURCES_MAP[_ as keyof typeof DATA_SOURCES_MAP]}`}
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
