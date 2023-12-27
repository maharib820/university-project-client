// import { useEffect, useState } from "react";
import useAuth from "../../Hooks/useAuth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAxiosPrivate from "../../Hooks/useAxiosPrivate";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";

const UserProfile = () => {

    const { user } = useAuth();
    const axiosPrivate = useAxiosPrivate();

    // const [userData, setUserData] = useState(null);

    const { data: userData, refetch } = useQuery({
        queryKey: ["userData", user?.email],
        queryFn: async () => {
            const res = await axiosPrivate(`/userdatas/${user?.email}`);
            return res.data;
        }
    })

    // useEffect(() => {
    //     axiosPrivate(`/userdatas/${user?.email}`)
    //         .then(res => {
    //             setUserData(res.data);
    //         })
    // }, [axiosPrivate, user?.email])

    const handleInfoSubmit = (event) => {
        event.preventDefault();
        const form = event.target;
        const name = form.name.value;
        const country = form.country.value;
        const streetaddress = form.streetaddress.value;
        const town = form.town.value;
        const district = form.district.value;
        const postcode = form.postcode.value;
        const phone = form.phone.value;
        if (phone.length < 11 || phone.length > 11 || !phone.startsWith('01')) {
            return toast("Invalid phone number", { position: toast.POSITION.TOP_CENTER });
        }
        const userDetails = { name, country, streetaddress, town, district, postcode, phone };
        axiosPrivate.patch(`/updateuser/${user?.email}`, userDetails)
            .then(res => {
                console.log(res.data);
                if (res.data.modifiedCount > 0) {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Profile updated",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    refetch();
                }
            })
    }

    return (
        <div className="max-w-4xl mx-auto">
            <ToastContainer></ToastContainer>
            {/* Address part */}
            <div className={`mt-10 `}>
                <div className="mt-8">
                    <form onSubmit={handleInfoSubmit}>
                        <div className="flex justify-center"><img className="w-14 h-14 rounded-full" src={userData?.profilepicture} alt="" /></div>
                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Your name?</span>
                            </div>
                            <input defaultValue={userData?.name} name="name" type="text" placeholder="Type here" className="input input-bordered w-full rounded-none focus:outline-none" required />
                        </label>
                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Country</span>
                            </div>
                            <input name="country" readOnly defaultValue={'Bangladesh'} type="text" placeholder="Type here" className="input input-bordered w-full rounded-none focus:outline-none" required />
                        </label>
                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Street Address</span>
                            </div>
                            <input defaultValue={userData?.streetaddress} name="streetaddress" type="text" placeholder="Type here" className="input input-bordered w-full rounded-none focus:outline-none" required />
                        </label>
                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Town / City</span>
                            </div>
                            <input defaultValue={userData?.town} name="town" type="text" placeholder="Type here" className="input input-bordered w-full rounded-none focus:outline-none" required />
                        </label>
                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">District</span>
                            </div>
                            <input defaultValue={userData?.district} name="district" type="text" placeholder="Type here" className="input input-bordered w-full rounded-none focus:outline-none" required />
                        </label>
                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Postcode / ZIP</span>
                            </div>
                            <input defaultValue={userData?.postcode} name="postcode" type="text" placeholder="Type here" className="input input-bordered w-full rounded-none focus:outline-none" required />
                        </label>
                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Phone</span>
                            </div>
                            <input defaultValue={userData?.phone} name="phone" type="text" placeholder="Type here" className="input input-bordered w-full rounded-none focus:outline-none" required />
                        </label>
                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Email</span>
                            </div>
                            <input name="email" defaultValue={user?.email} readOnly type="text" placeholder="Type here" className="input input-bordered w-full rounded-none focus:outline-none" required />
                        </label>
                        <input className="btn bg-red-600 text-white mt-5" type="submit" value="Update" />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;