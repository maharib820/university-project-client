import { FiMinus, FiPlus } from "react-icons/fi";
import useCart from "../../Hooks/useCart";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import useAuth from "../../Hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RxCrossCircled } from "react-icons/rx";

const ViewCartPage = () => {

    const axiosPublic = useAxiosPublic();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [paymentAmount, setPaymentAmount] = useState(0);
    const [lastTotal, setLastTotal] = useState(0);

    const { cartItems, refetchCartItems, isCartPending } = useCart();
    // console.log(cartItems);

    const handleDecrease = (value, cartProductId) => {
        if (value <= 1) {
            return
        }
        else {
            const datas = { cartBy: user?.email, cartProductId, totalSelectedItems: -1 };
            console.log(datas);
            axiosPublic.post("/addToCartProduct", datas)
                .then((res) => {
                    console.log(res.data);
                    if (res.data.modifiedCount > 0) {
                        refetchCartItems();
                    }
                })
        }
    }

    const handleIncrease = (value, cartProductId, preQuantity) => {
        if (value + 1 <= preQuantity) {
            const datas = { cartBy: user?.email, cartProductId, totalSelectedItems: 1 };
            console.log(datas);
            axiosPublic.post("/addToCartProduct", datas)
                .then((res) => {
                    console.log(res.data);
                    if (res.data.modifiedCount > 0) {
                        refetchCartItems();
                    }
                })
        }
        else {
            return toast("Stock not available", { position: toast.POSITION.TOP_CENTER });
        }
    }

    const handleClearCart = () => {
        axiosPublic.delete(`/deletemycart/${user?.email}`)
            .then(res => {
                if (res.data.deletedCount > 0) {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Your work has been saved",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    refetchCartItems();
                    setLastTotal(0);
                    setPaymentAmount(0);
                }
            })
    }

    useEffect(() => {
        const totalAmount = cartItems?.map(item => item.totalSelectedItems * item.cartItemsList.productfinalprice)
            .reduce((acc, currentValue) => acc + currentValue, 0);
        setPaymentAmount(totalAmount);
        if (totalAmount > 0) {
            setLastTotal(totalAmount - 50);
        }
    }, [cartItems])

    const handleCartItemDelete = (id) => {
        axiosPublic.delete(`/mycartelement/${id}`)
            .then(res => {
                console.log(res.data);
                refetchCartItems();
                setLastTotal(0);
                setPaymentAmount(0);
            })
    }

    return (
        <div className="max-w-7xl mx-auto mt-10 relative">
            <ToastContainer></ToastContainer>
            <h2 className="mb-10 text-xl">My Cart on Eshopz</h2>
            <div className="overflow-x-auto">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr className="bg-white text-black text-base">
                            <th></th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            cartItems?.map(item => {
                                return <tr key={item._id} className="border-b border-b-black">
                                    <th><button onClick={() => handleCartItemDelete(item._id)}><RxCrossCircled className="text-2xl text-red-600"></RxCrossCircled></button></th>
                                    <td><img className="w-14" src={item.cartItemsList.productpictures[0]} alt="" /></td>
                                    <td><Link to={`/productdetails/${item.cartProductId}`}><p className="text-blue-800">{item.cartItemsList.productname}</p></Link></td>
                                    <td>{item.cartItemsList.productfinalprice}</td>
                                    <td>
                                        <div className="flex items-center border border-black w-fit px-3 py-2">
                                            <button className="bg-[#d4d2d2] p-1 rounded-full" onClick={() => handleDecrease(item.totalSelectedItems, item.cartProductId)}><FiMinus></FiMinus></button>
                                            <p className="mx-2 px-2 py-1">{item.totalSelectedItems}</p>
                                            <button className="bg-[#d4d2d2] p-1 rounded-full" onClick={() => handleIncrease(item.totalSelectedItems, item.cartProductId, item.cartItemsList.quantity)}><FiPlus></FiPlus></button>
                                        </div>
                                    </td>
                                    <td>{item.cartItemsList.productfinalprice * item.totalSelectedItems}</td>
                                </tr>
                            })
                        }
                    </tbody>
                </table>
            </div>
            <div className="mt-8 w-full flex justify-end">
                <button onClick={handleClearCart} className="btn btn-outline">Clear cart</button>
            </div>
            <div className="mt-8 w-full flex justify-end">
                <div className="w-1/5">
                    <div className="w-full bg-white border border-black py-5 px-4">
                        <div className="flex justify-between items-center">
                            <span>Subtotal:</span>
                            <span>{paymentAmount}</span>
                        </div>
                        <div className="mt-5 flex justify-between items-center border-b border-b-black pb-6">
                            <span>Shipping:</span>
                            <span>50</span>
                        </div>
                        <div className="mt-5 flex justify-between items-center">
                            <span className="font-bold">Total:</span>
                            <span className="font-bold text-red-600">{lastTotal}</span>
                        </div>
                    </div>
                    <div className="w-full bg-white mt-5">
                        {
                            isCartPending ? "" :
                                <button onClick={() => navigate("/payment")} className={`w-full py-2 bg-[#c7003a] text-white font-bold ${cartItems?.length < 1 ? "hidden" : ""}`}>Proceed to Checkout</button>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewCartPage;