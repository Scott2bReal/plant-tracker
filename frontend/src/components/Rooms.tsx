import { type AllRoomsRouteType } from '#backend/src/main'
import { createQuery } from '@tanstack/solid-query'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Component, createMemo, ErrorBoundary, For, Show } from 'solid-js'
import { apiClient } from '../lib/api-client'
import WaterRoomButton from './WaterRoomButton'

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

  return (
    <li class="text-cyan-900">
      <h4 class="text-lg font-semibold">{room.name}</h4>
      <p class="text-xl lg:text-2xl">
        {dayjs(room.lastWatered).format('ddd, MMM Do')}
      </p>
      <p class="italic">{dayjs(dayjs(room.lastWatered)).fromNow()}</p>
      <WaterRoomButton isDire={isDire()} roomId={room.id} />
    </li>
  )
}

const getRooms = async () => {
  const response = await apiClient<AllRoomsRouteType>().rooms.$get()

  if (!response.ok) {
    throw new Error('Failed to fetch rooms')
  }

  return await response.json()
}

function AllRooms() {
  const queryResult = createQuery(() => ({
    queryKey: ['allRooms'],
    queryFn: getRooms,
    staleTime: 1000 * 60, // 1 minute
  }))

  return (
    <>
      <ErrorBoundary fallback={<p>Error loading rooms :(</p>}>
        <Show when={!!queryResult.data} fallback={<p>Loading...</p>}>
          <ul class="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3">
            <For each={queryResult.data}>{(room) => <Room {...room} />}</For>
          </ul>
        </Show>
      </ErrorBoundary>
    </>
  )
}

export default AllRooms
