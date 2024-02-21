import {
  Box,
  Collapse,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { OverviewData, RiskLevelData } from '../models/OverviewData';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowUp';
import React from 'react';
import { FriendlyFormatNumber } from '../utils/Utils';

export interface OverviewProperties {
  data: OverviewData;
}

function Row(props: { baseSymbol: string; row: RiskLevelData }) {
  const { baseSymbol, row } = props;
  console.log({ baseSymbol });
  console.log({ row });

  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {baseSymbol}
        </TableCell>
        <TableCell align="right">{row.riskLevel}</TableCell>
        {/* <TableCell align="right">{row.subMarkets.length} Markets</TableCell> */}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Details
              </Typography>
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
                      <TableCell>${FriendlyFormatNumber(subMarket.supplyCapUsd)}</TableCell>
                      <TableCell>${FriendlyFormatNumber(subMarket.borrowCapUsd)}</TableCell>
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
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Market</TableCell>
            <TableCell>Risk level</TableCell>
            <TableCell>Sub markets #</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(props.data).map((baseSymbol) => (
            // <Box>{baseSymbol}</Box>
            <Row key={baseSymbol} baseSymbol={baseSymbol} row={props.data[baseSymbol]} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
