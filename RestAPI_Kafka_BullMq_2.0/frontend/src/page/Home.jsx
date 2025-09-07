import React from 'react'
import { NavLink } from 'react-router-dom'

function Home() {
  return (
    <div>

<NavLink to='/'>Home</NavLink>
<br />

<NavLink to='/get'>GetYour</NavLink>

<br />
<NavLink to='/form'>form</NavLink>
<br />
<NavLink to='/update'>update</NavLink>
<br />
<NavLink to="/delete">delete</NavLink>
    </div>
  )
}

export default Home
