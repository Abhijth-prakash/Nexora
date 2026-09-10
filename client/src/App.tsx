
import { Link, Route, Routes } from 'react-router-dom'
import './App.css'
import Register from './pages/Register'
import Home from './pages/Home'

function App() {

  

  return (
    <>
    <h1>this is frontend</h1>
    <Link to={'/auth/register'}>register</Link>
    <Routes>
      <Route path='/auth/register' element={<Register></Register>}></Route>
      <Route path='/home' element={<Home></Home>}></Route>
    </Routes>
  
    </>
  )
}

export default App
