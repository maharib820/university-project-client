import { useQuery } from "@tanstack/react-query";
import MainPageHeader from "../../Components/MainPageHeader/MainPageHeader";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { useNavigate } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import { useEffect, useState } from "react";

const Main = () => {

    const axiosPublic = useAxiosPublic();

    const { data: topfivesold } = useQuery({
        queryKey: ["topfivesold"],
        queryFn: async () => {
            const res = await axiosPublic.get("/topfivesold");
            return res.data
        }
    })

    const { data: topfivepremium } = useQuery({
        queryKey: ["topfivepremium"],
        queryFn: async () => {
            const res = await axiosPublic.get("/topfivepremium");
            return res.data
        }
    })

    const { data: topfivenew } = useQuery({
        queryKey: ["topfivenew"],
        queryFn: async () => {
            const res = await axiosPublic.get("/topfivenew");
            return res.data
        }
    })

    const { user } = useAuth();
    const navigate = useNavigate();

    const [recent, setRecent] = useState(null);

    const { data: recentt } = useQuery({
        queryKey: ["recentt"],
        queryFn: async () => {
            const res = await axiosPublic.get(`/meviewwe/${user.email}`);
            setRecent(res.data)
        }
    })
    console.log(recentt);

    useEffect(() => {
        user && axiosPublic.get(`/meviewwe/${user.email}`)
            .then(res => {
                setRecent(res.data)
            })
    }, [axiosPublic, user])

    const [recommended, setRecommended] = useState(null);

    const { data: rec } = useQuery({
        queryKey: ["rec"],
        queryFn: async () => {
            const res = await axiosPublic.get(`/recommended/${user.email}`);
            setRecommended(res.data)
        }
    })
    console.log(rec);

    useEffect(() => {
        user && axiosPublic.get(`/recommended/${user.email}`)
            .then(res => {
                setRecommended(res.data)
            })
    }, [axiosPublic, user])

    const handleBtnClick = (id) => {
        const visitData = {
            email: user?.email,
            productId: id,
            viewedDate: new Date()
        };
        axiosPublic.post("/recentlyvisited", visitData)
            .then(res => {
                console.log(res.data);
            })
        navigate(`/productdetails/${id}`);
    }

    return (
        <div className="max-w-7xl mx-auto">
            <MainPageHeader></MainPageHeader>
            <div className="mt-20">
                <h2 className="text-2xl mb-5">Most Sold</h2>
                <div className="flex gap-3">
                    {
                        topfivesold?.map(product => {
                            return <div key={product._id} className="border-2 shadow flex-1">
                                {/* <Link to={`/productdetails/${product._id}`}> */}
                                <button onClick={() => handleBtnClick(product._id)}>
                                    <div>
                                        <img className="h-52" src={product.productpictures[0]} alt="" />
                                        <div className="p-2">
                                            <div className=""><h2 className="mt-5 text-blue-800">{product.productname}</h2></div>
                                            <p className="text-red-600">৳ {product.productfinalprice}</p>
                                        </div>
                                    </div>
                                </button>
                                {/* </Link> */}
                            </div>
                        })
                    }
                </div>
            </div>
            <div className="mt-20">
                <h2 className="text-2xl mb-5">Premium Collection</h2>
                <div className="flex gap-3">
                    {
                        topfivepremium?.map(product => {
                            return <div key={product._id} className="border-2 shadow flex-1">
                                {/* <Link to={`/productdetails/${product._id}`}> */}
                                <button onClick={() => handleBtnClick(product._id)}>
                                    <div>
                                        <img className="h-52" src={product.productpictures[0]} alt="" />
                                        <div className="p-2">
                                            <h2 className="mt-5 text-blue-800">{product.productname}</h2>
                                            <p className="text-red-600">৳{product.productfinalprice}</p>
                                        </div>
                                    </div>
                                </button>
                                {/* </Link> */}
                            </div>
                        })
                    }
                </div>
            </div>
            <div className="mt-20">
                <h2 className="text-2xl mb-5">New Collection</h2>
                <div className="flex gap-3">
                    {
                        topfivenew?.map(product => {
                            return <div key={product._id} className="border-2 shadow flex-1">
                                {/* <Link to={`/productdetails/${product._id}`}> */}
                                <button onClick={() => handleBtnClick(product._id)}>
                                    <div>
                                        <img className="h-52" src={product.productpictures[0]} alt="" />
                                        <div className="p-2">
                                            <h2 className="mt-5 text-blue-800">{product.productname}</h2>
                                            <p className="text-red-600">৳{product.productfinalprice}</p>
                                        </div>
                                    </div>
                                </button>
                                {/* </Link> */}
                            </div>
                        })
                    }
                </div>
            </div>
            <div className="mt-20">
                <h2 className="text-2xl mb-5">Recently Visited</h2>
                <div className="grid grid-cols-6 gap-3">
                    {
                        recent?.map(product => {
                            return <div key={product.mrv._id} className="border-2 shadow flex-1">
                                {/* <Link to={`/productdetails/${product._id}`}> */}
                                <button onClick={() => handleBtnClick(product.mrv._id)}>
                                    <div>
                                        <img className="h-52" src={product.mrv.productpictures[0]} alt="" />
                                        <div className="p-2">
                                            <h2 className="mt-5 text-blue-800">{product.mrv.productname}</h2>
                                            <p className="text-red-600">৳{product.mrv.productfinalprice}</p>
                                        </div>
                                    </div>
                                </button>
                                {/* </Link> */}
                            </div>
                        })
                    }
                </div>
            </div>
            <div className="mt-20">
                <h2 className="text-2xl mb-5">Recommended Products</h2>
                <div className="grid grid-cols-6 gap-3">
                    {
                        recommended?.map(product => {
                            return <div key={product._id} className="border-2 shadow flex-1">
                                {/* <Link to={`/productdetails/${product._id}`}> */}
                                <button onClick={() => handleBtnClick(product._id)}>
                                    <div>
                                        <img className="h-52" src={product.productpictures[0]} alt="" />
                                        <div className="p-2">
                                            <h2 className="mt-5 text-blue-800">{product.productname}</h2>
                                            <p className="text-red-600">৳{product.productfinalprice}</p>
                                        </div>
                                    </div>
                                </button>
                                {/* </Link> */}
                            </div>
                        })
                    }
                </div>
            </div>
            <footer className="footer p-10 bg-black text-white mt-20">
                <aside>
                    <svg width="50" height="50" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" className="fill-current"><path d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z"></path></svg>
                    <p>Eshopz.<br />Providing reliable service since 2023</p>
                </aside>
                <nav>
                    <header className="footer-title">Services</header>
                    <a className="link link-hover">Product Selling</a>
                    <a className="link link-hover">Online Payment</a>
                    <a className="link link-hover">Delivery</a>
                </nav>
                <nav>
                    <header className="footer-title">Company</header>
                    <a className="link link-hover">About us</a>
                    <a className="link link-hover">Contact</a>
                </nav>
                <nav>
                    <header className="footer-title">Legal</header>
                    <a className="link link-hover">Terms of use</a>
                    <a className="link link-hover">Privacy policy</a>
                    <a className="link link-hover">Cookie policy</a>
                </nav>
            </footer>
        </div>
    );
};

export default Main;