import { Divider, List, ListItemButton, ListSubheader } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { DATA_SOURCES, DATA_SOURCES_MAP } from '../utils/Constants';
import { useState } from 'react';

export interface NavCategoriesProperties {
  toggleDrawerFct: () => void;
}

function findDefaultNavCategory(pathName: string) {
  if (pathName.includes('datasource')) {
    return pathName.split('/')[2];
  } else if (pathName.includes('risklevels')) {
    return 'risklevels';
  } else if (pathName.includes('lastupdate')) {
    return 'lastUpdate';
  }

  return 'overview';
}

export function NavCategories(props: NavCategoriesProperties) {
  const pathName = useLocation().pathname;
  const [selectedButton, setSelectedButton] = useState<string>(findDefaultNavCategory(pathName));

  console.log(selectedButton);
  function handleClick(buttonName: string) {
    setSelectedButton(buttonName);
    props.toggleDrawerFct();
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
      <Divider sx={{ my: 1 }} />
      <ListItemButton
        key="risklevels"
        sx={{
          backgroundColor: selectedButton == 'risklevels' ? 'primary.main' : 'background.default',
          color: selectedButton == 'risklevels' ? 'primary.contrastText' : 'primary.main',
          '&:hover': { backgroundColor: 'primary.main', color: 'primary.contrastText' }
        }}
        component={RouterLink}
        to="/risklevels"
        onClick={() => handleClick('risklevels')}
      >
        Risk Levels
      </ListItemButton>
      <ListSubheader inset>Datasources</ListSubheader>
      {DATA_SOURCES.map((_, index) => (
        <ListItemButton
          key={index}
          sx={{
            backgroundColor:
              selectedButton == DATA_SOURCES_MAP[_ as keyof typeof DATA_SOURCES_MAP]
                ? 'primary.main'
                : 'background.default',
            color:
              selectedButton == DATA_SOURCES_MAP[_ as keyof typeof DATA_SOURCES_MAP]
                ? 'primary.contrastText'
                : 'primary.main',
            '&:hover': { backgroundColor: 'primary.main', color: 'primary.contrastText' }
          }}
          component={RouterLink}
          onClick={() => handleClick(DATA_SOURCES_MAP[_ as keyof typeof DATA_SOURCES_MAP])}
          to={`/datasource/${DATA_SOURCES_MAP[_ as keyof typeof DATA_SOURCES_MAP]}`}
        >
          {_}
        </ListItemButton>
      ))}
      <Divider sx={{ my: 1 }} />
      <ListSubheader inset>Utilities</ListSubheader>

      <ListItemButton
        key="lastUpdate"
        sx={{
          backgroundColor: selectedButton == 'lastUpdate' ? 'primary.main' : 'background.default',
          color: selectedButton == 'lastUpdate' ? 'primary.contrastText' : 'primary.main',
          '&:hover': { backgroundColor: 'primary.main', color: 'primary.contrastText' }
        }}
        component={RouterLink}
        to="/lastupdate"
        onClick={() => handleClick('lastUpdate')}
      >
        Last Update
      </ListItemButton>
    </List>
  );
}
