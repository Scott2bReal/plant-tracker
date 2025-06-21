import { useMutation, useQueryClient } from '@tanstack/solid-query'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
import { IoWaterOutline } from 'solid-icons/io'
import { type Component, createMemo, createSignal } from 'solid-js'
import type { WaterRoomRouteType } from '#backend/src/main'
import { apiClient } from '../lib/api-client'

dayjs.extend(relativeTime)
dayjs.extend(advancedFormat)

interface Room {
  id: number
  name: string
  lastWatered: string
}

const Room: Component<Room> = (room) => {
  const isDire = createMemo(() =>
    dayjs(room.lastWatered).isBefore(dayjs().subtract(1, 'week'))
  )

  const waterRoom = async () => {
    const response = await apiClient<WaterRoomRouteType>().api.rooms[
      ':id'
    ].water.$put({
      param: { id: String(room.id) },
      json: {
        lastWatered: dayjs().toISOString(),
      },
    })
    if (!response.ok) {
      throw new Error('Failed to water room')
    }
    return await response.json()
  }

  const [isPressed, setIsPressed] = createSignal(false)
  const press = () => setIsPressed(true)
  const unpress = () => setIsPressed(false)

  const queryClient = useQueryClient()
  const waterRoomMutation = useMutation(() => ({
    mutationFn: waterRoom,
    mutationKey: ['waterRoom', room.id],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allRooms'] })
    },
  }))

  return (
    <div class="relative mx-auto grid w-full grid-cols-3 items-center pb-2 text-cyan-900">
      <div class="col-span-2 text-left">
        <h2 class="whitespace-nowrap text-xl font-semibold lg:text-3xl">
          {room.name}
        </h2>
        <p
          data-isLoading={waterRoomMutation.isPending}
          class="text-lg italic transition duration-100 ease-in data-[isLoading=true]:animate-pulse data-[isLoading=true]:blur-sm lg:text-2xl"
        >
          {dayjs(dayjs(room.lastWatered)).fromNow()}
        </p>
        <p
          class="ml-2 italic transition duration-100 ease-in data-[isLoading=true]:animate-pulse data-[isLoading=true]:blur-sm lg:text-xl"
          data-isLoading={waterRoomMutation.isPending}
        >
          on{' '}
          <span class="font-semibold">
            {dayjs(room.lastWatered).format('ddd, MMM Do')}
          </span>
        </p>
      </div>

      <button
        type="button"
        title="Water room"
        class="mx-auto h-1/2 w-full scale-100 rounded bg-cyan-600 p-2 text-center text-white shadow-md shadow-cyan-800 transition duration-100 ease-in-out disabled:cursor-not-allowed disabled:bg-cyan-600/50 data-[pressed=true]:scale-95 data-[isDire=true]:animate-pulse data-[isDire=true]:bg-red-600 lg:data-[pressed=false]:hover:scale-105 lg:data-[pressed=false]:disabled:hover:scale-100"
        disabled={waterRoomMutation.isPending}
        data-isLoading={waterRoomMutation.isPending}
        data-isDire={isDire()}
        data-pressed={isPressed()}
        on:pointerdown={press}
        on:pointerup={unpress}
        on:pointerleave={unpress}
        on:click={() => {
          waterRoomMutation.mutate()
        }}
      >
        <span class="sr-only">Water room</span>
        <IoWaterOutline class="mx-auto size-6 text-cyan-100 duration-300 ease-in-out" />
      </button>
      <div class="absolute bottom-0 left-4 mx-auto h-px w-[90%] bg-teal-cycle" />
    </div>
  )
}

export default Room
