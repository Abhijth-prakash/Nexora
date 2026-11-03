import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";

export const ProtectedRoutes = () => {
  const { logged } = useAppSelector(
    (state) => state.userData
  );

  if (logged) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};




export const PaymentRoutes = ()=>{
  const {orderId}= useAppSelector(state=> state.orderData)


  if(!orderId){
    console.log('het replace this ')
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

