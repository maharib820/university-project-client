import Logo from "../Shared/Logo/Logo";
import { IoIosSearch } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { LuUserCircle } from "react-icons/lu";
import { FaRegHeart } from "react-icons/fa";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { GrCube } from "react-icons/gr";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import Swal from "sweetalert2";
import useRole from "../../Hooks/useRole";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { useEffect, useState } from "react";
import useWishlist from "../../Hooks/useWishlist";
import { RxCross2 } from "react-icons/rx";
import { MdCancel } from "react-icons/md";
import useCart from "../../Hooks/useCart";
import { FiMinus, FiPlus } from "react-icons/fi";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Navbar = () => {

    // Managing login and profile button depends on user
    const { user, loading, logoutUser } = useAuth();

    const handleLogout = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You want to logout!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, logout!"
        }).then((result) => {
            if (result.isConfirmed) {
                logoutUser();
                Swal.fire({
                    title: "Logout!",
                    text: "You logout successfully",
                    icon: "success"
                });
            }
        });
    }

    const status = useRole();

    const axiosPublic = useAxiosPublic();

    const [searched, setSearched] = useState(null);
    const [show, setShow] = useState(false);

    const handleSearch = (event) => {
        if (!event.target.value) {
            setShow(false);
        } else {
            setShow(true);
            axiosPublic(`/getsearchproducts?search=${event.target.value}`)
                .then(res => {
                    setSearched(res.data);
                })
        }
    }

    const navigate = useNavigate();

    const handleSearchButton = () => {
        if (searched && searched.length > 0) {
            const sendSearch = searched;
            setSearched(null);
            setShow(false);
            navigate("/searchproducts", { state: { data: sendSearch } })
        }
    }

    const { wishlist, refetchWishlist } = useWishlist();
    const [showWishlistBanner, setWishlistBanner] = useState(false);
    const handleWishItemDelete = (id) => {
        axiosPublic.delete(`/mywishlistelement/${id}`)
            .then(res => {
                console.log(res.data);
                refetchWishlist();
            })
    }

    // cart part
    const { cartItems, refetchCartItems } = useCart();
    const [showCartBanner, setCartBanner] = useState(false);

    const handleDecrease = (value, cartProductId) => {
        if (value <= 1) {
            return
        }
        else {
            const datas = { cartBy: user?.email, cartProductId, totalSelectedItems: -1 };
            // console.log(datas);
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

    const [paymentAmount, setPaymentAmount] = useState(0);

    useEffect(() => {
        const totalAmount = cartItems?.map(item => item.totalSelectedItems * item.cartItemsList.productfinalprice)
            .reduce((acc, currentValue) => acc + currentValue, 0);
        setPaymentAmount(totalAmount);
    }, [cartItems])

    // console.log(cartItems);

    const handleCartItemDelete = (id) => {
        axiosPublic.delete(`/mycartelement/${id}`)
            .then(res => {
                console.log(res.data);
                refetchCartItems();
            })
    }

    return (
        <div className="h-20 shadow w-full bg-white">
            <ToastContainer></ToastContainer>
            <div className={`h-screen flex flex-col w-1/3 bg-white shadow absolute right-0 z-50 p-10 overflow-hidden ${(showWishlistBanner && !showCartBanner) ? "" : "hidden"}`}>
                <div className="flex justify-between items-center">
                    <h2 className="text-xl">My Wishlists</h2>
                    <button onClick={() => setWishlistBanner(false)}><RxCross2 className="text-2xl"></RxCross2></button>
                </div>
                <div className="flex flex-col justify-between flex-grow relative">
                    <div className="space-y-2 mt-20">
                        {
                            wishlist?.map(wish => {
                                return <div key={wish._id} className="flex border-2">
                                    <div className="w-1/4 border-r"><img className="w-full" src={wish.wishlistItems.productpictures[0]} alt="" /></div>
                                    <div className="flex-1 flex flex-col justify-between p-5">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-lg">{wish.wishlistItems.productname}</h3>
                                            <button onClick={() => handleWishItemDelete(wish._id)}><MdCancel className="text-red-600 text-2xl"></MdCancel></button>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <h2>৳ {wish.wishlistItems.productfinalprice}</h2>
                                            <Link onClick={() => setWishlistBanner(false)} to={`/productdetails/${wish.wishlistItems._id}`}><button><div className="badge badge-outline">product details</div></button></Link>
                                        </div>
                                    </div>
                                </div>
                            })
                        }
                    </div>
                    <Link onClick={() => setWishlistBanner(false)} to={"allwishlistDetails"}>
                        <div className="w-full bg-black text-white h-12">
                            <button className="w-full h-full font-bold">View</button>
                        </div>
                    </Link>
                </div>
            </div>
            {/* cart banner part */}
            <div className={`h-screen flex flex-col w-1/3 bg-white shadow absolute right-0 z-50 p-10 overflow-hidden ${(showCartBanner && !showWishlistBanner) ? "" : "hidden"}`}>
                <div className="flex justify-between items-center">
                    <h2 className="text-xl">My Cart</h2>
                    <button onClick={() => setCartBanner(false)}><RxCross2 className="text-2xl"></RxCross2></button>
                </div>
                <div className="flex flex-col justify-between flex-grow">
                    <div className="space-y-2 mt-20 m-1">
                        {
                            cartItems?.map(cart => {
                                return <div key={cart._id} className="flex border-2 rounded-md">
                                    <div className="w-1/4 border-r"><img className="w-full" src={cart.cartItemsList.productpictures[0]} alt="" /></div>
                                    <div className="flex-1 flex flex-col justify-between p-5">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-lg">{cart.cartItemsList.productname}</h3>
                                            <button onClick={() => handleCartItemDelete(cart._id)}><MdCancel className="text-red-600 text-2xl"></MdCancel></button>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <h2>{cart.totalSelectedItems} X {cart.cartItemsList.productfinalprice} ৳</h2>
                                            <div className="flex items-center gap-2">
                                                <button className="bg-[#d4d2d2] p-1 rounded-full" onClick={() => handleDecrease(cart.totalSelectedItems, cart.cartProductId)}><FiMinus></FiMinus></button>
                                                <p className="mx-2 border px-4 py-1">{cart.totalSelectedItems}</p>
                                                <button className="bg-[#d4d2d2] p-1 rounded-full" onClick={() => handleIncrease(cart.totalSelectedItems, cart.cartProductId, cart.cartItemsList.quantity)}><FiPlus></FiPlus></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            })
                        }
                    </div>
                    <div className="space-y-8">
                        <div className="flex justify-between items-center">
                            <div><h2 className="text-xl font-bold">Subtotal:</h2></div>
                            <div><h2 className="text-xl font-bold text-red-600">{paymentAmount}</h2></div>
                        </div>
                        <div className="flex justify-between items-center">
                            <Link onClick={() => setCartBanner(false)} to={"/viewcartpage"}>
                                <div className="w-full bg-[#c7003a] text-white h-12 px-10 rounded">
                                    <button className="w-full h-full font-bold px-10 rounded-lg">View Cart</button>
                                </div>
                            </Link>
                            {
                                cartItems?.length > 0 ?
                                    <Link to={"/payment"} onClick={() => setCartBanner(false)}>
                                        <div className="w-full bg-[#c7003a] text-white h-12 px-10 rounded">
                                            <button className="w-full h-full font-bold">Checkout</button>
                                        </div>
                                    </Link>
                                    :
                                    <Link onClick={() => setCartBanner(false)}>
                                        <div className="w-full bg-[#c7003a] text-white h-12 px-10 rounded">
                                            <button className="w-full h-full font-bold">Checkout</button>
                                        </div>
                                    </Link>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full lg:max-w-7xl mx-auto h-full flex justify-between items-center px-5 xl:px-0">
                <div>
                    <Link to={"/"}><Logo></Logo></Link>
                </div>
                <div className="relative">
                    <div className="relative hidden lg:flex">
                        <input onChange={handleSearch} className="w-[500px] h-10 bg-[#f0f5ff] outline-none pl-4 pr-14" type="text" name="searchitems" placeholder="Search for products" />
                        <button onClick={handleSearchButton} className="text-xl absolute translate-y-1/2 right-2 px-2"><IoIosSearch></IoIosSearch></button>
                    </div>
                    <div className={`max-h-80 overflow-hidden overflow-y-auto py-2 h-fit w-full bg-[#f0f5ff] border-t-2 absolute ${show ? "" : "hidden"}`}>
                        {
                            searched?.map(search => {
                                return <Link to={`/productdetails/${search._id}`} key={search._id} onClick={() => setShow(false)}>
                                    <div className="px-2 mb-2 flex gap-4">
                                        <img className="h-16" src={search.productpictures[0]} alt="" />
                                        <div>
                                            <p className="text-[#0066cc]">{search.productname}</p>
                                            <div>
                                                {
                                                    search.productdiscount === 0 ?
                                                        <div className="text-red-600">
                                                            <p>৳ {search.productfinalprice}</p>
                                                        </div>
                                                        :
                                                        <div className="flex gap-2">
                                                            <p className="text-red-600">৳ {search.productfinalprice}</p>
                                                            <p className="text-[#999999]"><del>৳ {search.sellprice}</del></p>
                                                        </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            })
                        }
                    </div>
                </div>
                <div className="flex items-center gap-5 md:gap-10 xl:gap-6">
                    <div className="dropdown dropdown-hover">
                        {
                            loading ? <button className="btn rounded-md lg:px-3 bg-transparent border-none text-black shadow-none"><span className="loading loading-spinner"></span>loading</button>
                                :
                                user ?
                                    <div>
                                        <button className="p-[2px] rounded-full bg-transparent border-none shadow-none hover:bg-slate-400 hover:text-white m-1">
                                            <img className="h-10 w-10 rounded-full" src={user.photoURL} alt="profile picture" />
                                        </button>
                                        <div className="dropdown-content z-50 menu shadow bg-white w-52 -right-24 md:left-0 rounded-b-md border">
                                            <div>
                                                {
                                                    status?.status === "admin" ?
                                                        <div>
                                                            <div className="flex items-center justify-between">
                                                                <p className="font-semibold">Admin</p>
                                                                <Link to={"dashboard/admindashboard"}><h1 className="font-bold text-[#2a55e5]">Dashboard</h1></Link>
                                                            </div>
                                                            <div className="divider w-full"></div>
                                                        </div> : ""
                                                }
                                                <div className="mb-4">
                                                    <Link to={"/userprofile"}><button className="flex items-center gap-2 font-bold mb-5"><LuUserCircle className="text-lg"></LuUserCircle> My Profile</button></Link>
                                                    <Link to={"/userorderpage"}><button className="flex items-center gap-2 font-bold mb-5"><GrCube className="text-lg"></GrCube> Orders</button></Link>
                                                    <Link to={"/viewcartpage"}><button className="flex items-center gap-2 font-bold mb-5"><MdOutlineProductionQuantityLimits className="text-lg"></MdOutlineProductionQuantityLimits> Carts</button></Link>
                                                    <Link to={"/allwishlistDetails"}><button className="flex items-center gap-2 font-bold"><FaRegHeart className="text-lg"></FaRegHeart> Wishlists</button></Link>
                                                </div>
                                                <button onClick={handleLogout} className="btn w-full">Logout</button>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <div>
                                        <Link to={"login"}>
                                            <button className="btn rounded-md lg:px-3 bg-transparent border-none text-black shadow-none hover:bg-primary hover:text-white m-1">
                                                <LuUserCircle className="text-xl"></LuUserCircle>
                                                Login
                                                <IoIosArrowDown className="hidden xl:flex"></IoIosArrowDown>
                                            </button>
                                        </Link>
                                        <div className="dropdown-content z-[1] menu shadow bg-white w-52 mr-10 rounded-b-md border">
                                            <div>
                                                <div className="flex items-center justify-between">
                                                    <p className="font-semibold">New customer?</p>
                                                    <Link to={"register"}><h1 className="font-bold text-[#2a55e5]">Sign Up</h1></Link>
                                                </div>
                                                <div className="divider w-full"></div>
                                                <Link to={"login"}><button className="btn w-full">Login</button></Link>
                                            </div>
                                        </div>
                                    </div>
                        }
                    </div>
                    <div>
                        <button onClick={() => setWishlistBanner(true)} className="btn px-0 bg-transparent border-none text-black shadow-none hover:bg-transparent">
                            <div className="relative mr-1">
                                <p className="absolute p-1 rounded-full bg-red-600 text-white -mt-5 ml-4">{wishlist?.length}</p>
                                <FaRegHeart className="text-xl"></FaRegHeart>
                            </div>
                            <p className="hidden md:flex">Wishlist</p>
                        </button>
                    </div>
                    <div>
                        <button onClick={() => setCartBanner(true)} className="btn px-0 font-bold bg-transparent border-none text-black shadow-none hover:bg-transparent">
                            <div className="relative mr-1">
                                <p className="absolute p-1 rounded-full bg-red-600 text-white -mt-5 ml-4">{
                                    cartItems?.reduce((accumulator, currentItem) => accumulator + currentItem.totalSelectedItems, 0)
                                }</p>
                                <MdOutlineProductionQuantityLimits className="text-xl"></MdOutlineProductionQuantityLimits>
                            </div>
                            <p className="hidden md:flex">Cart</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;