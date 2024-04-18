import {
  Avatar,
  Box,
  Divider,
  FormControl,
  InputLabel,
  List,
  ListItemButton,
  MenuItem,
  Select,
  SelectChangeEvent
} from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../routes/App';
import { initialContext } from '../utils/Constants';

export interface NavCategoriesProperties {
  toggleDrawerFct: () => void;
}

function findDefaultNavCategory(pathName: string) {
  if (pathName.includes('datasource')) {
    return 'datasource';
  } else if (pathName.includes('risklevels')) {
    return 'risklevels';
  } else if (pathName.includes('lastupdate')) {
    return 'lastUpdate';
  } else if (pathName.includes('learn')) {
    return 'learn';
  }

  return 'overview';
}

export function NavCategories(props: NavCategoriesProperties) {
  const pathName = useLocation().pathname;
  const [selectedButton, setSelectedButton] = useState<string>(findDefaultNavCategory(pathName));
  const { appProperties, setAppProperties } = useContext(AppContext);

  useEffect(() => {
    setSelectedButton(findDefaultNavCategory(pathName));
  }, [pathName]);

  function handleClick(buttonName: string) {
    setSelectedButton(buttonName);
    props.toggleDrawerFct();
  }

  function handleSelectChain(event: SelectChangeEvent) {
    setAppProperties(() => ({
      ...initialContext.appProperties,
      chain: event.target.value
    }));
  }

  return (
    <List sx={{ mt: 7 }}>
      <FormControl sx={{ mt: 5, width: 0.9, ml: 1 }}>
        <InputLabel id="Chain">Chain</InputLabel>
        <Select
          style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', width: '100%' }}
          labelId="Chain"
          id="Chain"
          value={appProperties.chain}
          defaultValue={appProperties.chain}
          label="Chain"
          onChange={handleSelectChain}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <MenuItem value={'bsc'}>
            <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
              <Avatar alt="binance smart chain logo" src="/bsc.ico" sx={{ width: 25, height: 25, marginRight: 2 }} />
              BSC
            </Box>
          </MenuItem>
          <MenuItem value={'ethereum'} sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
              <Avatar alt="Ethereum logo" src="/eth.png" sx={{ width: 25, height: 25, marginRight: 2 }} />
              Ethereum
            </Box>
          </MenuItem>
        </Select>
      </FormControl>

      <Divider sx={{ my: 1 }} />
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
      <Divider sx={{ my: 1 }} />
      <ListItemButton
        key="datasource"
        sx={{
          backgroundColor: selectedButton == 'datasource' ? 'primary.main' : 'background.default',
          color: selectedButton == 'datasource' ? 'primary.contrastText' : 'primary.main',
          '&:hover': { backgroundColor: 'primary.main', color: 'primary.contrastText' }
        }}
        component={RouterLink}
        to="/datasource/all"
        onClick={() => handleClick('datasource')}
      >
        Datasources
      </ListItemButton>
      <Divider sx={{ my: 1 }} />

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
      <Divider sx={{ my: 1 }} />
      <ListItemButton
        key="learn"
        sx={{
          backgroundColor: selectedButton == 'learn' ? 'primary.main' : 'background.default',
          color: selectedButton == 'learn' ? 'primary.contrastText' : 'primary.main',
          '&:hover': { backgroundColor: 'primary.main', color: 'primary.contrastText' }
        }}
        component={RouterLink}
        to="/learn"
        onClick={() => handleClick('learn')}
      >
        Learn More
      </ListItemButton>
    </List>
  );
}
