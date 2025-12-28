import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppRouter } from './app/router/AppRouter'
import './app/styles/globals.css' // Make sure you have Tailwind setup

// ⚡ React Query Client (Cache Manager)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Don't reload data when clicking tab
      staleTime: 1000 * 60 * 5,    // Data stays fresh for 5 mins
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppRouter />
    </QueryClientProvider>
  </React.StrictMode>,
)