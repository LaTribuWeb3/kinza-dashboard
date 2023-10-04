import Box from '@mui/material/Box';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function DataSource() {
  const pathName = useLocation().pathname;

  return (
    <Box>
      <h1>This is {pathName}</h1>
    </Box>
  );
}
