/* @refresh reload */
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query'
import { render } from 'solid-js/web'
import App from './App.tsx'
import './index.css'

const root = document.getElementById('root')
export const queryClient = new QueryClient()

render(
  () => (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  ),
  root!
)
