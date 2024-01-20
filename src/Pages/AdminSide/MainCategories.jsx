import { TextField } from "@mui/material";
import useAxiosPrivate from "../../Hooks/useAxiosPrivate";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { FaRegEdit } from "react-icons/fa";
import { DataGrid } from '@mui/x-data-grid';
import { RiDeleteBin3Fill } from "react-icons/ri";
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MainCategories = () => {

    const axiosPrivate = useAxiosPrivate();
    const [mcv, setMcv] = useState(null);

    const { data: allMainCategories, refetch } = useQuery({
        queryKey: ["allMainCategories"],
        queryFn: async () => {
            const res = await axiosPrivate("/allMainCategories");
            return res.data;
        }
    });

    const columns = [
        { field: 'maincategory', headerName: 'Name', flex: 1 },
        {
            field: 'maincategoryaddedDate',
            headerName: 'Created on',
            flex: 1,
        },
        {
            field: 'update',
            headerName: 'Update',
            flex: 1,
            renderCell: (params) => (
                <button onClick={() => {
                    const value = allMainCategories?.filter(fmc => fmc._id === params.row.id);
                    setMcv(...value)
                    document.getElementById('my_modal_show').showModal()
                }}>
                    <FaRegEdit className="text-xl text-green-600" />
                </button>
            ),
        },
        {
            field: 'delete',
            headerName: 'Delete',
            flex: 1,
            renderCell: (params) => (
                <button onClick={() => {
                    const value = allMainCategories?.filter(fmc => fmc._id === params.row.id);
                    console.log(value[0].maincategory);
                    axiosPrivate.delete(`/deletemaincategory/${value[0].maincategory}`)
                        .then((res) => {
                            console.log(res.data);
                            refetch();
                        })
                    console.log(params.row.id)
                }}>
                    <RiDeleteBin3Fill className="text-xl text-red-600" />
                </button>
            ),
        },
    ];

    const rows = allMainCategories?.map((category) => ({
        id: category._id,
        maincategory: category.maincategory,
        maincategoryaddedDate: moment(category.maincategoryaddedDate).format('MMMM Do YYYY, h:mm:ss a'),
    }));

    const handleAddMainCategory = (event) => {
        event.preventDefault();
        const form = event.target;
        const maincategory = form.maincategory.value;
        const maincategoryaddedDate = new Date();
        const data = { maincategory, maincategoryaddedDate }
        axiosPrivate.post("/addmaincategory", data)
            .then(res => {
                if (res.data.insertedId) {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Main category has been added",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    refetch();
                    form.reset();
                }
                if (res.data.message === "Already exist") {
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: res.data.message,
                        showConfirmButton: false,
                        timer: 1500
                    });
                    form.reset();
                }
            })
    }

    const handleUpdate = (event) => {
        event.preventDefault();
        axiosPrivate.put(`/updatemaincategory/${mcv.maincategory}`, { maincategory: event.target.maincategory.value })
            .then(res => {
                if (res.data.modifiedCount > 0) {
                    toast("Maincategory updated", { position: toast.POSITION.TOP_CENTER });
                    refetch();
                }
                if (res.data.message === "already exists") {
                    toast("Already exist", { position: toast.POSITION.TOP_CENTER });
                    event.target.reset();
                    refetch();
                }
            })
    }

    return (
        <div className="">
            <ToastContainer></ToastContainer>
            <h2 className="font-bold text-2xl mb-5">Main Categories</h2>
            <div className="flex flex-col xl:flex-row gap-5">
                <div className="w-full xl:w-1/3 shadow-lg p-6 bg-white rounded-lg h-fit">
                    <p className="mb-5 font-semibold">Add Main Category</p>
                    <form onSubmit={handleAddMainCategory} className="space-y-4">
                        <TextField name="maincategory" label="Main Category" variant="outlined" fullWidth required type="text" />
                        <input className="btn bg-green-500 text-white" type="submit" value="Add Main" />
                    </form>
                </div>
                <div className="w-full shadow-lg p-6 bg-white rounded-lg h-fit">
                    <p className="mb-5 font-semibold">All Main Categories</p>
                    {
                        allMainCategories && allMainCategories.length > 0 ?
                            <div style={{ height: 400, width: '100%' }}>
                                <DataGrid
                                    rows={rows}
                                    columns={columns}
                                    pageSize={5}
                                />
                            </div> : ""
                    }
                </div>
            </div>
            {/* Modal */}
            <dialog
                id="my_modal_show"
                className="modal"
            >
                <div className="modal-box">
                    <form onSubmit={handleUpdate}>
                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Main Category name</span>
                            </div>
                            <input name="maincategory" defaultValue={mcv?.maincategory} type="text" placeholder="Type here" className="input input-bordered w-full focus:outline-none" />
                        </label>
                        <input className="btn mt-3 bg-orange-500 text-white" type="submit" value="Update" />
                    </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button></button>
                </form>
            </dialog>
        </div>
    );
};

export default MainCategories;