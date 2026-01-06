import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route } from 'react-router-dom';
import LandingPage from './Pages/LandingPage';
import CarNotFound from './Pages/carNotFound';
import AdminLayout from "./Pages/AdminPage";
import ShowCar from './Pages/showCar';
import SavedCarsPage from './Pages/SavedCarsPage';
import ShowACarPage from './Pages/ShowACarPage';
import TestDrive from './Pages/TestDrive';
import ReservationsPage from "./Pages/ReservationsPage";
import Signin from './Pages/Signin';
import { toast, ToastContainer } from "react-toastify";


function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Routes>
        <Route path="/" element={<LandingPage/>}></Route>
        <Route path="/mismatch" element={<CarNotFound/>}></Route>
        <Route path="/admin" element={<AdminLayout/>}></Route>
        <Route path="/cars" element={<ShowCar/>}></Route>
        <Route path="/saved-cars" element={<SavedCarsPage/>}></Route>
        <Route path="/cars/:id" element={<ShowACarPage/>}></Route>
        <Route path="/test-drive/:id" element={<TestDrive/>}></Route>
        <Route path="/reservations" element={<ReservationsPage/>}></Route>
        <Route path="/sign-in" element={<Signin/>}></Route>
      </Routes>
      <ToastContainer
        position="top-right"
        closeOnClick
        pauseOnHover
        theme="colored"
        toastClassName="responsive-toast"
        className="toast-container Toastify__toast-container"
      />
    </div>
  )
}

export default App
