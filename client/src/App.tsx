import {   Route, Routes } from "react-router-dom"
import "./App.css"
import Register from "./pages/Register"
import Home from "./pages/Home"
import OtpVerify from "./pages/OtpVerify"
import Login from "./pages/Login"
import Forgetpass from "./pages/Forgetpass"
import Resetpass from "./pages/Resetpass"

function App() {
  return (
    <>

      <Routes>
        <Route
          path="/" element={<Home />}
        />
        <Route path="/auth/register" element={<Register />}/>
        <Route path="/auth/verify" element={<OtpVerify />}/>
        <Route path="/auth/login" element={<Login />}/>
        <Route path="/auth/forgetpass" element={<Forgetpass />}/>
        <Route path="/auth/resetpass" element={<Resetpass />}/>
      </Routes>
    </>
  )
}

export default App