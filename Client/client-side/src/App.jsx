import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from 'react'
import api from './api'
import Connection from './connection'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from "./pages/dashboard";
import ReportLost from "./pages/ReportLost";
import MyLostItems from "./pages/MyLostItems";
import ReportFound from "./pages/ReportFound";
import MyFoundItems from "./pages/MyFoundItems";
function App() {
  

  return (
    <BrowserRouter>

      <Routes>
        <Route path="/"  element = {<Connection/>} />

        <Route path="/Register" element={<Register />} />

        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/lost-item" element={<ReportLost />} />

        <Route path="/see-lost-item" element={<MyLostItems />} />

        <Route path="/found-item" element={<ReportFound />} />

        <Route path="/see-found-item" element={<MyFoundItems />} />


      </Routes>

    </BrowserRouter>
  )
}

export default App
