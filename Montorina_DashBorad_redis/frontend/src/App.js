import React from 'react'
import {
  createBrowserRouter, RouterProvider
} from 'react-router-dom'

import Get from './page/Get'
import Home from "./page/Home"




const router=createBrowserRouter([  /// install react router https://medium.com/@adebayosilas/introduction-to-react-router-v6-4-6-11-1-f56c7710282e
  
  {

    path:'/',
    element:<Home/>
  },

  {
    path:'/get',
    element:<Get/>
  },


])

function App(){
  return <RouterProvider router={router} />
}
export default App