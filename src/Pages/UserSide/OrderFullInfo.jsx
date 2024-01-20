import { useEffect, useState } from "react";
import useAxiosPrivate from "../../Hooks/useAxiosPrivate";
import { Link, useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const OrderFullInfo = () => {

    const params = useParams();
    // console.log(params);

    const axiosPrivate = useAxiosPrivate();
    const [datas, setDatas] = useState(null);

    useEffect(() => {
        axiosPrivate(`/viewsingleorderhistory/${params.id}`)
            .then(res => {
                setDatas(...res.data);
            })
    }, [axiosPrivate, params.id])

    // console.log(datas);

    return (
        datas ? <div className="max-w-7xl mx-auto mt-10 relative">
            <ToastContainer></ToastContainer>
            <h2 className="mb-10 text-xl">Ordered Items</h2>
            <div className="overflow-x-auto">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr className="bg-white text-black text-base">
                            <th></th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Brand Name</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            datas?.myorderitemlist?.map((item, index) => {
                                return <tr key={index} className="border-b border-b-black">
                                    <td>{index + 1}</td>
                                    <td><img className="w-14" src={item.productinfo.productpictures[0]} alt="" /></td>
                                    <td><Link to={`/productdetails/${item.cartProductId}`}><p className="text-blue-800">{item.productinfo.productname}</p></Link></td>
                                    <td><p>{item.productinfo.productbrand}</p></td>
                                    <td><p>{item.productinfo.productfinalprice} Taka</p></td>
                                    <td><p>{item.totalSelectedItems} x {item.productinfo.measurment}{item.productinfo.productunit}</p></td>
                                    <td><p>{item.totalSelectedItems * item.productinfo.productfinalprice}</p></td>
                                </tr>
                            })
                        }
                    </tbody>
                </table>
            </div>
            <div className="mt-8 w-full flex justify-end">
                <div className="w-1/5">
                    <div className="w-full bg-white border border-black py-5 px-4">
                        <div className="flex justify-between items-center">
                            <span>Subtotal:</span>
                            <span>{datas?.amountpaid-50}</span>
                        </div>
                        <div className="mt-5 flex justify-between items-center border-b border-b-black pb-6">
                            <span>Shipping:</span>
                            <span>50</span>
                        </div>
                        <div className="mt-5 flex justify-between items-center">
                            <span className="font-bold">Total:</span>
                            <span className="font-bold text-red-600">{datas?.amountpaid}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div> : ""
    );
};

export default OrderFullInfo;