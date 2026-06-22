import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

function ProtectedRoute({
  children,
  allowedRoles,
}) {

  const user =
    useAuthStore(
      (state) => state.user
    );

  const role =
    useAuthStore(
      (state) => state.role
    );

  if (!user || !role) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (
    allowedRoles &&
    !allowedRoles.includes(role)
  ) {

    if (role === "admin") {
      return (
        <Navigate
          to="/admin/dashboard"
          replace
        />
      );
    }

    if (role === "penjual") {
      return (
        <Navigate
          to="/penjual/dashboard"
          replace
        />
      );
    }

    if (role === "pembeli") {
      return (
        <Navigate
          to="/pembeli/dashboard"
          replace
        />
      );
    }

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;