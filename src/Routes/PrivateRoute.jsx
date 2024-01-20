import { Navigate, useLocation } from "react-router-dom";
import PropTypes from 'prop-types';
import useAuth from "../Hooks/useAuth";

const PrivateRoute = ({ children }) => {

    const location = useLocation();

    const { user, loading } = useAuth()
    if (loading) {
        return <span className="loading loading-ring loading-lg"></span>
    }

    if (user) {
        return children;
    }

    return <Navigate state={location?.pathname} to={"/login"}></Navigate>
};

export default PrivateRoute;

PrivateRoute.propTypes = {
    children: PropTypes.node
}