import { Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"


function App() {


  return (
    <>

    <Routes>
      <Route path="/" element={<Login></Login>}></Route>

      <Route path="/dashboard" element={<Dashboard></Dashboard>}></Route>

    </Routes>
     
    </>
  )
}

export default App
