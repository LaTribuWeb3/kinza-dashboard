import { createTheme } from '@mui/material/styles';
import { red, common } from '@mui/material/colors';

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: common.black
    },
    secondary: {
      main: '#19857b'
    },
    error: {
      main: red.A400
    }
  },
  typography: {
    fontFamily: 'monospace'
  }
});

export default theme;
