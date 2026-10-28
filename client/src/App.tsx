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
import EditProfile from "./pages/Profile/EditProfile"
import Product from "./pages/Products/Product"
import ProductList from "./pages/Products/ProductList"
import Cart from "./pages/cart/Cart"
import ProtectedRoutes from "./components/ProtectedRoutes"
import NotFound from "./pages/NotFound"
import MainLayout from "./components/layouts/MainLayout"
import Checkout from "./pages/orders/Checkout"


function App() {
  return (
    <>
      <Routes>
        {/* auth */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/forgetpass" element={<Forgetpass />} />
          <Route path="/auth/resetpass" element={<Resetpass />} />
        </Route>

        <Route path="/auth/verify" element={<OtpVerify />} />

     
        <Route element={<MainLayout />}>
          {/* home */}
          <Route path="/" element={<Home />} />

          {/* profile */}
          <Route path="/myprofile" element={<Profile />} />
          <Route path="/profile/address" element={<Address />} />
          <Route path="/profile/changePassword" element={<ChangePass />} />
          <Route path="/profile/editProfile" element={<EditProfile />} />

          {/* products */}
          <Route path="/category/products/:slug" element={<ProductList />} />
          <Route path="/product/:id" element={<Product />} />

          {/* cart */}
          <Route path="/users/cart" element={<Cart />} />


          {/* order */}
          <Route path="/users/Checkout" element={<Checkout />} />

          {/* 404 catch-all */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} theme="light" />
    </>
  )
}

export default App