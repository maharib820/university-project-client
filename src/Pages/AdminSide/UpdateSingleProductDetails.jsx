import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../../Hooks/useAxiosPrivate";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

const UpdateSingleProductDetails = () => {

    const params = useParams();
    // console.log(params.id);

    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();

    const { data: productInfo, refetch: callProductInfo } = useQuery({
        queryKey: ["productInfo"],
        queryFn: async () => {
            const res = await axiosPrivate(`/soloproduct/${params.id}`)
            return res.data;
        }
    })
    // console.log(productInfo);

    const [loading, setLoading] = useState(false);

    const { data: allMainCategories } = useQuery({
        queryKey: ["allMainCategories"],
        queryFn: async () => {
            const res = await axiosPrivate("/allMainCategories");
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

    const [subChildCategories, setSubChildCategories] = useState(null);
    const handleSubCategorySelect = (event) => {
        const value = event.target.value;
        axiosPrivate(`/allSubChildCategoriesOnSubCategory/${value}`)
            .then(res => {
                setSubChildCategories(res.data);
            })
    }

    const handleUpdateProduct = async (event) => {
        event.preventDefault();
        setLoading(true);
        const form = event.target;
        const maincategory = form.maincategory.value;
        if (maincategory === "Select Main Category") {
            setLoading(false);
            return toast("Select Main Category", { position: toast.POSITION.TOP_CENTER });
        }
        const subcategory = form.subcategory.value;
        if (subcategory === "Select Sub Category") {
            setLoading(false);
            return toast("Select Sub Category", { position: toast.POSITION.TOP_CENTER });
        }
        const subchildcategory = form.subchildcategory.value;
        if (subchildcategory === "Select Sub Child Category") {
            setLoading(false);
            return toast("Select Sub Child Category", { position: toast.POSITION.TOP_CENTER });
        }
        const productname = form.productname.value;
        const productbrand = form.productbrand.value;
        const productinfo = form.productinfo.value;
        const measurment = parseInt(form.measurment.value);
        const productstatus = form.productstatus.value;
        const sellprice = parseInt(form.sellprice.value);
        const quantity = parseInt(form.quantity.value);
        const productdiscount = parseInt(form.productdiscount.value)
        const productdiscountprice = parseInt((productdiscount / 100) * sellprice);
        const productfinalprice = parseInt(sellprice - productdiscountprice);
        const productdescription = form.productdescription.value;
        const data = { maincategory, subcategory, subchildcategory, productname, productbrand, productinfo, measurment, productstatus, sellprice, quantity, productdiscount, producttotalprice: sellprice, productdiscountprice, productfinalprice, productdescription }
        axiosPrivate.put(`/updatesoloproduct/${productInfo._id}`, data)
            .then(res => {
                if (res.data.modifiedCount > 0) {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Product updated",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    callProductInfo();
                    navigate("/dashboard/allproduct");
                }
            })
    }

    return (
        <div>
            <ToastContainer></ToastContainer>
            <h2 className="font-bold text-2xl mb-5">Update Product</h2>
            <div className="shadow-lg p-6 bg-white rounded-lg">
                <p className="mb-5 font-semibold pb-4 border-b">Update Information</p>
                <form onSubmit={handleUpdateProduct} className="space-y-5">
                    <div className="flex flex-col lg:flex-row gap-5">
                        <select style={{ height: '55px' }} onChange={handleMainCategorySelect} defaultValue={productInfo?.maincategory} name="maincategory" className="select select-bordered w-full rounded" required>
                            <option disabled>Select Main Category</option>
                            {
                                allMainCategories?.map(category => <option key={category._id}>{category.maincategory}</option>)
                            }
                        </select>
                        <select style={{ height: '55px' }} onChange={handleSubCategorySelect} defaultValue={"Select Sub Category"} name="subcategory" className="select select-bordered w-full rounded" required>
                            <option disabled>Select Sub Category</option>
                            {
                                subCategories?.map(category => <option key={category._id}>{category.subcategory}</option>)
                            }
                        </select>
                        <select style={{ height: '55px' }} defaultValue={"Select Sub Child Category"} name="subchildcategory" className="select select-bordered w-full rounded" required>
                            <option disabled>Select Sub Child Category</option>
                            {
                                subChildCategories?.map(category => <option key={category._id}>{category.subchildcategory}</option>)
                            }
                        </select>
                    </div>
                    <div className="flex flex-col lg:flex-row gap-5">
                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Product Name</span>
                            </div>
                            <input defaultValue={productInfo?.productname} name="productname" type="text" placeholder="Type here" className="input input-bordered w-full" required />
                        </label>
                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Product Brand</span>
                            </div>
                            <input defaultValue={productInfo?.productbrand} name="productbrand" type="text" placeholder="Type here" className="input input-bordered w-full" required />
                        </label>
                    </div>
                    <textarea defaultValue={productInfo?.productinfo} name="productinfo" className="textarea textarea-bordered w-full rounded-md" cols="30" rows="3" placeholder="Product Information"></textarea>
                    <div className="flex flex-col lg:flex-row gap-5">
                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Measurement</span>
                            </div>
                            <input defaultValue={productInfo?.measurment} name="measurment" type="number" min={1} placeholder="Type here" className="input input-bordered w-full s" required />
                        </label>
                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Product Status</span>
                            </div>
                            <select style={{ height: '55px' }} defaultValue={productInfo?.productstatus} name="productstatus" className="select select-bordered w-full rounded" required>
                                <option disabled>Select Status</option>
                                <option>Active</option>
                                <option>Discontinued</option>
                            </select>
                        </label>
                    </div>
                    <div className="flex flex-col lg:flex-row gap-5">
                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Sell Price</span>
                            </div>
                            <input defaultValue={productInfo?.sellprice} min={1} name="sellprice" type="number" placeholder="Type here" className="input input-bordered w-full" required />
                        </label>
                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Quantity</span>
                            </div>
                            <input defaultValue={productInfo?.quantity} name="quantity" type="number" placeholder="Type here" className="input input-bordered w-full" required />
                        </label>
                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Discount</span>
                            </div>
                            <input defaultValue={productInfo?.productdiscount} min={0} max={100} name="productdiscount" type="number" placeholder="Type here" className="input input-bordered w-full" required />
                        </label>
                    </div>
                    <textarea defaultValue={productInfo?.productdescription} name="productdescription" className="textarea textarea-bordered w-full rounded-md" cols="30" rows="5" placeholder="Product Description" required></textarea>
                    {
                        loading ?
                            <button className="btn h-14 bg-green-500 text-white text-lg rounded-md">
                                <span className="loading loading-spinner"></span>
                                loading
                            </button> :
                            <input className="btn h-14 rounded-md bg-green-500 text-white" type="submit" value="Update Product" />
                    }
                </form>
            </div>
        </div>
    );
};

export default UpdateSingleProductDetails;