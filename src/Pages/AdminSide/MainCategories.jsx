import { TextField } from "@mui/material";
import useAxiosPrivate from "../../Hooks/useAxiosPrivate";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { FaRegEdit } from "react-icons/fa";

const MainCategories = () => {

    const axiosPrivate = useAxiosPrivate();

    const { data: allMainCategories, refetch } = useQuery({
        queryKey: ["allMainCategories"],
        queryFn: async () => {
            const res = await axiosPrivate("/allMainCategories");
            return res.data;
        }
    });

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

    return (
        <div className="">
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
                    <div className="overflow-x-auto">
                        <table className="table">
                            {/* head */}
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    allMainCategories?.map(category => {
                                        return <tr key={category?._id}>
                                            <td>{category?.maincategory}</td>
                                            <td>{moment(category?.maincategoryaddedDate).format("MMM Do YY")}</td>
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

export default MainCategories;