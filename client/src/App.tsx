import {   Route, Routes } from "react-router-dom"
import Register from "./pages/Register"
import Home from "./pages/Home"
import OtpVerify from "./pages/OtpVerify"
import Login from "./pages/Login"
import Forgetpass from "./pages/Forgetpass"
import Resetpass from "./pages/Resetpass"
import Profile from "./pages/Profile"
import Address from "./pages/Address/Address"

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


        <Route path="/myprofile" element={<Profile />}/>
        <Route path="/profile/address" element={<Address />}/>
      </Routes>
    </>
  )
}

export default App