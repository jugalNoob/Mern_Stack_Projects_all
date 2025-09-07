

import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './page/Home';
import Live from "./page/Live"
import Data from "./page/Data"



// mankia@gmail.com
const router = createBrowserRouter([
  {

  
    path: "/", 
    element: <Home />
  },
  {
    path: "/live", 
    element: <Live />
  },

  {
    path: "/data", 
    element: <Data />
  },



])

function App() {
  return <RouterProvider router={router} />;
}

export default App;