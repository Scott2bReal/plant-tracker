import { type AllRoomsRouteType } from '#backend/src/main'
import { createQuery } from '@tanstack/solid-query'
import { ErrorBoundary, For, Show } from 'solid-js'
import { apiClient } from '../lib/api-client'
import Room from './Room'

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
          <ul class="mx-auto flex max-w-[500px] flex-col gap-y-4">
            <For each={queryResult.data}>{(room) => <Room {...room} />}</For>
          </ul>
        </Show>
      </ErrorBoundary>
    </>
  )
}

export default AllRooms
