import { useMutation } from '@tanstack/solid-query'
import { type Component, createSignal, Match, Switch } from 'solid-js'
import { authClient } from '../lib/auth-client'

const Login: Component = () => {
  const [enteredEmail, setEnteredEmail] = createSignal('')

  const sendMagicLink = async () => {
    return await authClient.signIn.magicLink({ email: enteredEmail() })
  }

  const loginMutation = useMutation(() => ({
    mutationFn: sendMagicLink,
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
    <Switch
      fallback={
        <>
          <h1 class="text-4xl">Please log in</h1>
          <form
            class="mt-8 flex flex-col items-center justify-center gap-4"
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
                class="rounded-lg border border-cyan-900 bg-cyan-50 p-2 text-base font-normal text-black"
              />
            </label>
            <button
              type="submit"
              class="mx-auto mt-4 w-fit rounded-lg bg-cyan-700 p-2 text-white"
            >
              Send magic link
            </button>
          </form>
        </>
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
  )
}

export default Login
