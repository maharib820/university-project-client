import { useQuery } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import useAxiosPrivate from "../../Hooks/useAxiosPrivate";
import { useState } from "react";
import Swal from "sweetalert2";
import { RiDeleteBin3Fill } from "react-icons/ri";
import moment from "moment";
import { DataGrid } from "@mui/x-data-grid";

const HomePageSlider = () => {

    const axiosPrivate = useAxiosPrivate();
    const imgbbKey = import.meta.env.VITE_imagebb_key;
    const imgbbAPI = `https://api.imgbb.com/1/upload?key=${imgbbKey}`;

    const { data: allBanners, refetch } = useQuery({
        queryKey: ["allBanners"],
        queryFn: async () => {
            const res = await axiosPrivate("/allBanners");
            return res.data;
        }
    });

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

    const handleAddBanner = async (event) => {
        event.preventDefault();
        const form = event.target;
        const maincategory = form.maincategory.value;
        if (maincategory === "Select Main Category") {
            return toast("Select Main Category", { position: toast.POSITION.TOP_CENTER });
        }
        let subcategory = form.subcategory.value;
        if (subcategory === "Select Sub Category") {
            subcategory = "null";
        }
        let subchildcategory = form.subchildcategory.value;
        if (subchildcategory === "Select Sub Child Category") {
            subchildcategory = "null";
        }
        const banneraddedDate = new Date();
        const imagefile = { image: form.bannerimage.files[0] };
        const res = await axiosPrivate.post(imgbbAPI, imagefile, {
            headers: {
                "content-type": "multipart/form-data"
            }
        });
        if (res.data.success) {
            const banner = res.data.data.display_url;
            let data;
            if (subcategory === 'null' && subchildcategory === 'null') {
                data = { maincategory, banneraddedDate, banner };
                console.log(data);
            }
            else if (subchildcategory === 'null') {
                data = { maincategory, subcategory, banneraddedDate, banner };
                console.log(data);
            }
            else {
                data = { maincategory, subcategory, subchildcategory, banneraddedDate, banner };
                console.log(data);
            }
            axiosPrivate.post("/addhomebanner", data)
                .then(res => {
                    if (res.data.insertedId) {
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: "Banner has been added",
                            showConfirmButton: false,
                            timer: 1500
                        });
                        form.reset();
                        refetch();
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
                    }
                })
        }
    }

    const columns = [
        {
            field: 'banner',
            headerName: 'Banner Image',
            flex: 1,
            renderCell: (params) => (
                <img src={params.row.banner} alt="" style={{ width: '100%', height: '99%', marginTop: "2px", marginBottom: "2px" }} />
            ),
        },
        { field: 'maincategory', headerName: 'Main Category', flex: 1 },
        { field: 'subcategory', headerName: 'Sub Category', flex: 1 },
        { field: 'subchildcategory', headerName: 'Sub Child Category', flex: 1 },
        {
            field: 'banneraddedDate',
            headerName: 'Created on',
            flex: 1,
        },
        {
            field: 'delete',
            headerName: 'Delete',
            flex: 1,
            renderCell: (params) => (
                <button onClick={() => {
                    const value = allBanners?.filter(sb => sb._id === params.row.id);
                    console.log(value[0]._id);
                    axiosPrivate.delete(`/deletebannerimage/${value[0]._id}`)
                        .then((res) => {
                            console.log(res.data);
                            refetch();
                        })
                }}>
                    <RiDeleteBin3Fill className="text-xl text-red-600" />
                </button>
            ),
        },
    ];

    const rows = allBanners?.map((sm) => ({
        id: sm._id,
        banner: sm.banner,
        maincategory: sm.maincategory,
        subcategory: sm.subcategory,
        subchildcategory: sm.subchildcategory,
        banneraddedDate: moment(sm.banneraddedDate).format('MMMM Do YYYY, h:mm:ss a'),
    }));

    return (
        <div className="">
            <ToastContainer></ToastContainer>
            <h2 className="font-bold text-2xl mb-5">Banners</h2>
            <div className="flex flex-col xl:flex-row gap-5">
                <div className="w-full xl:w-1/3 shadow-lg p-6 bg-white rounded-lg h-fit">
                    <p className="mb-5 font-semibold">Add Home Page Bannner</p>
                    <form onSubmit={handleAddBanner} className="space-y-4">
                        <select onChange={handleMainCategorySelect} defaultValue={"Select Main Category"} name="maincategory" className="select select-bordered w-full rounded" required>
                            <option disabled>Select Main Category</option>
                            {
                                allMainCategories?.map(category => <option key={category._id}>{category.maincategory}</option>)
                            }
                        </select>
                        <select onChange={handleSubCategorySelect} defaultValue={"Select Sub Category"} name="subcategory" className="select select-bordered w-full rounded" required>
                            <option disabled>Select Sub Category</option>
                            {
                                subCategories?.map(category => <option key={category._id}>{category.subcategory}</option>)
                            }
                        </select>
                        <select defaultValue={"Select Sub Child Category"} name="subchildcategory" className="select select-bordered w-full rounded" required>
                            <option disabled>Select Sub Child Category</option>
                            {
                                subChildCategories?.map(category => <option key={category._id}>{category.subchildcategory}</option>)
                            }
                        </select>
                        <input name="bannerimage" type="file" accept="image/*" className="file-input file-input-bordered w-full rounded focus:border-none" required />
                        <input className="btn bg-green-500 text-white" type="submit" value="Add Banner Image" />
                    </form>
                </div>
                <div className="w-full shadow-lg p-6 bg-white rounded-lg h-fit">
                    <p className="mb-5 font-semibold">All Added Banners</p>
                    {
                        allBanners && allBanners.length > 0 ?
                            <div style={{ height: 400, width: '100%' }}>
                                <DataGrid
                                    rows={rows}
                                    columns={columns}
                                    pageSize={5}
                                />
                            </div> : ""
                    }
                </div>
            </div>
        </div>
    );
};

export default HomePageSlider;