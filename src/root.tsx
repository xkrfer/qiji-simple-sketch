import { StrictMode } from 'react';

import { RouterProvider } from '@tanstack/react-router';
import ReactDOM from 'react-dom/client';

import { createRouter } from './router';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');
const router = createRouter();

const root = ReactDOM.createRoot(rootElement);
root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
