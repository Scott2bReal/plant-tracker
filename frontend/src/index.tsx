/* @refresh reload */
import { Route, Router } from '@solidjs/router'
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query'
import { render } from 'solid-js/web'
import './index.css'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'

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
        <Route path="/" component={LandingPage} />
        <Route path="/login" component={Login} />
      </Router>
    </QueryClientProvider>
  ),
  root!
)
