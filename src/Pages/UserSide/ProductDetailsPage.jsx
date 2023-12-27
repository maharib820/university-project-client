import { Link, useNavigate, useParams } from "react-router-dom";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { useEffect, useState } from "react";
import useAuth from "../../Hooks/useAuth";
import Swal from "sweetalert2";
import useWishlist from "../../Hooks/useWishlist";
import { FiPlus } from "react-icons/fi";
import { FiMinus } from "react-icons/fi";
import useCart from "../../Hooks/useCart";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductDetailsPage = () => {

    const { cartItems, refetchCartItems, isCartPending } = useCart();

    const params = useParams();

    const axiosPublic = useAxiosPublic();

    const [datas, setDatas] = useState(null);

    useEffect(() => {
        axiosPublic(`/getsingleproduct/${params.id}`)
            .then(res => {
                setDatas(res.data);
                setSelectedQuantity(1);
            })
    }, [axiosPublic, params.id])

    const [imgNum, setImgNum] = useState(0);

    const { user } = useAuth();

    const { refetchWishlist } = useWishlist();

    const handleWishlist = (alldatas) => {
        if (user) {
            const useremail = user.email;
            const addWishlist = { useremail, productId: alldatas._id };
            axiosPublic.post("/userWishlists", addWishlist)
                .then(res => {
                    if (res.data.insertedId) {
                        refetchWishlist();
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: "Added to wishlist",
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                    if (res.data.message === "Already exist") {
                        Swal.fire({
                            position: "center",
                            icon: "error",
                            title: "Already added",
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                })
        }
    }

    const { wishlist, wishlistPending } = useWishlist();

    const [selectedQuantity, setSelectedQuantity] = useState(1);

    const handleDecrease = () => {
        if (selectedQuantity <= 1) {
            setSelectedQuantity(1);
        }
        else {
            setSelectedQuantity(selectedQuantity - 1);
        }
    }

    const handleIncrease = () => {
        if (!isCartPending) {
            const check = cartItems?.filter(item => item.cartProductId === datas?._id);
            const totalSelected = check[0]?.totalSelectedItems || 0;
            if (selectedQuantity + totalSelected < datas?.quantity) {
                if (selectedQuantity >= 25) {
                    setSelectedQuantity(10);
                }
                else {
                    setSelectedQuantity(selectedQuantity + 1);
                }
            }
            else {
                return toast("Stock not available", { position: toast.POSITION.TOP_CENTER });
            }
        }
    }

    const handleAddToCart = () => {
        if (!isCartPending) {
            const check = cartItems?.filter(item => item.cartProductId === datas?._id);
            const totalSelected = check[0]?.totalSelectedItems || 0;
            if (selectedQuantity + totalSelected <= datas?.quantity) {
                const totalSelectedItems = selectedQuantity;
                const addIntoCart = { totalSelectedItems, cartBy: user?.email, cartProductId: datas._id };
                axiosPublic.post("/addToCartProduct", addIntoCart)
                    .then(res => {
                        // console.log(res.data);
                        if (res.data.insertedId || res.data.modifiedCount > 0) {
                            refetchCartItems();
                            Swal.fire({
                                position: "center",
                                icon: "success",
                                title: "Added to cart",
                                showConfirmButton: false,
                                timer: 1500
                            });
                        }
                    })
            }
            else {
                return toast("Stock not available", { position: toast.POSITION.TOP_CENTER });
            }
        }
    }

    const navigate = useNavigate();

    const handleButtonBuy = () => {
        if (!isCartPending) {
            const check = cartItems?.filter(item => item.cartProductId === datas?._id);
            const totalSelected = check[0]?.totalSelectedItems || 0;
            if (selectedQuantity + totalSelected <= datas?.quantity) {
                const totalSelectedItems = selectedQuantity;
                const addIntoCart = { totalSelectedItems, cartBy: user?.email, cartProductId: datas._id };
                axiosPublic.post("/addToCartProduct", addIntoCart)
                    .then(res => {
                        // console.log(res.data);
                        if (res.data.insertedId || res.data.modifiedCount > 0) {
                            refetchCartItems();
                            navigate("/payment")
                        }
                    })
            }
            else {
                return toast("Stock not available", { position: toast.POSITION.TOP_CENTER });
            }
        }
    }

    return (
        datas ? <div className="max-w-7xl w-full mx-auto bg-white mt-10 p-4">
            <ToastContainer></ToastContainer>
            <div className="flex">
                <div className="flex flex-1 relative">
                    <div className="space-y-2 w-20">
                        {
                            datas?.productpictures?.map((pic, index) => {
                                return <img onClick={() => setImgNum(index)} className={`h-20 w-20 border-2 hover:border-red-600 ${index === imgNum ? "border-red-600" : ""}`} key={index} src={pic} alt="" />
                            })
                        }
                    </div>
                    <div className="flex-1">
                        <img src={datas?.productpictures[imgNum]} alt="" />
                    </div>
                    <div className={`absolute right-0 ${datas?.productdiscount > 0 ? "" : "hidden"}`}><button className="bg-orange-600 px-4 text-white">-{datas?.productdiscount}%</button></div>
                </div>
                <div className="flex-1 pt-5">
                    <h2 className="text-2xl">{datas?.productname}</h2>
                    <p className="my-4 font-bold">Brand: <span className="text-[#2a55e5]">{datas?.productbrand}</span></p>
                    <div className="divider"></div>
                    <div className="flex items-end gap-2">
                        {
                            datas?.productdiscount > 0 ?
                                <div>
                                    <h2 className="text-2xl font-bold text-red-500">৳ {datas?.productfinalprice}</h2>
                                    <p><del>{datas?.sellprice}</del> <span className="text-red-500">(-{datas?.productdiscount}%)</span></p>
                                </div>
                                :
                                <h2 className="text-2xl font-bold text-red-500">৳ {datas?.productfinalprice}</h2>
                        }
                    </div>
                    <div className="mt-5">
                        <pre>{datas?.productinfo}</pre>
                    </div>
                    {
                        datas?.quantity > 0 ?
                            <div className="mt-8 flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <button onClick={handleDecrease}><FiMinus></FiMinus></button>
                                    <button className="btn">{selectedQuantity}</button>
                                    <button onClick={handleIncrease}><FiPlus></FiPlus></button>
                                </div>
                                {/* <input defaultValue={1} className="border border-black w-20 py-[10px] text-center rounded-lg" type="number" name="buyingquantiy" min={1} max={20} /> */}
                                <button onClick={handleAddToCart} className="btn bg-black text-white">Add to Cart</button>
                                <button onClick={handleButtonBuy} className="btn bg-pink-700 text-white">Buy Now</button>
                                {
                                    wishlistPending ? "" : wishlist?.find(list => list.productId === datas._id) ?
                                        <Link to={"/allwishlistDetails"}>
                                            <button><FaHeart className="text-red-600 text-2xl"></FaHeart></button>
                                        </Link>
                                        :
                                        <button onClick={() => handleWishlist(datas)}><FaRegHeart className="text-red-600 text-2xl"></FaRegHeart></button>
                                }
                            </div> :
                            <p>Stock Out</p>
                    }
                </div>
            </div>
            <div className="w-full max-w-7xl mt-20 px-5">
                <h2 className="text-xl font-bold mb-10">Description</h2>
                <pre style={{ whiteSpace: 'pre-wrap' }}>{datas?.productdescription}</pre>
            </div>
        </div> :
            <div className="flex justify-center mt-10"><span className="loading loading-spinner loading-lg"></span></div>
    );
};

export default ProductDetailsPage;