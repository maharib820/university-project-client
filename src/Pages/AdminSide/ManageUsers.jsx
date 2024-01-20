import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../../Hooks/useAxiosPrivate';
import { RiAdminLine } from "react-icons/ri";
import moment from 'moment';
import Swal from 'sweetalert2';
import { useState } from 'react';
import { CiMenuKebab } from "react-icons/ci";

const ManageUsers = () => {
    const axiosPrivate = useAxiosPrivate();

    const [usersData, setUserData] = useState(null);

    const { data: allusersData, isLoading, isError, refetch } = useQuery({
        queryKey: ["usersData"],
        queryFn: async () => {
            const res = await axiosPrivate("/allRegisteredUsers");
            setUserData(res.data);
            return res.data;
        }
    });

    if (isLoading) {
        return <p className='text-center mt-10'>Loading...</p>;
    }

    if (isError) {
        return <p className='text-center mt-10'>Error fetching data</p>;
    }

    const handleUpdateUserStatus = (id, currentStatus) => {
        Swal.fire({
            title: "Are you sure?",
            text: `You want to set as ${currentStatus === 'user' ? "moderator" : "user"}!`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: `Yes, set ${currentStatus === 'user' ? "moderator" : "user"}!`
        }).then((result) => {
            if (result.isConfirmed) {
                axiosPrivate.patch(`/updateUserStatus/${id}`, { status: currentStatus === 'user' ? "moderator" : "user" })
                    .then(res => {
                        if (res.data.modifiedCount > 0) {
                            refetch();
                            Swal.fire({
                                title: "Success!",
                                text: "Status set successfully.",
                                icon: "success"
                            });
                        }
                    })
            }
        });
    }

    const handleSearch = (e) => {
        if (!e.target.value) {
            setUserData(allusersData);
        }
        else {
            axiosPrivate(`/allRegisteredUsers/${e.target.value}`)
                .then(res => {
                    setUserData(res.data);
                })
        }
    }

    const handleShowByStatus = (status) => {
        console.log(status);
        axiosPrivate(`/allRegisteredUsersonStatus/${status}`)
            .then(res => {
                setUserData(res.data)
            })
    }

    return (
        <div>
            <div className="overflow-x-auto bg-white p-5 rounded-lg shadow-md">
                <h3 className='text-xl font-bold mb-10'>Manage Users</h3>
                <div className='mt-5 mb-8'>
                    <input onChange={handleSearch} className='border h-12 px-5 w-full lg:w-1/3 xl:1/5 focus:outline-none border-black' type="text" name="search" placeholder='Search here' />
                </div>
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr className="border-b border-b-black">
                            <th>No</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Email Address</th>
                            <th>Phone</th>
                            <th>Registered In</th>
                            <th>Country</th>
                            <th>District</th>
                            <th>Town/City</th>
                            <th>Street Address</th>
                            <th>Zipcode</th>
                            <th>
                                <div className='flex items-center gap-5 dropdown'>
                                    <span>Status</span>
                                    <div>
                                        <button tabIndex={0} className='m-1'><CiMenuKebab></CiMenuKebab></button>
                                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52  right-28">
                                            <li><button onClick={() => handleShowByStatus('admin')} className='text-xs'>Admin</button></li>
                                            <li><button onClick={() => handleShowByStatus('moderator')} className='text-xs'>Moderators</button></li>
                                            <li><button onClick={() => handleShowByStatus('user')} className='text-xs'>Users</button></li>
                                            <li><button onClick={() => setUserData(allusersData)} className='text-xs'>Show all</button></li>
                                        </ul>
                                    </div>
                                </div>
                            </th>
                            <th>Manage Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            usersData?.map((userData, index) => {
                                return <tr key={userData._id} className="border-b border-b-black">
                                    <th>{index + 1}</th>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle w-12 h-12">
                                                    <img src={userData.profilepicture} alt="Profile Picture" />
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{userData.name}</td>
                                    <td>{userData.email}</td>
                                    {userData.phone ? <td>{userData.phone}</td> : <td>NA</td>}
                                    <td>{moment(userData.registeredIn).format('MMMM Do YYYY, h:mm:ss a')}</td>
                                    {userData.country ? <td>{userData.country}</td> : <td>NA</td>}
                                    {userData.district ? <td>{userData.district}</td> : <td>NA</td>}
                                    {userData.town ? <td>{userData.town}</td> : <td>NA</td>}
                                    {userData.streetaddress ? <td>{userData.streetaddress}</td> : <td>NA</td>}
                                    {userData.postcode ? <td>{userData.postcode}</td> : <td>NA</td>}
                                    <td><button><div className="badge badge-primary">{userData.userStatus}</div></button></td>
                                    {
                                        <th>
                                            {
                                                userData.userStatus === "user" || userData.userStatus === "moderator" ?
                                                    <button onClick={() => handleUpdateUserStatus(userData._id, userData.userStatus)} className={`bg-green-500 rounded-full p-1 text-white`}><RiAdminLine className='text-xl'></RiAdminLine></button>
                                                    : ""
                                            }
                                        </th>
                                    }
                                </tr>
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsers;
