import React from 'react'
import {
  createBrowserRouter, RouterProvider
} from 'react-router-dom'

import Form from "./page/Form"
import Get from './page/Get'
import Home from "./page/Home"
import Update from './page/Update'
import Detele from './page/Detele'



const router=createBrowserRouter([  /// install react router https://medium.com/@adebayosilas/introduction-to-react-router-v6-4-6-11-1-f56c7710282e
  
  {

    path:'/',
    element:<Home/>
  },

  {
    path:'/get',
    element:<Get/>
  },

  {
    path:'/form',
    element:<Form/>
  }
  ,
  {
    path:'/update',
    element:<Update/>
  },

  {
    path:'/delete',
    element:<Detele/>
  }

])

function App(){
  return <RouterProvider router={router} />
}
export default App