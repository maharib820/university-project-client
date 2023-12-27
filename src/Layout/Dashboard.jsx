import { Link, Outlet, useLocation } from "react-router-dom";
import AdminNavbar from "../Components/AdminNavbar/AdminNavbar";
import { useState } from "react";
import Logo from "../Components/Shared/Logo/Logo";
import { ImCancelCircle } from "react-icons/im";
import { IoMdHome } from "react-icons/io";
import { LuLayoutDashboard } from "react-icons/lu";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { IoIosArrowForward } from "react-icons/io";
import { RiMenuAddFill } from "react-icons/ri";
// import { BiPurchaseTag } from "react-icons/bi";
import { FaUsersCog } from "react-icons/fa";
import { TbReorder } from "react-icons/tb";

const Dashboard = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [isOpenBtn, setIsOpenBtn] = useState(true);

    const location = useLocation();

    // Product part show or not
    const [showProductPart, setShowProductPart] = useState(true);
    const handleProductShowing = () => {
        setShowProductPart(!showProductPart);
    }

    // Category part show or not
    const [showCategoryPart, setShowCategoryPart] = useState(true);
    const handleCategoryShowing = () => {
        setShowCategoryPart(!showCategoryPart);
    }

    return (
        <div className="h-screen overflow-hidden flex relative">
            <div className={`${isOpen ? "" : "hidden lg:flex"}  w-72 bg-[#232b35] h-full flex absolute lg:relative z-50`}>
                <div className="h-full w-full flex flex-col">
                    <div className="h-20 px-5 bg-[#181d24] flex justify-between items-center">
                        <Logo></Logo>
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                setIsOpenBtn(true);
                            }} className="btn btn-square lg:hidden"><ImCancelCircle className="text-3xl"></ImCancelCircle>
                        </button>
                    </div>
                    <div className="flex-grow mb-4 flex flex-col gap-5 justify-between text-white overflow-hidden">
                        {/* Admin main section start */}
                        <div className="m-5 overflow-y-auto">
                            {/* Dashboard */}
                            <Link to={"admindashboard"}><button className={`flex items-center gap-2 mb-2 hover:bg-[#181d24] w-full px-2 py-3 rounded-md ${location.pathname === "/dashboard/admindashboard" ? "bg-[#181d24]" : ""}`}><LuLayoutDashboard></LuLayoutDashboard>Dashboard</button></Link>

                            {/* Orders */}
                            <Link to={"productordersbyuser"}><button className={`flex items-center gap-2 mb-2 hover:bg-[#181d24] w-full px-2 py-3 rounded-md ${location.pathname === "/dashboard/productordersbyuser" ? "bg-[#181d24]" : ""}`}><TbReorder></TbReorder>Orders</button></Link>

                            {/* Products */}
                            <button onClick={handleProductShowing} className={`flex justify-between items-center gap-3 mb-2 hover:bg-[#181d24] w-full px-2 py-3 rounded-md `}><div className="flex items-center gap-2"><MdOutlineProductionQuantityLimits></MdOutlineProductionQuantityLimits>Product</div><IoIosArrowForward></IoIosArrowForward></button>
                            <div className={`ml-6 space-y-2 mb-2 ${showProductPart ? "" : "hidden"}`}>
                                <Link to={"addnewproduct"}>
                                    <li className={`px-2 py-2 rounded-md ${location.pathname === "/dashboard/addnewproduct" ? "bg-[#181d24]" : ""}`}>Add New Product</li>
                                </Link>
                                <Link to={"allproduct"}>
                                    <li className={`px-2 py-2 rounded-md ${location.pathname === "/dashboard/allproduct" ? "bg-[#181d24]" : ""}`}>All Product</li>
                                </Link>
                            </div>

                            {/* Categories */}
                            <button onClick={handleCategoryShowing} className={`flex justify-between items-center gap-3 mb-2 hover:bg-[#181d24] w-full px-2 py-3 rounded-md`}><div className="flex items-center gap-2"><RiMenuAddFill></RiMenuAddFill>Categories</div><IoIosArrowForward></IoIosArrowForward></button>
                            <div className={`ml-6 space-y-2 mb-2 ${showCategoryPart ? "" : "hidden"}`}>
                                <Link to={"allcategories"}>
                                    <li className={`px-2 py-2 rounded-md ${location.pathname === "/dashboard/allcategories" ? "bg-[#181d24]" : ""}`}>
                                        All Categories
                                    </li>
                                </Link>
                                <Link to={"maincategories"}>
                                    <li className={`px-2 py-2 rounded-md ${location.pathname === "/dashboard/maincategories" ? "bg-[#181d24]" : ""}`}>
                                        Main Categories
                                    </li>
                                </Link>
                                <Link to={"subcategories"}>
                                    <li className={`px-2 py-2 rounded-md ${location.pathname === "/dashboard/subcategories" ? "bg-[#181d24]" : ""}`}>
                                        Sub Categories
                                    </li>
                                </Link>
                                <Link to={"subchildcategories"}>
                                    <li className={`px-2 py-2 rounded-md ${location.pathname === "/dashboard/subchildcategories" ? "bg-[#181d24]" : ""}`}>
                                        Sub Child Categories
                                    </li>
                                </Link>

                            </div>

                            {/* Orders
                            <Link to={"orders"}><button className={`flex items-center gap-2 mb-2 hover:bg-[#181d24] w-full px-2 py-3 rounded-md ${location.pathname === "/dashboard/orders" ? "bg-[#181d24]" : ""}`}><BiPurchaseTag></BiPurchaseTag>Orders</button></Link> */}

                            {/* Manage Users */}
                            <Link to={"manageusers"}><button className={`flex items-center gap-2 mb-2 hover:bg-[#181d24] w-full px-2 py-3 rounded-md ${location.pathname === "/dashboard/manageusers" ? "bg-[#181d24]" : ""}`}><FaUsersCog></FaUsersCog>Manage Users</button></Link>
                        </div>
                        <div className="border-t-2 px-5 pt-5">
                            <Link to={"/"}><button className="flex items-center gap-2 mb-2 bg-[#181d24] w-full px-2 py-3 rounded-md"><IoMdHome></IoMdHome>Home</button></Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex-1 flex flex-col">
                <AdminNavbar setIsOpen={setIsOpen} isOpenBtn={isOpenBtn} setIsOpenBtn={setIsOpenBtn}></AdminNavbar>
                <div className="px-5 pt-7 flex-grow bg-[#f8f7f6] overflow-y-auto w-screen lg:w-full"><Outlet></Outlet></div>
            </div>
        </div>
    );
};

export default Dashboard;