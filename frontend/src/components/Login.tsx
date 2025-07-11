import { useMutation } from '@tanstack/solid-query'
import { useNavigate } from '@solidjs/router'
import { type Component, createSignal, Show } from 'solid-js'
import { apiClient } from '../lib/api-client'
import type { LoginRouteType } from '#backend/src/main'

const Login: Component = () => {
  const [enteredPassword, setEnteredPassword] = createSignal('')
  const navigate = useNavigate()

  const {
    error,
    mutate: login,
    isPending,
  } = useMutation(() => ({
    mutationFn: async () => {
      const response = await apiClient<LoginRouteType>().api.login.$post({
        json: { password: enteredPassword() },
      })
      if (!response.ok) {
        throw new Error('Login failed')
      }
      return response.json()
    },
    onSuccess: (data) => {
      localStorage.setItem('plant-tracker-token', data.token)
      navigate('/')
    },
  }))

  return (
    <div>
      <h1 class="text-4xl">Please log in</h1>
      <form
        class="mt-8 flex flex-col items-center justify-center gap-4"
        on:submit={(e) => {
          e.preventDefault()
          login()
        }}
      >
        <label class="mx-auto flex w-fit flex-col gap-2 text-2xl font-bold text-cyan-900">
          Password
          <input
            on:change={(e) => setEnteredPassword(e.target.value)}
            type="password"
            class="rounded-lg border border-cyan-900 bg-cyan-50 p-2 text-base font-normal text-black"
          />
        </label>
        <button
          type="submit"
          class="mx-auto mt-4 w-fit rounded-lg bg-cyan-700 p-2 text-white"
          disabled={isPending}
        >
          {isPending ? 'Logging in...' : 'Log in'}
        </button>
        <Show when={error}>
          <span class="text-red-600">{error?.message}</span>
        </Show>
      </form>
    </div>
  )
}

export default Login
