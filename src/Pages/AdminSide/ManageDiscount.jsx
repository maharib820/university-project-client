// import { useQuery } from "@tanstack/react-query";
// import useAxiosPrivate from "../../Hooks/useAxiosPrivate";
// import { useEffect, useState } from "react";
// import { ToastContainer } from "react-toastify";
// import Swal from "sweetalert2";
// import moment from "moment";
// import { DataGrid } from "@mui/x-data-grid";

const ManageDiscount = () => {

    // const axiosPrivate = useAxiosPrivate();
    // const [datee, setDatee] = useState(null);

    // const { data: allsaleinfo } = useQuery({
    //     queryKey: ["allsaleinfo"],
    //     queryFn: async () => {
    //         const res = await axiosPrivate("/saleinfo");
    //         return res.data;
    //     }
    // });

    // const columns = [
    //     { field: 'subchildcategory', headerName: 'For', flex: 1 },
    //     { field: 'appliedin', headerName: 'Added', flex: 1 },
    //     { field: 'expdate', headerName: 'Expired in', flex: 1 },
    //     { field: 'givendiscount', headerName: 'Sub Child Category', flex: 1 },
    // ];

    // const rows = allsaleinfo?.map((category) => ({
    //     id: category._id,
    //     subchildcategory: category.subchildcategory,
    //     appliedin: category.appliedin,
    //     givendiscount: category.givendiscount,
    //     expdate: moment(category.expdate).format('MMMM Do YYYY, h:mm:ss a'),
    // }));

    // useEffect(() => {
    //     const today = new Date();
    //     today.setDate(today.getDate());
    //     const tomorrow = today.toISOString().split('T')[0];
    //     setDatee(tomorrow)
    // }, [setDatee])

    // const { data: allMainCategories } = useQuery({
    //     queryKey: ["allMainCategories"],
    //     queryFn: async () => {
    //         const res = await axiosPrivate("/allMainCategories");
    //         return res.data;
    //     }
    // });

    // const [subCategories, setSubCategories] = useState(null);
    // const handleMainCategorySelect = (event) => {
    //     const value = event.target.value;
    //     axiosPrivate(`/allSubCategoriesOnMainCategory/${value}`)
    //         .then(res => {
    //             setSubCategories(res.data);
    //         })
    // }

    // const [subChildCategories, setSubChildCategories] = useState(null);
    // const handleSubCategorySelect = (event) => {
    //     const value = event.target.value;
    //     axiosPrivate(`/allSubChildCategoriesOnSubCategory/${value}`)
    //         .then(res => {
    //             setSubChildCategories(res.data);
    //         })
    // }

    // const handleDiscountSubmit = (event) => {
    //     event.preventDefault();
    //     const form = event.target;
    //     const maincategory = form.maincategory.value;
    //     const subcategory = form.subcategory.value;
    //     const subchildcategory = form.subchildcategory.value;
    //     const salediscount = parseInt(form.salediscount.value);
    //     const expdate = form.expdate.value;
    //     const sale = { maincategory, subcategory, subchildcategory, salediscount, expdate, isSale: true }
    //     console.log(sale);
    //     axiosPrivate.patch("/sale", sale)
    //         .then(res => {
    //             console.log(res.data);
    //             if (res.data.success) {
    //                 Swal.fire({
    //                     position: "center",
    //                     icon: "success",
    //                     title: res.data.message,
    //                     showConfirmButton: false,
    //                     timer: 1500
    //                 });
    //                 form.reset();
    //             }
    //         })
    // }

    return (
        <div className="">
            {/* <ToastContainer></ToastContainer> */}
            <h2 className="font-bold text-2xl mb-5">Discounts</h2>
            {/* <div className="flex flex-col xl:flex-row gap-5">
                <div className="w-full xl:w-1/3 shadow-lg p-6 bg-white rounded-lg h-fit">
                    <p className="mb-5 font-semibold">Add Discount</p>
                    <form onSubmit={handleDiscountSubmit} className="space-y-4">
                        <select onChange={handleMainCategorySelect} defaultValue={"Select Main Category"} name="maincategory" className="select select-bordered w-full rounded" required>
                            <option disabled>Select Main Category</option>
                            {
                                allMainCategories?.map(category => <option key={category._id}>{category.maincategory}</option>)
                            }
                        </select>
                        <select onChange={handleSubCategorySelect} defaultValue={"Select Sub Category"} name="subcategory" className="select select-bordered w-full rounded" required>
                            <option disabled>Select Sub Category</option>
                            {
                                subCategories?.map(category => <option key={category._id}>{category.subcategory}</option>)
                            }
                        </select>
                        <select defaultValue={"Select Sub Child Category"} name="subchildcategory" className="select select-bordered w-full rounded" required>
                            <option disabled>Select Sub Child Category</option>
                            {
                                subChildCategories?.map(category => <option key={category._id}>{category.subchildcategory}</option>)
                            }
                        </select>
                        <input type="number" name="salediscount" min={0} max={100} placeholder="Type discount percentage" className="input input-bordered rounded w-full placeholder-black" />
                        <input min={datee} name="expdate" type="date" className="border px-[15px] py-2 w-full rounded focus:border-none" required />
                        <input className="btn bg-green-500 text-white" type="submit" value="Add Discount" />
                    </form>
                </div>
                <div className="w-full shadow-lg p-6 bg-white rounded-lg h-fit">
                    <p className="mb-5 font-semibold">All Added Banners</p>
                    {
                        allsaleinfo && allsaleinfo.length > 0 ?
                            <div style={{ height: 400, width: '100%' }}>
                                <DataGrid
                                    rows={rows}
                                    columns={columns}
                                    pageSize={5}
                                />
                            </div> : ""
                    }
                </div>
            </div> */}
        </div>
    );
};

export default ManageDiscount;