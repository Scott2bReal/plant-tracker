import { type AllRoomsRouteType } from '#backend/src/main'
import { createQuery } from '@tanstack/solid-query'
import { hc } from 'hono/client'
import { For, Show } from 'solid-js'

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
      <h3>All Rooms</h3>
      <Show when={!!queryResult.data} fallback={<p>Loading...</p>}>
        <ul>
          <For each={queryResult.data}>
            {(room) => (
              <li>
                <h4>{room.name}</h4>
                <p>{room.lastWatered}</p>
              </li>
            )}
          </For>
        </ul>
      </Show>
    </>
  )
}

export default AllRooms
