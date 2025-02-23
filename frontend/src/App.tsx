import { Route, Router } from '@solidjs/router'
import { lazy } from 'solid-js'
import LandingPage from './pages/LandingPage'

const App = () => {
  const Login = lazy(() => import('./pages/Login'))
  return (
    <Router>
      <Route path="/" component={LandingPage} />
      <Route path="/login" component={Login} />
    </Router>
  )
}

export default App
