import { WaterRoomRouteType } from '#backend/src/main'
import { createMutation, useQueryClient } from '@tanstack/solid-query'
import dayjs from 'dayjs'
import { hc } from 'hono/client'
import { Component } from 'solid-js'

interface WaterRoomButtonProps {
  roomId: number
}

const now = dayjs().toISOString()

const waterRoom = async (roomId: number) => {
  const response = await hc<WaterRoomRouteType>(
    import.meta.env.VITE_BACKEND_BASE_URL
  ).rooms[':id'].water.$post({
    param: { id: String(roomId) },
    json: {
      lastWatered: now,
    },
  })
  if (!response.ok) {
    throw new Error('Failed to water room')
  }

  return await response.json()
}

const WaterRoomButton: Component<WaterRoomButtonProps> = (props) => {
  const queryClient = useQueryClient()
  const waterRoomMutation = createMutation<typeof waterRoom>(() => ({
    mutationFn: async () => waterRoom(props.roomId),
    mutationKey: ['waterRoom', props.roomId],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allRooms'] })
    },
  }))

  return (
    <button
      title="Water room"
      class="rounded bg-blue-600 p-2 text-white"
      onClick={(e) => {
        e.preventDefault()
        waterRoomMutation.mutate()
      }}
    >
      Water
    </button>
  )
}

export default WaterRoomButton
