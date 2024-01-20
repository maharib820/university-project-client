import { TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../../Hooks/useAxiosPrivate";
import { ToastContainer, toast } from 'react-toastify';
import Swal from "sweetalert2";
import moment from "moment";
import { FaRegEdit } from "react-icons/fa";
import { useState } from "react";
import { RiDeleteBin3Fill } from "react-icons/ri";
import { DataGrid } from '@mui/x-data-grid';

const SubCategories = () => {

    const axiosPrivate = useAxiosPrivate();
    const [mcv, setMcv] = useState(null);

    const { data: allMainCategories } = useQuery({
        queryKey: ["allMainCategories"],
        queryFn: async () => {
            const res = await axiosPrivate("/allMainCategories");
            return res.data;
        }
    });

    const { data: allSubCategories, refetch } = useQuery({
        queryKey: ["allSubCategories"],
        queryFn: async () => {
            const res = await axiosPrivate("/allSubCategories");
            return res.data;
        }
    });

    const columns = [
        { field: 'maincategory', headerName: 'Main Category', flex: 1 },
        { field: 'subcategory', headerName: 'Sub Category', flex: 1 },
        {
            field: 'subcategoryaddedDate',
            headerName: 'Created on',
            flex: 1,
        },
        {
            field: 'update',
            headerName: 'Update',
            flex: 1,
            renderCell: (params) => (
                <button onClick={() => {
                    const value = allSubCategories?.filter(fmc => fmc._id === params.row.id);
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
                    const value = allSubCategories?.filter(fmc => fmc._id === params.row.id);
                    console.log(value[0].subcategory);
                    axiosPrivate.delete(`/deletesubcategory/${value[0].subcategory}`)
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

    const rows = allSubCategories?.map((category) => ({
        id: category._id,
        maincategory: category.maincategory,
        subcategory: category.subcategory,
        subcategoryaddedDate: moment(category.subcategoryaddedDate).format('MMMM Do YYYY, h:mm:ss a'),
    }));

    const handleAddSubCategory = (event) => {
        event.preventDefault();
        const form = event.target;
        const maincategory = form.maincategory.value;
        if (maincategory === "Select Main Category") {
            return toast("Select Main Category", { position: toast.POSITION.TOP_CENTER });
        }
        const subcategory = form.subcategory.value;
        const subcategoryaddedDate = new Date();
        const data = { maincategory, subcategory, subcategoryaddedDate };
        axiosPrivate.post("/addsubcategory", data)
            .then(res => {
                if (res.data.insertedId) {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Sub category has been added",
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
        axiosPrivate.put(`/updatesubcategory/${mcv.subcategory}`, { subcategory: event.target.subcategory.value })
            .then(res => {
                if (res.data.modifiedCount > 0) {
                    toast("Subcategory updated", { position: toast.POSITION.TOP_CENTER });
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
            <h2 className="font-bold text-2xl mb-5">Sub Categories</h2>
            <div className="flex flex-col xl:flex-row gap-5">
                <div className="w-full xl:w-1/3 shadow-lg p-6 bg-white rounded-lg h-fit">
                    <p className="mb-5 font-semibold">Add Sub Category</p>
                    <form onSubmit={handleAddSubCategory} className="space-y-4">
                        <select defaultValue={"Select Main Category"} name="maincategory" className="select select-bordered w-full rounded" required>
                            <option disabled>Select Main Category</option>
                            {
                                allMainCategories?.map(category => <option key={category._id}>{category.maincategory}</option>)
                            }
                        </select>
                        <TextField name="subcategory" label="Sub Category" variant="outlined" fullWidth required type="text" />
                        <input className="btn bg-green-500 text-white" type="submit" value="Add Sub" />
                    </form>
                </div>
                <div className="w-full shadow-lg p-6 bg-white rounded-lg h-fit">
                    <p className="mb-5 font-semibold">All Sub Categories</p>
                    {
                        allSubCategories && allSubCategories.length > 0 ?
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
                            <input name="subcategory" defaultValue={mcv?.subcategory} type="text" placeholder="Type here" className="input input-bordered w-full focus:outline-none" />
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

export default SubCategories;