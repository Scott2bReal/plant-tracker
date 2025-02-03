import { WaterRoomRouteType } from '#backend/src/main'
import { createMutation, useQueryClient } from '@tanstack/solid-query'
import dayjs from 'dayjs'
import { IoWaterOutline } from 'solid-icons/io'
import { Component } from 'solid-js'
import { apiClient } from '../lib/api-client'

interface WaterRoomButtonProps {
  isDire?: boolean
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
      class="mx-auto mt-2 w-full rounded bg-cyan-600 p-2 text-center text-white data-[isDire=true]:animate-pulse data-[isDire=true]:bg-red-600 lg:w-1/3"
      data-isLoading={waterRoomMutation.isPending}
      data-isDire={props.isDire}
      onClick={(e) => {
        e.preventDefault()
        waterRoomMutation.mutate()
      }}
    >
      <span class="sr-only">Water room</span>
      <IoWaterOutline
        data-isLoading={waterRoomMutation.isPending}
        class="mx-auto size-6 text-cyan-100 duration-300 ease-out data-[isLoading=true]:translate-y-1"
      />
    </button>
  )
}

export default WaterRoomButton
