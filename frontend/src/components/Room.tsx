import { RoomRouteType } from '#backend/src/main'
import { createQuery } from '@tanstack/solid-query'
import { Component, ErrorBoundary, Suspense } from 'solid-js'
import { apiClient } from '../lib/api-client'

const getRoom = async (id: number) => {
  const response = await apiClient<RoomRouteType>().rooms[':id'].$get({
    param: { id: String(id) },
  })
  if (!response.ok && response.status === 404) {
    console.log("Connected to server, couldn't find room")
    throw new Error(`Room with ID ${id} not found`)
  }

  if (!response.ok) {
    console.log('Failed to fetch room')
    throw new Error('Failed to fetch room')
  }

  return await response.json()
}

const Room: Component<{ id: number }> = (props) => {
  const queryResult = createQuery(() => ({
    queryFn: async () => await getRoom(props.id),
    queryKey: ['room', props.id],
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
