import { createBrowserRouter } from "react-router-dom";

import App from './routes/App.tsx';
import DataSource from './routes/DataSource.tsx';
import ErrorPage from "./ErrorPage.tsx";
import { overviewLoader } from './services/Loaders.ts'


const router = createBrowserRouter([
    {
      path: '/',
      element: <App />,
      errorElement: <ErrorPage />,
      loader: overviewLoader,
      children: [
        {
          path: 'datasource/:sourceName',
          element: <DataSource />,
        }
      ]
    }
  ]);

  export default router;