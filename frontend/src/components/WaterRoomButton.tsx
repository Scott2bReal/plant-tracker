import { WaterRoomRouteType } from '#backend/src/main'
import { createMutation, useQueryClient } from '@tanstack/solid-query'
import dayjs from 'dayjs'
import { IoWaterOutline } from 'solid-icons/io'
import { Component } from 'solid-js'
import { apiClient } from '../lib/api-client'

interface WaterRoomButtonProps {
  roomId: number
}

const now = dayjs().toISOString()

const waterRoom = async (roomId: number) => {
  const response = await apiClient<WaterRoomRouteType>().rooms[
    ':id'
  ].water.$post({
    param: { id: String(roomId) },
    json: {
      lastWatered: now,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to water room')
  }

  const json = await response.json()

  return json
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
      data-isLoading={waterRoomMutation.isPending}
      onClick={(e) => {
        e.preventDefault()
        waterRoomMutation.mutate()
      }}
    >
      <span class="sr-only">Water room</span>
      <IoWaterOutline
        data-isLoading={waterRoomMutation.isPending}
        class="size-6 duration-300 ease-in-out data-[isLoading=true]:translate-y-1"
      />
    </button>
  )
}

export default WaterRoomButton
