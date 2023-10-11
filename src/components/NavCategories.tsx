import { List, ListItemButton, ListSubheader } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { DATA_SOURCES, DATA_SOURCES_MAP } from '../utils/Contants';
import { useState } from 'react';

export interface NavCategoriesProperties {
  toggleDrawerFct: () => void;
}

export function NavCategories(props: NavCategoriesProperties) {
  const pathName = useLocation().pathname;
  const [selectedButton, setSelectedButton] = useState<string>(pathName == '/' ? 'overview' : pathName.split('/')[2]);

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
      {/* <Divider sx={{ my: 1 }} /> */}
    </List>
  );
}
