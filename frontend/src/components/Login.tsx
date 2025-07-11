import { useMutation } from '@tanstack/solid-query'
import { useNavigate } from '@solidjs/router'
import { type Component, createSignal, Show } from 'solid-js'
import { apiClient } from '../lib/api-client'
import type { LoginRouteType } from '#backend/src/main'

const Login: Component = () => {
  const [enteredPassword, setEnteredPassword] = createSignal('')
  const navigate = useNavigate()

  const loginMutation = useMutation(() => ({
    mutationFn: async () => {
      const response = await apiClient<LoginRouteType>().api.login.$post({
        json: { password: enteredPassword() },
      })
      const json = await response.json()
      if ('error' in json) {
        throw new Error(`${json.error}`)
      }
      return json
    },
    onSuccess: (data) => {
      if ('token' in data) {
        localStorage.setItem('plant-tracker-token', data.token)
        navigate('/')
      }
    },
  }))

  return (
    <div>
      <h1 class="text-4xl">Please log in</h1>
      <form
        class="mt-8 flex flex-col items-center justify-center gap-4"
        on:submit={(e) => {
          e.preventDefault()
          loginMutation.mutate()
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
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? 'Logging in...' : 'Log in'}
        </button>
        <Show when={loginMutation.isError}>
          <span class="text-red-600">{loginMutation.error?.message}</span>
        </Show>
      </form>
    </div>
  )
}

export default Login
