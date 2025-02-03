import { CreateRoomRouteType } from '#backend/src/main'
import { createMutation } from '@tanstack/solid-query'
import { hc } from 'hono/client'
import { Component, createSignal } from 'solid-js'
import { queryClient } from '..'

const CreateRoomForm: Component = () => {
  const [name, setName] = createSignal<string>('')

  const mutationFn = async () => {
    const response = await hc<CreateRoomRouteType>(
      import.meta.env.VITE_BACKEND_BASE_URL
    ).rooms.create.$post({
      json: {
        name: name(),
      },
    })

    return await response.json()
  }

  const createRoomMutation = createMutation<typeof mutationFn>(() => ({
    mutationFn,
    mutationKey: ['createRoom'],
    onSuccess: () => {
      setName('')
      queryClient.invalidateQueries({ queryKey: ['allRooms'] })
    },
  }))

  return (
    <form
      on:submit={(e) => {
        e.preventDefault()
        createRoomMutation.mutate()
      }}
    >
      <input
        type="text"
        value={name()}
        onInput={(e) => setName(e.currentTarget.value)}
        class="rounded-md border border-gray-300"
      />
      <button class="rounded-md bg-blue-500 px-4 py-2 text-white" type="submit">
        Create Room
      </button>
    </form>
  )
}

export default CreateRoomForm
