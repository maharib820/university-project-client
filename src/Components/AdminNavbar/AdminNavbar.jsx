import { MdMenu } from "react-icons/md";
import useAuth from "../../Hooks/useAuth";
import PropTypes from 'prop-types';

const AdminNavbar = ({ setIsOpen, isOpenBtn, setIsOpenBtn }) => {

    const { user, loading } = useAuth();

    return (
        <div className={`w-full h-20 bg-white shadow-md flex lg:justify-end items-center px-8 ${!isOpenBtn ? "justify-end" : "justify-between"}`}>
            {
                isOpenBtn ? <button onClick={() => {
                    setIsOpen(true);
                    setIsOpenBtn(false);
                }} className="btn btn-square lg:hidden"><MdMenu className="text-3xl"></MdMenu></button> : ""
            }
            {
                loading ?
                    <span className="loading loading-ring loading-lg"></span>
                    :
                    <button><img className="h-12 w-12 rounded-full" src={user?.photoURL} alt="profile picture" /></button>
            }
        </div>
    );
};

export default AdminNavbar;

AdminNavbar.propTypes = {
    isOpenBtn: PropTypes.bool,
    setIsOpen: PropTypes.func,
    setIsOpenBtn: PropTypes.func
}