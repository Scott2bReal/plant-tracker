import { Component, JSXElement } from 'solid-js'
import Hero from './Hero'

const Main: Component<{ children: JSXElement }> = (props) => {
  return (
    <main class="px-4 text-center md:px-8">
      <Hero />
      {props.children}
    </main>
  )
}

export default Main
