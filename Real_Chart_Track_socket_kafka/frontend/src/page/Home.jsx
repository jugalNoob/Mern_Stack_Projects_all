import React from 'react'
import { NavLink } from 'react-router-dom'

function Home() {
  return (
    <div>
      <h1>jugal</h1>
      <NavLink to="/">Home</NavLink>
      <br />
      <NavLink to="/live">Live</NavLink>
      <br />
      <NavLink to="/data">data</NavLink>
    </div>
  )
}

export default Home
