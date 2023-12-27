import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const MainPageHeader = () => {

    const axiosPublic = useAxiosPublic();

    const [allMainCategories, setAllMainCategories] = useState();
    const [allSubCategories, setAllSubCategories] = useState();
    const [allSubChildCategories, setAllSubChildCategories] = useState();

    useEffect(() => {
        axiosPublic("/allMainCategories")
            .then(res => setAllMainCategories(res.data));
        axiosPublic("/allSubCategories")
            .then(res => setAllSubCategories(res.data));
        axiosPublic("/allSubChildCategories")
            .then(res => setAllSubChildCategories(res.data));
    }, [axiosPublic])

    const [showSub, setShowSub] = useState(false);
    const [subCategories, setSubCategories] = useState(null);

    const handleCallSubCategory = (main) => {
        setShowSub(true);
        const sub = allSubCategories?.filter(amc => {
            return amc.maincategory === main;
        })
        setSubCategories(sub);
    }

    return (
        <div onMouseLeave={() => setShowSub(false)} className="flex">
            <div className="flex flex-col w-1/4 bg-white py-5 border-2 border-t-0 shadow h-fit">
                {
                    allMainCategories?.map(mainCategory => {
                        return <div key={mainCategory._id}>
                            <Link to={`maincategoryproducts/${mainCategory.maincategory}`}>
                                <button onMouseEnter={() => handleCallSubCategory(mainCategory.maincategory)} className="text-black w-full py-2 px-5 text-left hover:text-red-600">
                                    <div className="flex justify-between items-center">
                                        <div>{mainCategory.maincategory}</div>
                                        <IoIosArrowForward></IoIosArrowForward>
                                    </div>
                                </button>
                            </Link>
                        </div>
                    })
                }
            </div>
            <div className="flex-grow relative">
                <div onMouseLeave={() => setShowSub(false)} className={`w-full min-h-full bg-white border-2 absolute left-0 top-0 p-5 grid grid-cols-4 gap-5 ${showSub ? "" : "hidden"}`}>
                    {
                        subCategories?.map(subCategory => {
                            return <div key={subCategory._id}>
                                <Link to={`subcategoryproducts/${subCategory.subcategory}`}>
                                    <button className="font-bold text-sm text-left">{subCategory.subcategory}</button>
                                </Link>
                                <div className="flex flex-col space-y-2 mt-2">
                                    {
                                        allSubChildCategories?.map((bb, index) => {
                                            return bb.subcategory === subCategory.subcategory ? <Link key={index} to={`childcategoryproducts/${bb.subchildcategory}`}>
                                                <button className="text-sm text-left">{bb.subchildcategory}</button>
                                            </Link> : ""
                                        })
                                    }
                                </div>
                            </div>
                        })
                    }
                </div>
                <img className="w-full pr-[2px] border-t" src="https://i.ibb.co/Vj26KbZ/banner1.jpg" alt="" />
            </div>
        </div>
    );
};

export default MainPageHeader;