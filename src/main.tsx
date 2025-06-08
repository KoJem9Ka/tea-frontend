import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { queryClient } from '@/shared/backbone/tanstack-query/query-client';
import { router } from '@/shared/backbone/tanstack-router/tanstack-router';
import { ElementId } from '@/shared/lib/element-id';
import reportWebVitals from './reportWebVitals';
import '@/shared/css/styles.css';


createRoot(document.getElementById(ElementId.App)!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
