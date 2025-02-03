import { RoomRouteType } from '#backend/src/main'
import { createQuery } from '@tanstack/solid-query'
import { hc } from 'hono/client'
import { Component, ErrorBoundary, Suspense } from 'solid-js'

const Room: Component<{ id: number }> = (props) => {
  const queryResult = createQuery(() => ({
    queryFn: async () => {
      const response = await hc<RoomRouteType>(
        import.meta.env.VITE_BACKEND_BASE_URL
      ).rooms[':id'].$get({
        param: { id: String(props.id) },
      })

      if (!response.ok && response.status === 404) {
        console.log("Connected to server, couldn't find room")
        throw new Error(`Room with ID ${props.id} not found`)
      }

      if (!response.ok) {
        console.log('Failed to fetch room')
        throw new Error('Failed to fetch room')
      }

      return response.json()
    },
    queryKey: ['room', props.id],
    retry: 3,
    staleTime: 1000 * 60 * 5,
    throwOnError: true,
  }))

  return (
    <>
      <h3>Room {props.id}</h3>
      <ErrorBoundary fallback={<div>{queryResult?.error?.message}</div>}>
        <Suspense fallback={<p>Loading...</p>}>
          <ul>
            <li>Room id: {queryResult.data?.id}</li>
            <li>Room name: {queryResult.data?.name}</li>
            <li>Room lastWatered: {queryResult.data?.lastWatered}</li>
          </ul>
        </Suspense>
      </ErrorBoundary>
    </>
  )
}

export default Room
