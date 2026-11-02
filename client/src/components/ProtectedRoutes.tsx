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
    console.log('replcae')
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

