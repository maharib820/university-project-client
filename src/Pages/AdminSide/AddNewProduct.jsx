import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../../Hooks/useAxiosPrivate";
import { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";

const AddNewProduct = () => {

    const axiosPrivate = useAxiosPrivate();
    const [loading, setLoading] = useState(false);
    const imgbbKey = import.meta.env.VITE_imagebb_key;
    const imgbbAPI = `https://api.imgbb.com/1/upload?key=${imgbbKey}`;

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

    const [sellprice, setSellPrice] = useState(null);
    const [discount, setDiscount] = useState(null);

    const [discountPrice, setDiscountPrice] = useState("");
    const [totalPrice, setTotalPrice] = useState("");
    const [finalprice, setFinalPrice] = useState("");

    const handleSellPrice = (event) => {
        const value = parseInt(event.target.value);
        console.log(typeof value);
        if (!(value > 0)) {
            setSellPrice("");
            setDiscountPrice("");
            setTotalPrice("");
            setFinalPrice("");
        }
        else setSellPrice(parseInt(value));
    }

    const handleDiscount = (event) => {
        const value = parseInt(event.target.value);
        if (!(value > 0)) {
            setDiscount("");
            setTotalPrice("");
            setFinalPrice("");
        }
        else setDiscount(parseInt(value));
    }

    useEffect(() => {
        if (sellprice > 0 && discount > 0) {
            const adp = (discount / 100) * sellprice;
            setDiscountPrice(Math.round(adp));
            const tp = sellprice;
            setTotalPrice(tp);
            const fp = totalPrice - discountPrice;
            setFinalPrice(fp);
        }
        else if (sellprice > 0) {
            setDiscountPrice(0);
            setTotalPrice(sellprice);
            setFinalPrice(sellprice);
        }
    }, [discount, discountPrice, sellprice, totalPrice])

    const handleAddNewProduct = async (event) => {
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
        const productunit = form.productunit.value;
        const productstatus = form.productstatus.value;
        const sellprice = parseInt(form.sellprice.value);
        const quantity = parseInt(form.quantity.value);
        let productdiscount = 0;
        if (!form.discount.value) {
            productdiscount = 0;
        }
        else {
            productdiscount = parseInt(form.discount.value);
        }
        const producttotalprice = parseInt(form.totalprice.value);
        const productdiscountprice = parseInt(form.discountprice.value);
        const productfinalprice = parseInt(form.finalprice.value);
        const productdescription = form.productdescription.value;
        let productpictures = [];
        for (let i = 0; i < form.productimage.files.length; i++) {
            const imagefile = { image: form.productimage.files[i] };
            const res = await axiosPrivate.post(imgbbAPI, imagefile, {
                headers: {
                    "content-type": "multipart/form-data"
                }
            })
            if (res.data.success) {
                productpictures.push(res.data.data.display_url);
            }
            else {
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Product insertion failed",
                    showConfirmButton: false,
                    timer: 1500
                });
                setLoading(false);
                return;
            }
        }
        const data = { maincategory, subcategory, subchildcategory, productname, productbrand, productinfo, productpictures, measurment, productunit, productstatus, sellprice, quantity, productdiscount, producttotalprice, productdiscountprice, productfinalprice, productdescription, productaddeddate: new Date() };
        axiosPrivate.post("/addnewproduct", data)
            .then(res => {
                if (res.data.insertedId) {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Product added successfully",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    form.reset();
                    setLoading(false);
                    setSellPrice("");
                    setDiscount("");
                    setDiscountPrice("");
                    setTotalPrice("");
                    setFinalPrice("");
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
                    setLoading(false);
                }
            })
            .catch(() => {
                setLoading(false);
            })
    }


    return (
        <div>
            <ToastContainer></ToastContainer>
            <h2 className="font-bold text-2xl mb-5">Products</h2>
            <div className="shadow-lg p-6 bg-white rounded-lg">
                <p className="mb-5 font-semibold pb-4 border-b">Add New Product</p>
                <form onSubmit={handleAddNewProduct} className="space-y-5">
                    <div className="flex flex-col lg:flex-row gap-5">
                        <select style={{ height: '55px' }} onChange={handleMainCategorySelect} defaultValue={"Select Main Category"} name="maincategory" className="select select-bordered w-full rounded" required>
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
                        <TextField name="productname" label="Product Name" variant="outlined" fullWidth required type="text" />
                        <TextField name="productbrand" label="Product Brand" variant="outlined" fullWidth required type="text" />
                    </div>
                    <textarea name="productinfo" className="textarea textarea-bordered w-full rounded-md" cols="30" rows="3" placeholder="Product Information"></textarea>
                    <input name="productimage" type="file" accept="image/*" className="file-input file-input-bordered w-full rounded focus:border-none" multiple required />
                    <div className="flex flex-col lg:flex-row gap-5">
                        <TextField name="measurment" label="Measurment" variant="outlined" fullWidth required type="number" InputProps={{ inputProps: { min: 1 } }} />
                        <select style={{ height: '55px' }} defaultValue={"Select Unit"} name="productunit" className="select select-bordered w-full rounded" required>
                            <option disabled>Select Unit</option>
                            <option>kg</option>
                            <option>gm</option>
                            <option>ltr</option>
                            <option>ml</option>
                            <option>pack</option>
                            <option>pc</option>
                        </select>
                        <select style={{ height: '55px' }} defaultValue={"Select Status"} name="productstatus" className="select select-bordered w-full rounded" required>
                            <option disabled>Select Status</option>
                            <option>Active</option>
                            <option>Discontinued</option>
                        </select>
                    </div>
                    <div className="flex flex-col lg:flex-row gap-5">
                        <TextField onChange={handleSellPrice} name="sellprice" label="Sell Price" variant="outlined" fullWidth required type="number" InputProps={{ inputProps: { min: 1 } }} />
                        <TextField name="quantity" label="Quantity" variant="outlined" fullWidth required type="number" InputProps={{ inputProps: { min: 1 } }} />
                        <TextField onChange={handleDiscount} name="discount" label="Discount(%)" variant="outlined" fullWidth type="number" InputProps={{ inputProps: { min: 0, max: 100 } }} />
                        <TextField value={totalPrice} name="totalprice" label="Total Price" variant="outlined" fullWidth required type="number" InputProps={{ readOnly: true }} />
                        <TextField value={discountPrice} name="discountprice" label="Discount Price" variant="outlined" fullWidth required type="number" InputProps={{ readOnly: true }} />
                        <TextField value={finalprice} name="finalprice" label="Final Price" variant="outlined" fullWidth required type="number" InputProps={{ readOnly: true }} />
                    </div>
                    <textarea name="productdescription" className="textarea textarea-bordered w-full rounded-md" cols="30" rows="5" placeholder="Product Description" required></textarea>
                    {
                        loading ?
                            <button className="btn h-14 bg-green-500 text-white text-lg rounded-md">
                                <span className="loading loading-spinner"></span>
                                loading
                            </button> :
                            <input className="btn h-14 rounded-md bg-green-500 text-white" type="submit" value="Add Product" />
                    }
                </form>
            </div>
        </div>
    );
};

export default AddNewProduct;