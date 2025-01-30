/* @refresh reload */
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query'
import { render } from 'solid-js/web'
import App from './App.tsx'
import './index.css'

const root = document.getElementById('root')
const client = new QueryClient()

render(
  () => (
    <QueryClientProvider client={client}>
      <App />
    </QueryClientProvider>
  ),
  root!
)
