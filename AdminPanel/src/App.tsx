import { Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import ForgetPassword from "./pages/ForgetPassword"
import ResetPassword from "./pages/ResetPassword"
import ViewUsers from "./pages/users/ViewUsers"
import Category from "./pages/category/Category"

import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import CategoryDetails from "./pages/category/CategoryDetails"
import Product from "./pages/products/Product"
import PublicRoute from "./components/PublicRoute"
import ProductDetails from "./pages/products/ProductDetails"
import Coupon from "./pages/coupon/Coupon"
import CouponDetails from "./pages/coupon/CouponDetails"



function App() {


  return (
    <>

    <Routes>

      <Route element={<PublicRoute />}>
      <Route path="/" element={<Login></Login>}></Route>
      <Route path="/forgetpassword" element={<ForgetPassword></ForgetPassword>}></Route>
      <Route path="/resetpassword" element={<ResetPassword></ResetPassword>}></Route>
      </Route>

     
      <Route path="/dashboard" element={<Dashboard></Dashboard>}></Route>
      <Route path="/admin/users/view" element={<ViewUsers></ViewUsers>}></Route>

      <Route path="/admin/category" element={<Category></Category>}></Route>
      <Route path="/admin/category/:id" element={<CategoryDetails></CategoryDetails>}></Route>

      <Route path="/admin/products" element={<Product></Product>}></Route>
      <Route path="/admin/products/:id" element={<ProductDetails></ProductDetails>}></Route>


      <Route path="/admin/coupon" element={<Coupon></Coupon>}></Route>
      <Route path="/admin/coupon/:id" element={<CouponDetails></CouponDetails>}></Route>



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
