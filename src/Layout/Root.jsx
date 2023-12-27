import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar/Navbar";

const Root = () => {
    return (
        <div className="bg-[#f1f2f4] min-h-screen relative">
            <div className="sticky z-50"><Navbar></Navbar></div>
            <Outlet></Outlet>
        </div>
    );
};

export default Root;