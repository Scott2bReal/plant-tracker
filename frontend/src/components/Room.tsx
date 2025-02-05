import { WaterRoomRouteType } from '#backend/src/main'
import { createMutation, useQueryClient } from '@tanstack/solid-query'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
import { IoWaterOutline } from 'solid-icons/io'
import { Component, createMemo, createSignal } from 'solid-js'
import { apiClient } from '../lib/api-client'

dayjs.extend(relativeTime)
dayjs.extend(advancedFormat)

interface Room {
  id: number
  name: string
  lastWatered: string
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

const Room: Component<Room> = (room) => {
  const isDire = createMemo(() =>
    dayjs(room.lastWatered).isBefore(dayjs().subtract(1, 'week'))
  )

  const [isPressed, setIsPressed] = createSignal(false)
  const press = () => setIsPressed(true)
  const unpress = () => setIsPressed(false)

  const queryClient = useQueryClient()
  const waterRoomMutation = createMutation(() => ({
    mutationFn: async () => await waterRoom(room.id),
    mutationKey: ['waterRoom', room.id],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allRooms'] })
    },
  }))

  return (
    <li class="mx-auto grid w-full grid-cols-3 items-center text-cyan-900">
      <div class="col-span-2 text-left">
        <h4 class="whitespace-nowrap text-xl font-semibold lg:text-3xl">
          {room.name}
        </h4>
        <p
          data-isLoading={waterRoomMutation.isPending}
          class="italic transition duration-100 ease-in data-[isLoading=true]:animate-pulse data-[isLoading=true]:blur-sm lg:text-xl"
        >
          {dayjs(dayjs(room.lastWatered)).fromNow()}
        </p>
        <p
          class="italic transition duration-100 ease-in data-[isLoading=true]:animate-pulse data-[isLoading=true]:blur-sm lg:text-xl"
          data-isLoading={waterRoomMutation.isPending}
        >
          on {dayjs(room.lastWatered).format('ddd, MMM Do')}
        </p>
      </div>

      <button
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
    </li>
  )
}

export default Room
