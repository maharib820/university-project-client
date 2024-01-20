import { TextField } from "@mui/material";
import authimage from "../../../../public/Authimage.png"
import { FcGoogle } from "react-icons/fc";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import useAuth from "../../../Hooks/useAuth";
import Swal from "sweetalert2";
import useAxiosPrivate from "../../../Hooks/useAxiosPrivate";

const Login = () => {

    const [loading, setLoading] = useState(false);
    const { loginUser, googleSignIn } = useAuth();
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const location = useLocation();

    const handleLoginForm = (event) => {
        event.preventDefault();
        setLoading(true);
        const form = event.target;
        const email = form.email.value;
        const password = form.password.value;
        loginUser(email, password)
            .then(() => {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Successfully login",
                    showConfirmButton: false,
                    timer: 1500
                });
                setLoading(false);
                navigate(location?.state ? location.state : "/")
            })
            .catch(() => {
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Login failed",
                    showConfirmButton: false,
                    timer: 1500
                });
                setLoading(false);
            })
    }

    const handleGoogleAccount = () => {
        googleSignIn()
            .then(r => {
                const userData = { name: r.user.displayName, email: r.user.email, profilePicture: r.user.photoURL, userStatus: "user", registeredIn: new Date() };
                axiosPrivate.post("/addUser", userData)
                    .then(res => {
                        if (res.data.insertedId || res.data.message === "user already exists") {
                            navigate(location?.state ? location.state : "/")
                        }
                    })
            })
            .catch(error => {
                console.log(error);
            })
    }

    return (
        <div className="max-w-4xl mx-auto flex justify-center mt-6 h-[700px]">
            <div className="hidden lg:block flex-1 bg-[#2a55e5] relative">
                <div className="px-10 pt-8">
                    <h2 className="text-white text-3xl font-bold">Login</h2>
                    <p className="text-white font-bold mt-10">Get access to your Orders, Wishlist and Buy Products</p>
                </div>
                <img className="w-2/3 mx-auto absolute bottom-0 translate-x-1/4" src={authimage} alt="" />
            </div>
            <div className="flex-1 bg-white relative">
                <form onSubmit={handleLoginForm} className="w-5/6 mx-auto space-y-4 mt-8">
                    <TextField name="email" label="Email" variant="outlined" fullWidth required type="email" />
                    <TextField name="password" label="Password" variant="outlined" fullWidth required type="password" />
                    {
                        loading ?
                            <button className="btn h-14 rounded-none bg-orange-500 text-white w-full text-lg">
                                <span className="loading loading-spinner"></span>
                                loading
                            </button> :
                            <input className="btn h-14 rounded-none bg-orange-500 text-white w-full text-lg" type="submit" value="Login" />
                    }
                    <div className="divider">OR</div>
                </form>
                <div className="flex justify-center mt-4">
                    <button onClick={handleGoogleAccount} className="w-5/6 btn border-2 border-[#2a55e5] rounded-none"><FcGoogle className="text-2xl"></FcGoogle>GOOGLE</button>
                </div>
                <h3 className="text-center mt-10 absolute bottom-10 left-1/2 -translate-x-1/2">New here? <Link to={"/register"}><span className="font-bold text-[#2a55e5]">Register</span></Link></h3>
            </div>
        </div>
    );
};

export default Login;