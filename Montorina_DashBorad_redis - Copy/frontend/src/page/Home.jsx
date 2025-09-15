import React from 'react'
import { NavLink } from 'react-router-dom'

function Home() {
  return (
    <div>

<NavLink to='/'>Home</NavLink>
<br />

<NavLink to='/get'>GetYour</NavLink>


    </div>
  )
}

export default Home