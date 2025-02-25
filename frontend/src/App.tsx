import { Route, Router } from '@solidjs/router'
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query'
import { lazy } from 'solid-js'

import Layout from './components/Layout'

const AllRooms = lazy(() => import('./components/AllRooms'))
const Login = lazy(() => import('./components/Login'))
const NotFound = lazy(() => import('./components/NotFound'))

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
  return (
    <QueryClientProvider client={queryClient}>
      <Router root={Layout}>
        <Route path="/" component={AllRooms} />
        <Route path="/login" component={Login} />
        <Route path="*404" component={NotFound} />
      </Router>
    </QueryClientProvider>
  )
}

export default App
