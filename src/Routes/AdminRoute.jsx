import { Navigate, useLocation } from "react-router-dom";
import PropTypes from 'prop-types';
import useAuth from "../Hooks/useAuth";
import useRole from "../Hooks/useRole";

const AdminRoute = ({ children }) => {

    const { user, loading, logoutUser } = useAuth();
    const [status, isRolePending] = useRole();
    console.log(status);
    const location = useLocation();

    if (loading || isRolePending) {
        return <span className="loading loading-ring loading-lg"></span>
    }

    if (user && (status.status === "admin" || status.status === "moderator")) {
        return children;
    }

    logoutUser()

    return <Navigate state={location.pathname} to={"/login"}></Navigate>
};

export default AdminRoute;

AdminRoute.propTypes = {
    children: PropTypes.node
}