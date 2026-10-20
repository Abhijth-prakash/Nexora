import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";

const ProtectedRoutes = () => {
  const { logged } = useAppSelector(
    (state) => state.userData
  );

  if (logged) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;