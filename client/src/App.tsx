import { Link, Navigate, Route, Routes } from "react-router-dom"
import "./App.css"
import Register from "./pages/Register"
import Home from "./pages/Home"
import OtpVerify from "./pages/OtpVerify"

function App() {
  return (
    <>

      <Link to="/auth/register">Register</Link>

      <Routes>
        <Route
          path="/"
          element={<Navigate to="/auth/register" replace />}
        />

        <Route
          path="/auth/register"
          element={<Register />}
        />

        <Route
          path="/auth/verify"
          element={<OtpVerify />}
        />

        <Route
          path="/home"
          element={<Home />}
        />
      </Routes>
    </>
  )
}

export default App