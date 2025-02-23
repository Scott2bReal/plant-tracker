import { createMutation } from '@tanstack/solid-query'
import { Component, createSignal, Match, Switch } from 'solid-js'
import { authClient } from '../lib/auth-client'
import Main from './Main'

const login = async (email: string) => {
  const response = await authClient.signIn.magicLink({
    email,
  })
  return response
}

const Login: Component = () => {
  const [enteredEmail, setEnteredEmail] = createSignal('')

  const loginMutation = createMutation(() => ({
    mutationFn: async () => await login(enteredEmail()),
    mutationKey: ['login', enteredEmail()],
    onMutate: () => {
      console.log('Sending magic link')
    },
    onError: (error) => {
      console.error(error)
    },
    onSuccess: () => {
      console.log('Sent magic link')
    },
  }))

  return (
    <Main>
      <Switch
        fallback={
          <form
            on:submit={(e) => {
              e.preventDefault()
              loginMutation.mutate()
            }}
          >
            <label>
              Email
              <input
                on:change={(e) => setEnteredEmail(e.target.value)}
                type="email"
              />
            </label>
            <button type="submit">Log in</button>
          </form>
        }
      >
        <Match when={loginMutation.isPending}>
          <span>Logging in...</span>
        </Match>
        <Match when={loginMutation.error}>
          <span>Error: {loginMutation?.error?.message}</span>
        </Match>
        <Match when={loginMutation.data}>
          <span>Magic link sent! Please check your email</span>
        </Match>
      </Switch>
    </Main>
  )
}

export default Login
