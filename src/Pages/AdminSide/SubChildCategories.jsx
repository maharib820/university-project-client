import { TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { FaRegEdit } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import useAxiosPrivate from "../../Hooks/useAxiosPrivate";
import { useState } from "react";
import Swal from "sweetalert2";
import { RiDeleteBin3Fill } from "react-icons/ri";
import { DataGrid } from '@mui/x-data-grid';

const SubChildCategories = () => {

    const axiosPrivate = useAxiosPrivate();
    const [mcv, setMcv] = useState(null);

    const { data: allMainCategories } = useQuery({
        queryKey: ["allMainCategories"],
        queryFn: async () => {
            const res = await axiosPrivate("/allMainCategories");
            return res.data;
        }
    });

    const { data: allSubChildCategories, refetch } = useQuery({
        queryKey: ["allSubChildCategories"],
        queryFn: async () => {
            const res = await axiosPrivate("/allSubChildCategories");
            return res.data;
        }
    });

    const [subCategories, setSubCategories] = useState(null);
    const handleMainCategorySelect = (event) => {
        const value = event.target.value;
        axiosPrivate(`/allSubCategoriesOnMainCategory/${value}`)
            .then(res => {
                setSubCategories(res.data);
            })
    }

    const columns = [
        { field: 'maincategory', headerName: 'Main Category', flex: 1 },
        { field: 'subcategory', headerName: 'Sub Category', flex: 1 },
        { field: 'subchildcategory', headerName: 'Sub Child Category', flex: 1 },
        {
            field: 'subchildcategoryaddedDate',
            headerName: 'Created on',
            flex: 1,
        },
        {
            field: 'update',
            headerName: 'Update',
            flex: 1,
            renderCell: (params) => (
                <button onClick={() => {
                    const value = allSubChildCategories?.filter(fmc => fmc._id === params.row.id);
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
                    const value = allSubChildCategories?.filter(fmc => fmc._id === params.row.id);
                    console.log(value[0].subchildcategory);
                    axiosPrivate.delete(`/deletesubchildcategory/${value[0].subchildcategory}`)
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

    const rows = allSubChildCategories?.map((category) => ({
        id: category._id,
        maincategory: category.maincategory,
        subcategory: category.subcategory,
        subchildcategory: category.subchildcategory,
        subchildcategoryaddedDate: moment(category.subchildcategoryaddedDate).format('MMMM Do YYYY, h:mm:ss a'),
    }));

    const handleAddSubChildCategory = (event) => {
        event.preventDefault();
        const form = event.target;
        const maincategory = form.maincategory.value;
        if (maincategory === "Select Main Category") {
            return toast("Select Main Category", { position: toast.POSITION.TOP_CENTER });
        }
        const subcategory = form.subcategory.value;
        if (subcategory === "Select Sub Category") {
            return toast("Select Sub Category", { position: toast.POSITION.TOP_CENTER });
        }
        const subchildcategory = form.subchildcategory.value;
        const subchildcategoryaddedDate = new Date();
        const data = { maincategory, subcategory, subchildcategory, subchildcategoryaddedDate };
        axiosPrivate.post("/addsubchildcategory", data)
            .then(res => {
                if (res.data.insertedId) {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Sub child category has been added",
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
        axiosPrivate.put(`/updatesubchildcategory/${mcv.subchildcategory}`, { subchildcategory: event.target.subchildcategory.value })
            .then(res => {
                if (res.data.modifiedCount > 0) {
                    toast("Subchild category updated", { position: toast.POSITION.TOP_CENTER });
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
            <h2 className="font-bold text-2xl mb-5">Sub Child Categories</h2>
            <div className="flex flex-col xl:flex-row gap-5">
                <div className="w-full xl:w-1/3 shadow-lg p-6 bg-white rounded-lg h-fit">
                    <p className="mb-5 font-semibold">Add Sub Child Category</p>
                    <form onSubmit={handleAddSubChildCategory} className="space-y-4">
                        <select onChange={handleMainCategorySelect} defaultValue={"Select Main Category"} name="maincategory" className="select select-bordered w-full rounded" required>
                            <option disabled>Select Main Category</option>
                            {
                                allMainCategories?.map(category => <option key={category._id}>{category.maincategory}</option>)
                            }
                        </select>
                        <select defaultValue={"Select Sub Category"} name="subcategory" className="select select-bordered w-full rounded" required>
                            <option disabled>Select Sub Category</option>
                            {
                                subCategories?.map(category => <option key={category._id}>{category.subcategory}</option>)
                            }
                        </select>
                        <TextField name="subchildcategory" label="Sub Child Category" variant="outlined" fullWidth required type="text" />
                        <input className="btn bg-green-500 text-white" type="submit" value="Add Child" />
                    </form>
                </div>
                <div className="w-full shadow-lg p-6 bg-white rounded-lg h-fit">
                    <p className="mb-5 font-semibold">All Sub Child Categories</p>
                    {
                        allSubChildCategories && allSubChildCategories.length > 0 ?
                            <div style={{ height: 400, width: '100%' }}>
                                <DataGrid
                                    rows={rows}
                                    columns={columns}
                                    pageSize={5}
                                />
                            </div> : ""
                    }
                    {/* <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Main Category</th>
                                    <th>Sub Category</th>
                                    <th>Sub Child Category</th>
                                    <th>Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    allSubChildCategories?.map(category => {
                                        return <tr key={category?._id}>
                                            <td>{category?.maincategory}</td>
                                            <td>{category?.subcategory}</td>
                                            <td>{category?.subchildcategory}</td>
                                            <td>{moment(category?.subchildcategoryaddedDate).format("MMM Do YY")}</td>
                                            <td><button><FaRegEdit className="text-xl"></FaRegEdit></button></td>
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>
                    </div> */}
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
                                <span className="label-text">Subchild Category name</span>
                            </div>
                            <input name="subchildcategory" defaultValue={mcv?.subchildcategory} type="text" placeholder="Type here" className="input input-bordered w-full focus:outline-none" />
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

export default SubChildCategories;