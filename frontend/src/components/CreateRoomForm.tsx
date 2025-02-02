import { Component } from 'solid-js'

const CreateRoomForm: Component = () => {
  // const [name, setName] = createSignal<string>('')
  // const mutationFn = async () => {
  //   const response = await hc<CreateRoomRouteType>(
  //     import.meta.env.VITE_BACKEND_BASE_URL
  //   ).rooms.create.$post({
  //     json: {
  //       name: name(),
  //     },
  //   })
  //
  //   return await response.json()
  // }

  // const createRoomMutation = createMutation(() => ({
  //   mutationFn,
  //   mutationKey: ['createRoom'],
  //   onMutate: async () => {
  //   },
  //   onError: (e) => {
  //     console.error(e)
  //   },
  //   onSuccess: async (newRoom) => {
  //     setName('')
  //   }
  // }))

  return null
}

export default CreateRoomForm
