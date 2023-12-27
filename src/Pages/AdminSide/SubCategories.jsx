import { TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../../Hooks/useAxiosPrivate";
import { ToastContainer, toast } from 'react-toastify';
import Swal from "sweetalert2";
import moment from "moment";
import { FaRegEdit } from "react-icons/fa";

const SubCategories = () => {

    const axiosPrivate = useAxiosPrivate();

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
                    <div className="overflow-x-auto">
                        <table className="table">
                            {/* head */}
                            <thead>
                                <tr>
                                    <th>Main Category</th>
                                    <th>Sub Category</th>
                                    <th>Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    allSubCategories?.map(category => {
                                        return <tr key={category?._id}>
                                            <td>{category?.maincategory}</td>
                                            <td>{category?.subcategory}</td>
                                            <td>{moment(category?.subcategoryaddedDate).format("MMM Do YY")}</td>
                                            <td><button><FaRegEdit className="text-xl"></FaRegEdit></button></td>
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubCategories;