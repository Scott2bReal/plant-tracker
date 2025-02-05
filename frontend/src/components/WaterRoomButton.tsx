import { WaterRoomRouteType } from '#backend/src/main'
import { createMutation, useQueryClient } from '@tanstack/solid-query'
import dayjs from 'dayjs'
import { IoWaterOutline } from 'solid-icons/io'
import { Component, createSignal, JSX } from 'solid-js'
import { apiClient } from '../lib/api-client'

type ExternalButtonAttributes = Omit<
  JSX.HTMLAttributes<HTMLButtonElement>,
  'isDire' | 'roomId' | 'children' | 'disabled'
>
interface WaterRoomButtonProps extends ExternalButtonAttributes {
  isDire: boolean
  roomId: number
}

const waterRoom = async (roomId: number) => {
  const response = await apiClient<WaterRoomRouteType>().rooms[
    ':id'
  ].water.$put({
    param: { id: String(roomId) },
    json: {
      lastWatered: dayjs().toISOString(),
    },
  })

  if (!response.ok) {
    throw new Error('Failed to water room')
  }

  return await response.json()
}

const WaterRoomButton: Component<WaterRoomButtonProps> = (props) => {
  const queryClient = useQueryClient()
  const waterRoomMutation = createMutation(() => ({
    mutationFn: async () => await waterRoom(props.roomId),
    mutationKey: ['waterRoom', props.roomId],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allRooms'] })
    },
  }))

  const [isLoading, setIsLoading] = createSignal(false)
  const toggleIsLoading = () => setIsLoading(!isLoading())

  return (
    <button
      title="Water room"
      disabled={isLoading()}
      class={props.class}
      data-isLoading={waterRoomMutation.isPending}
      data-isDire={props.isDire}
      on:click={() => {
        toggleIsLoading()
        setTimeout(() => {
          toggleIsLoading()
        }, 1000)
        // waterRoomMutation.mutate()
      }}
      {...props}
    >
      <span class="sr-only">Water room</span>
      <IoWaterOutline
        data-isLoading={isLoading()}
        class="mx-auto size-6 text-cyan-100 duration-300 ease-in-out data-[isLoading=true]:scale-75"
      />
    </button>
  )
}

export default WaterRoomButton
