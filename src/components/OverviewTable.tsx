import {
  Box,
  Collapse,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip
} from '@mui/material';
import { OverviewData, RiskLevelData } from '../models/OverviewData';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import React from 'react';
import { FriendlyFormatNumber } from '../utils/Utils';

export interface OverviewProperties {
  data: OverviewData;
}

function Row(props: { baseSymbol: string; row: RiskLevelData }) {
  const { baseSymbol, row } = props;

  row.subMarkets.sort((s1, s2) => {
    return s1.riskLevel > s2.riskLevel ? 0 : 1;
  });

  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="center" component="th" scope="row">
          {baseSymbol}
        </TableCell>
        <TableCell align="center">{row.riskLevel.toFixed(2)}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Market</TableCell>
                    <TableCell>Risk Level</TableCell>
                    <TableCell>LTV (%)</TableCell>
                    <TableCell>Supply Cap ($)</TableCell>
                    <TableCell>Borrow Cap ($)</TableCell>
                    <TableCell>Volatility (%)</TableCell>
                    <TableCell>Liquidity ({baseSymbol})</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.subMarkets.map((subMarket) => (
                    <TableRow key={subMarket.quote}>
                      <TableCell component="th" scope="row">
                        {baseSymbol}/{subMarket.quote}
                      </TableCell>
                      <TableCell>{subMarket.riskLevel.toFixed(2)}</TableCell>
                      <TableCell>{subMarket.LTV * 100}%</TableCell>
                      <Tooltip title={`${FriendlyFormatNumber(subMarket.supplyCapInKind)} ${baseSymbol}`}>
                        <TableCell>${FriendlyFormatNumber(subMarket.supplyCapUsd)}</TableCell>
                      </Tooltip>

                      <Tooltip title={`${FriendlyFormatNumber(subMarket.borrowCapInKind)} ${subMarket.quote}`}>
                        <TableCell>${FriendlyFormatNumber(subMarket.borrowCapUsd)}</TableCell>
                      </Tooltip>
                      <TableCell>{(subMarket.volatility * 100).toFixed(2)}%</TableCell>
                      <TableCell>{FriendlyFormatNumber(subMarket.liquidity)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export function OverviewTable(props: OverviewProperties) {
  return (
    <Grid sx={{ mt: 1 }} container spacing={2}>
      <Grid item xs={0} lg={1} />
      <Grid item xs={12} lg={10}>
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell align="center">Market</TableCell>
                <TableCell align="center">Risk level</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(props.data).map((baseSymbol) => (
                <Row key={baseSymbol} baseSymbol={baseSymbol} row={props.data[baseSymbol]} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid item xs={0} lg={1} />
    </Grid>
  );
}
