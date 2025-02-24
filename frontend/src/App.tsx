import { Route, Router } from '@solidjs/router'
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query'
import { lazy } from 'solid-js'
import LandingPage from './pages/LandingPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 3,
      throwOnError: true,
    },
  },
})

const App = () => {
  const Login = lazy(() => import('./pages/Login'))
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Route path="/" component={LandingPage} />
        <Route path="/login" component={Login} />
      </Router>
    </QueryClientProvider>
  )
}

export default App
