import { type AllRoomsRouteType } from '#backend/src/main'
import { createQuery } from '@tanstack/solid-query'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
import { hc } from 'hono/client'
import { For, Show } from 'solid-js'
import WaterRoomButton from './WaterRoomButton'

dayjs.extend(relativeTime)
dayjs.extend(advancedFormat)

const getRooms = async () => {
  const response = await hc<AllRoomsRouteType>(
    import.meta.env.VITE_BACKEND_BASE_URL
  ).rooms.$get()

  if (!response.ok) {
    throw new Error('Failed to fetch rooms')
  }

  return await response.json()
}

function AllRooms() {
  const queryResult = createQuery(() => ({
    queryKey: ['allRooms'],
    queryFn: getRooms,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
  }))

  return (
    <>
      <Show when={!!queryResult.data} fallback={<p>Loading...</p>}>
        <ul class="grid grid-cols-2 gap-4 lg:grid-cols-3">
          <For each={queryResult.data}>
            {(room) => (
              <li>
                <h4>{room.name}</h4>
                <p>{dayjs(room.lastWatered).format('ddd, MMM Do')}</p>
                <p>{dayjs(dayjs(room.lastWatered)).fromNow()}</p>
                <WaterRoomButton roomId={room.id} />
              </li>
            )}
          </For>
        </ul>
      </Show>
    </>
  )
}

export default AllRooms
