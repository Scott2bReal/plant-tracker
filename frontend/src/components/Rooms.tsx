import { createQuery } from '@tanstack/solid-query'
import { Show } from 'solid-js'
import { apiFetch } from '../lib/api-fetch'

function AllRooms() {
  const queryResult = createQuery(() => ({
    queryKey: ['allRooms'],
    queryFn: () => apiFetch('/rooms'),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
  }))

  return (
    <>
      <h3>All Rooms</h3>
      <Show when={!!queryResult.data} fallback={<p>Loading...</p>}>
        <pre>{JSON.stringify(queryResult.data, null, 2)}</pre>
      </Show>
    </>
  )
}

export default AllRooms
