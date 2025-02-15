/* @refresh reload */
import { Route, Router } from '@solidjs/router'
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query'
import { render } from 'solid-js/web'
import App from './App'
import Login from './components/Login'
import './index.css'

const root = document.getElementById('root')
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 3,
      throwOnError: true,
    },
  },
})

render(
  () => (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Route path="/" component={App} />
        <Route path="/login" component={Login} />
      </Router>
    </QueryClientProvider>
  ),
  root!
)
