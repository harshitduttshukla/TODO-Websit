import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Layout from './Layourt.jsx'
import About from './components/About/About.jsx'
import Home from './components/Home/Home.jsx'
import UserContextProvider from './context/UserContextProvider'
import Signup from './components/Signup/Signup.jsx'
import Signin from './components/Login/Signin.jsx'



const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>

      <Route path='about' element= {<About/>}/>
      <Route path='' element= {<Home/>}/>
      <Route path='Signup' element={ <Signup/>}/>
      <Route path='Signin' element={ <Signin/>}/>
       </Route>
  )
)
createRoot(document.getElementById('root')).render(
  <UserContextProvider>

    <RouterProvider router={router} />
    
   
  </UserContextProvider>
 
)
