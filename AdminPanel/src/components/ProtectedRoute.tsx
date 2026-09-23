import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAppSelector } from "../redux/hooks"

const ProtectedRoute = () => {
  const {Authenticated} = useAppSelector(state=> state.AdminData)

  const location = useLocation()

  if (!Authenticated) {
    return (
      <Navigate
        to="/"
        replace
        state={{ from: location }}
      />
    )
  }

  return <Outlet />
}

export default ProtectedRoute