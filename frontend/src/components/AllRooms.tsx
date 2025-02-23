import { type AllRoomsRouteType } from '#backend/src/main'
import { useNavigate } from '@solidjs/router'
import { createQuery } from '@tanstack/solid-query'
import { createEffect, For, Show } from 'solid-js'
import { apiClient } from '../lib/api-client'
import Room from './Room'

function AllRooms() {
  const getRooms = async () => {
    const response = await apiClient<AllRoomsRouteType>().rooms.$get()

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized')
      }
      throw new Error('Failed to fetch rooms')
    }

    return await response.json()
  }
  const queryResult = createQuery(() => ({
    queryKey: ['allRooms'],
    queryFn: getRooms,
    staleTime: 1000 * 60, // 1 minute
    throwOnError: true,
  }))

  const navigate = useNavigate()
  createEffect(() => {
    if (queryResult.error?.message === 'Unauthorized') {
      navigate('/login')
    }
  })

  return (
    <Show when={!!queryResult.data} fallback={<p>Loading...</p>}>
      <ul class="mx-auto flex max-w-[500px] flex-col gap-y-4">
        <For each={queryResult.data}>
          {(room) => (
            <li>
              <Room {...room} />
            </li>
          )}
        </For>
      </ul>
    </Show>
  )
}

export default AllRooms
