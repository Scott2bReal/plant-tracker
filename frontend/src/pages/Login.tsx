import { createMutation } from '@tanstack/solid-query'
import { Component, createSignal, Match, Switch } from 'solid-js'
import Main from '../components/Main'
import { authClient } from '../lib/auth-client'

const callbackURL = import.meta.env.DEV
  ? 'http://localhost:5173'
  : 'https://plant-tracker.scott-app.com'

const sendMagicLink = async (email: string) => {
  const response = await authClient.signIn.magicLink({
    email,
    callbackURL,
  })
  return response
}

const Login: Component = () => {
  const [enteredEmail, setEnteredEmail] = createSignal('')

  const loginMutation = createMutation(() => ({
    mutationFn: async () => await sendMagicLink(enteredEmail()),
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
            class="flex flex-col items-center justify-center gap-4"
            on:submit={(e) => {
              e.preventDefault()
              loginMutation.mutate()
            }}
          >
            <label class="mx-auto flex w-fit flex-col gap-2 text-2xl font-bold text-cyan-900">
              Email
              <input
                on:change={(e) => setEnteredEmail(e.target.value)}
                type="email"
                class="rounded-lg bg-cyan-50 p-2 text-base font-normal text-black"
              />
            </label>
            <button
              type="submit"
              class="mx-auto mt-4 w-fit rounded-lg bg-cyan-700 p-2 text-white"
            >
              Send magic link
            </button>
          </form>
        }
      >
        <Match when={loginMutation.isPending}>
          <span>Sending magic link...</span>
        </Match>
        <Match when={loginMutation.error}>
          <span>Error: {loginMutation?.error?.message}</span>
        </Match>
        <Match when={loginMutation.data}>
          <span>
            Magic link sent! Please check your email. The link expires in 5
            minutes
          </span>
        </Match>
      </Switch>
    </Main>
  )
}

export default Login
