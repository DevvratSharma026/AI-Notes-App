import './App.css'
import React from'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import NavBar from './components/NavBar';
import Home from './components/Home';
import Paste from './components/Paste'
import ViewPaste from './components/ViewPaste';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import Signup from './components/Signup';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: (
        <div className="app-content">
          <PrivateRoute>
            <div>
              <NavBar />
              <Home />
            </div>
          </PrivateRoute>
        </div>
      ),
    },
    {
      path: '/pastes',
      element: (
        <div className="app-content">
          <PrivateRoute>
            <div>
              <NavBar />
              <Paste />
            </div>
          </PrivateRoute>
        </div>
      ),
    },
    {
      path: '/pastes/:id',
      element: (
        <div className="app-content">
          <PrivateRoute>
            <div>
              <NavBar />
              <ViewPaste />
            </div>
          </PrivateRoute>
        </div>
      ),
    },
    {
      path: '/login',
      element: (
        <Login />
      ),
    },
    {
      path: '/signup',
      element: (
        <Signup />
      ),
    },
    // ... add signup and other public routes here ...
  ]
);

function App() {


  return (
    <RouterProvider router={router}/>
  )
}

export default App
