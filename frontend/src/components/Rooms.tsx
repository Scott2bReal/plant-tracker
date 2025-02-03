import { type AllRoomsRouteType } from '#backend/src/main'
import { createQuery } from '@tanstack/solid-query'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Component, ErrorBoundary, For, Show } from 'solid-js'
import { apiClient } from '../lib/api-client'
import WaterRoomButton from './WaterRoomButton'

dayjs.extend(relativeTime)
dayjs.extend(advancedFormat)

interface Room {
  id: number
  name: string
  lastWatered: string
}

const Room: Component<Room> = (room) => (
  <li>
    <h4>{room.name}</h4>
    <p>{dayjs(room.lastWatered).format('ddd, MMM Do')}</p>
    <p>{dayjs(dayjs(room.lastWatered)).fromNow()}</p>
    <WaterRoomButton roomId={room.id} />
  </li>
)

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
          <ul class="grid grid-cols-2 gap-4 lg:grid-cols-3">
            <For each={queryResult.data}>{(room) => <Room {...room} />}</For>
          </ul>
        </Show>
      </ErrorBoundary>
    </>
  )
}

export default AllRooms
