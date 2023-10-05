import { List, ListItemButton, ListSubheader } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { DATA_SOURCES, DATA_SOURCES_MAP } from '../utils/Contants';
import { useState } from 'react';

export function NavCategories() {
  const [selectedButton, setSelectedButton] = useState<string>('overview');

  function handleClick(buttonName: string) {
    setSelectedButton(buttonName);
  }

  return (
    <List sx={{ mt: 7 }}>
      <ListItemButton
        key="overview"
        sx={{
          backgroundColor: selectedButton == 'overview' ? 'primary.main' : 'background.default',
          color: selectedButton == 'overview' ? 'primary.contrastText' : 'primary.main',
          '&:hover': { backgroundColor: 'primary.main', color: 'primary.contrastText' }
        }}
        component={RouterLink}
        to="/"
        onClick={() => handleClick('overview')}
      >
        Overview
      </ListItemButton>
      <ListSubheader inset>Datasources</ListSubheader>
      {DATA_SOURCES.map((_, index) => (
        <ListItemButton
          key={index}
          sx={{
            backgroundColor: selectedButton == _ ? 'primary.main' : 'background.default',
            color: selectedButton == _ ? 'primary.contrastText' : 'primary.main',
            '&:hover': { backgroundColor: 'primary.main', color: 'primary.contrastText' }
          }}
          component={RouterLink}
          onClick={() => handleClick(_)}
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
