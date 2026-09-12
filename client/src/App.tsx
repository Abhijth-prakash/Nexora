import {   Route, Routes } from "react-router-dom"
import "./App.css"
import Register from "./pages/Register"
import Home from "./pages/Home"
import OtpVerify from "./pages/OtpVerify"
import Login from "./pages/Login"

function App() {
  return (
    <>

      <Routes>
        <Route
          path="/" element={<Home />}
        />
        <Route path="/auth/register" element={<Register />}/>
        <Route path="/auth/verify" element={<OtpVerify />}/>
        <Route path="/auth/register" element={<Register />}/>
        <Route path="/auth/login" element={<Login />}/>
      </Routes>
    </>
  )
}

export default App