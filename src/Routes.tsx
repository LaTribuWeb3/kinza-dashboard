import { createBrowserRouter } from 'react-router-dom';

import App from './routes/App.tsx';
import DataSource from './routes/datasources/DataSource.tsx';
import ErrorPage from './ErrorPage.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'datasource/:sourceName',
        element: <DataSource />
      }
    ]
  }
]);

export default router;
