import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../../Hooks/useAxiosPrivate';
import { RiAdminLine } from "react-icons/ri";
import moment from 'moment';
import Swal from 'sweetalert2';

const ManageUsers = () => {
    const axiosPrivate = useAxiosPrivate();

    const { data: usersData, isLoading, isError, refetch } = useQuery({
        queryKey: ["usersData"],
        queryFn: async () => {
            const res = await axiosPrivate("/allRegisteredUsers");
            return res.data;
        }
    });

    if (isLoading) {
        return <p className='text-center mt-10'>Loading...</p>;
    }

    if (isError) {
        return <p className='text-center mt-10'>Error fetching data</p>;
    }

    const handleUpdateUserStatus = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You want to set as admin!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, set admin!"
        }).then((result) => {
            if (result.isConfirmed) {
                axiosPrivate.patch(`/updateUserStatus/${id}`, { status: "admin" })
                    .then(res => {
                        if (res.data.modifiedCount > 0) {
                            refetch();
                            Swal.fire({
                                title: "Deleted!",
                                text: "Your file has been deleted.",
                                icon: "success"
                            });
                        }
                    })
            }
        });
    }

    return (
        <div className="overflow-x-auto">
            <table className="table">
                {/* head */}
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Email Address</th>
                        <th>Registered In</th>
                        <th>Status</th>
                        <th>Manage Status</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        usersData.map((userData, index) => {
                            return <tr key={userData._id}>
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
                                <td>{moment(userData.registeredIn).format('MMMM Do YYYY, h:mm:ss a')}</td>
                                <td><button className='bg-orange-500 px-5 py-1 rounded-xl font-bold text-white w-28'>{userData.userStatus}</button></td>
                                <th>
                                    {
                                        userData.userStatus === "user" ?
                                            <button onClick={() => handleUpdateUserStatus(userData._id)} className="bg-green-500 rounded-full p-1 text-white"><RiAdminLine className='text-2xl'></RiAdminLine></button>
                                            : ""
                                    }
                                </th>
                            </tr>
                        })
                    }
                </tbody>
            </table>
        </div>
    );
};

export default ManageUsers;
