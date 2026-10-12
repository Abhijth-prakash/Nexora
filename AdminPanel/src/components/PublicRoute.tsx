import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";

const PublicRoute = () => {
  const { Authenticated } = useAppSelector(
    (state) => state.AdminData
  );

  if (Authenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;