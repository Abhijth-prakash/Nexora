import { Route, Routes } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import Register from "./pages/Register"
import Home from "./pages/Home"
import OtpVerify from "./pages/OtpVerify"
import Login from "./pages/Login"
import Forgetpass from "./pages/Forgetpass"
import Resetpass from "./pages/Resetpass"
import Profile from "./pages/Profile"
import Address from "./pages/Address/Address"
import ChangePass from "./pages/Profile/ChangePass"

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/auth/register"
          element={<Register />}
        />

        <Route
          path="/auth/verify"
          element={<OtpVerify />}
        />

        <Route
          path="/auth/login"
          element={<Login />}
        />

        <Route
          path="/auth/forgetpass"
          element={<Forgetpass />}
        />

        <Route
          path="/auth/resetpass"
          element={<Resetpass />}
        />

        <Route
          path="/myprofile"
          element={<Profile />}
        />

        <Route
          path="/profile/address"
          element={<Address />}
        />

        <Route
          path="/profile/changePasswprd"
          element={<ChangePass />}
        />


      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="light"
      />
    </>
  )
}

export default App