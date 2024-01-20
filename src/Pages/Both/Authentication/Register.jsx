import { TextField } from "@mui/material";
import authimage from "../../../../public/Authimage.png"
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from "react-helmet-async";
import useAxiosPrivate from "../../../Hooks/useAxiosPrivate";
import useAuth from "../../../Hooks/useAuth";
import { useState } from "react";
import Swal from "sweetalert2";

const Register = () => {

    const axiosPrivate = useAxiosPrivate();

    const imgbbKey = import.meta.env.VITE_imagebb_key;
    const imgbbAPI = `https://api.imgbb.com/1/upload?key=${imgbbKey}`;

    const { createUser, updateUserProfile, logoutUser, googleSignIn } = useAuth();
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleRegisterForm = async (event) => {
        event.preventDefault();
        const form = event.target;
        const name = form.name.value;
        const email = form.email.value;
        const password = form.password.value;
        const confirmPassword = form.confirmpassword.value;
        if (password.length < 6) {
            return toast("Password is too short", { position: toast.POSITION.TOP_CENTER });
        }
        if (password !== confirmPassword) {
            return toast("Password doesn't match", { position: toast.POSITION.TOP_CENTER });
        }
        const imagefile = { image: form.profilepicture.files[0] };
        setLoading(true);
        const res = await axiosPrivate.post(imgbbAPI, imagefile, {
            headers: {
                "content-type": "multipart/form-data"
            }
        });
        if (res.data.success) {
            const profilepicture = res.data.data.display_url;
            createUser(email, password)
                .then(() => {
                    updateUserProfile(name, profilepicture)
                        .then(() => {
                            const userData = { name, email, profilepicture, userStatus: "user", registeredIn: new Date() }
                            axiosPrivate.post("/addUser", userData)
                                .then(res => {
                                    if (res.data.insertedId) {
                                        Swal.fire({
                                            position: "center",
                                            icon: "success",
                                            title: "You registered successfully",
                                            showConfirmButton: false,
                                            timer: 1500
                                        });
                                        setLoading(false);
                                        logoutUser();
                                        navigate("/login")
                                    }
                                })
                        })
                        .catch(() => {
                            setLoading(false);
                        })
                })
                .catch(() => {
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: "Registration failed",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    setLoading(false);
                })
        }
        else {
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Registration failed",
                showConfirmButton: false,
                timer: 1500
            });
            setLoading(false);
        }
    }

    const handleGoogleAccount = () => {
        googleSignIn()
            .then(r => {
                const userData = { name: r.user.displayName, email: r.user.email, profilePicture: r.user.photoURL, userStatus: "user", registeredIn: new Date() };
                axiosPrivate.post("/addUser", userData)
                    .then(res => {
                        if (res.data.insertedId || res.data.message === "user already exists") {
                            navigate("/");
                        }
                    })
            })
            .catch(error => {
                console.log(error);
            })
    }

    return (
        <div className="max-w-4xl mx-auto flex justify-center mt-6 h-[700px]">
            <Helmet>
                <title>Eshopz | Register</title>
            </Helmet>
            <ToastContainer></ToastContainer>
            <div className="hidden lg:block flex-1 bg-[#2a55e5] relative">
                <div className="px-10 pt-8">
                    <h2 className="text-white text-3xl font-bold">Looks like you are new here!</h2>
                    <p className="text-white font-bold mt-10">Sign up to get started</p>
                </div>
                <img className="w-2/3 mx-auto absolute bottom-0 translate-x-1/4" src={authimage} alt="" />
            </div>
            <div className="flex-1 bg-white relative">
                <form onSubmit={handleRegisterForm} className="w-5/6 mx-auto space-y-4 mt-8">
                    <TextField name="name" label="Name" variant="outlined" fullWidth required type="text" />
                    <TextField name="email" label="Email" variant="outlined" fullWidth required type="email" />
                    <TextField name="password" label="Password" variant="outlined" fullWidth required type="password" />
                    <TextField name="confirmpassword" label="Confirm Password" variant="outlined" fullWidth required type="password" />
                    <input name="profilepicture" type="file" accept="image/*" className="file-input file-input-bordered w-full rounded focus:border-none" required />
                    {
                        loading ?
                            <button className="btn h-14 rounded-none bg-orange-500 text-white w-full text-lg">
                                <span className="loading loading-spinner"></span>
                                loading
                            </button> :
                            <input className="btn h-14 rounded-none bg-orange-500 text-white w-full text-lg" type="submit" value="Register" />
                    }
                    <div className="divider">OR</div>
                </form>
                <div className="flex justify-center mt-4">
                    <button onClick={handleGoogleAccount} className="w-5/6 btn border-2 border-[#2a55e5] rounded-none"><FcGoogle className="text-2xl"></FcGoogle>GOOGLE</button>
                </div>
                <h3 className="text-center mt-10 absolute bottom-10 left-1/2 -translate-x-1/2">Already have an account? <Link to={"/login"}><span className="font-bold text-[#2a55e5]">Login</span></Link></h3>
            </div>
        </div>
    );
};

export default Register;