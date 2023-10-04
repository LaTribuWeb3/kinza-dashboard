import { Box, CircularProgress, LinearProgress } from "@mui/material";
import React from "react";
import {
  Await,
  useLoaderData,
} from "react-router-dom";

export function Overview() {
  const data = useLoaderData();

  return (
    <Box>
      <h1>This is the overview</h1>
      <React.Suspense
        fallback={<CircularProgress />}
      >
        <Await
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          resolve={data.overviewData}
          errorElement={
            <p>Error loading package location!</p>
          }
        >
          {(overviewData) => (
            <p>
              {

              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
              overviewData.join(', ')
              }
            </p>
          )}
        </Await>
      </React.Suspense>
    </Box>);
}
