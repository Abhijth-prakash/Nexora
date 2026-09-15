import { Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import ForgetPassword from "./pages/ForgetPassword"
import ResetPassword from "./pages/ResetPassword"


function App() {


  return (
    <>

    <Routes>
      <Route path="/" element={<Login></Login>}></Route>

      <Route path="/dashboard" element={<Dashboard></Dashboard>}></Route>
      <Route path="/forgetpassword" element={<ForgetPassword></ForgetPassword>}></Route>
      <Route path="/resetpassword" element={<ResetPassword></ResetPassword>}></Route>

    </Routes>
     
    </>
  )
}

export default App
