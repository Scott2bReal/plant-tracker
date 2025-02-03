import { CreateRoomRouteType } from '#backend/src/main'
import { createMutation, useQueryClient } from '@tanstack/solid-query'
import { hc } from 'hono/client'
import { Component, createSignal } from 'solid-js'

interface Room {
  id: number
  name: string
  lastWatered: string
}

const optimisticlyUpdateData = (rooms: Room[], newRoom: Room) => {
  return rooms.filter((room) => room.id !== newRoom.id).concat(newRoom)
}

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

  const queryClient = useQueryClient()
  const createRoomMutation = createMutation<Room>(() => ({
    mutationFn,
    mutationKey: ['createRoom'],
    onSuccess: (newRoom) => {
      setName('')
      queryClient.invalidateQueries({ queryKey: ['allRooms'] })
      queryClient.setQueryData<Room[]>(['allRooms'], (rooms) => {
        if (!rooms) {
          return [newRoom]
        }
        return optimisticlyUpdateData(rooms, newRoom)
      })
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
