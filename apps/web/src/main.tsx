
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from '@/app/router/index.tsx'
import QueryProvider from './app/providers/QueryProvider'
import { Toaster } from './components/ui/sonner'
import AuthInitializer from './app/providers/AuthInitializer'
import ThemeInitializer from './app/providers/ThemeInitializer'
import { HelmetProvider } from "react-helmet-async";



createRoot(document.getElementById('root')!).render(
  <HelmetProvider>
    <QueryProvider>
      <ThemeInitializer />
      <Toaster
        position='top-right' />
      <AuthInitializer>

        <RouterProvider router={router} />
      </AuthInitializer>

    </QueryProvider>
  </HelmetProvider>

)
