import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../../Hooks/useAxiosPrivate";
import { FiEdit } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const AllProduct = () => {

    const axiosPrivate = useAxiosPrivate();

    const [productsData, setProductsData] = useState(null);

    const { data: allproductsdata } = useQuery({
        queryKey: ["allproductsdata"],
        queryFn: async () => {
            const res = await axiosPrivate("/getallproducts");
            setProductsData(res.data);
            return res.data;
        }
    })

    const navigate = useNavigate();

    const handleProductUpdate = (id) => {
        navigate(`/dashboard/updatesingleproductdetails/${id}`)
    }

    const handleSearch = (e) => {
        if (!e.target.value) {
            setProductsData(allproductsdata);
        }
        else {
            axiosPrivate(`/allCustomSearch/${e.target.value}`)
                .then(res => {
                    setProductsData(res.data);
                })
        }
    }

    return (
        <div>
            <h2 className="font-bold text-2xl mb-5">Products</h2>
            <div className="shadow-lg p-6 bg-white rounded-lg">
                <p className="mb-5 font-semibold pb-4 border-b">Products List</p>
                <div className='mt-5 mb-8'>
                    <input onChange={handleSearch} className='border h-12 px-5 w-full lg:w-1/3 xl:1/5 focus:outline-none border-black' type="text" name="search" placeholder='Search here' />
                </div>
                <div className="overflow-x-auto">
                    <table className="table">
                        {/* head */}
                        <thead>
                            <tr className="border-b border-b-black">
                                <th>No</th>
                                <th>Image</th>
                                <th>Product Name</th>
                                <th>Brand</th>
                                <th>Product Status</th>
                                <th>Unit</th>
                                <th>Quantity</th>
                                <th>Description</th>
                                <th>Sell Price</th>
                                <th>Discount(%)</th>
                                <th>Discount Price</th>
                                <th>Total Price</th>
                                <th>Final Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                productsData?.map((product, index) => {
                                    return <tr key={product?._id} className="border-b border-b-black">
                                        <td>{index + 1}</td>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="avatar">
                                                    <div className="mask mask-squircle w-12 h-12">
                                                        <img src={product?.productpictures[0]} />
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{product?.productname}</td>
                                        <td>{product?.productbrand}</td>
                                        <td>{product?.productstatus}</td>
                                        <td>{product?.measurment}{product?.productunit}</td>
                                        <td>{product?.quantity}</td>
                                        <td>
                                            <div>
                                                <button onClick={() => document.getElementById('product-description').showModal()} className="bg-red-600 text-white px-2 rounded-xl">See details</button>
                                                <dialog id="product-description" className="modal">
                                                    <div className="modal-box">
                                                        <h3 className="font-bold text-lg">Description</h3>
                                                        <pre className="py-4">{product?.productdescription}</pre>
                                                    </div>
                                                    <form method="dialog" className="modal-backdrop">
                                                        <button>close</button>
                                                    </form>
                                                </dialog>
                                            </div>
                                        </td>
                                        <td>{product?.sellprice}</td>
                                        <td>{product?.productdiscount}%</td>
                                        <td>{product?.productdiscountprice}</td>
                                        <td>{product?.producttotalprice}</td>
                                        <td>{product?.productfinalprice}</td>
                                        <td>
                                            <div className="flex gap-5 items-center">
                                                <button onClick={() => handleProductUpdate(product?._id)}><FiEdit className="text-orange-500 text-xl"></FiEdit></button>
                                                <button><MdDeleteOutline className="text-red-600 text-xl"></MdDeleteOutline></button>
                                            </div>
                                        </td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AllProduct;