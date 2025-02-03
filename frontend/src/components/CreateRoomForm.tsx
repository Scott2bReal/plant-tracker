import { CreateRoomRouteType } from '#backend/src/main'
import { createMutation, useQueryClient } from '@tanstack/solid-query'
import { Component, createSignal } from 'solid-js'
import { apiClient } from '../lib/api-client'

interface Room {
  id: number
  name: string
  lastWatered: string
}

const createRoom = async (name: string) => {
  const response = await apiClient<CreateRoomRouteType>().rooms.create.$post({
    json: {
      name,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to create room')
  }

  return await response.json()
}

const CreateRoomForm: Component = () => {
  const [name, setName] = createSignal<string>('')

  const queryClient = useQueryClient()
  const createRoomMutation = createMutation<Room>(() => ({
    mutationFn: async () => createRoom(name()),
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
