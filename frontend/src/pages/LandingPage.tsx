import { Component } from 'solid-js'
import '../App.css'
import AllRooms from '../components/AllRooms'
import Main from '../components/Main'

const LandingPage: Component = () => {
  return (
    <Main>
      <AllRooms />
    </Main>
  )
}

export default LandingPage
