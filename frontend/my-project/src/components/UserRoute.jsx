import { Navigate } from "react-router-dom";

const UserRoute = ({ children }) => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    
    if (loggedInUser && loggedInUser.role === "admin") {
        return <Navigate to="/admin" replace />;
    }

    
    return children;
};

export default UserRoute;
