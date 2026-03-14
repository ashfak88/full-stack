import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!loggedInUser) {
    return <Navigate to="/login" replace />;
  }

  
  if (loggedInUser.status === "blocked") {
    localStorage.removeItem("loggedInUser");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
