import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import useAxiosPrivate from "../../Hooks/useAxiosPrivate";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Banner = () => {

    const axiosPrivate = useAxiosPrivate();
    const [banners, setBanners] = useState();

    useEffect(() => {
        axiosPrivate.get("/allBanners")
            .then(res => {
                setBanners(res.data);
            })
    }, [axiosPrivate])

    // console.log(banners);

    return (
        <div className="w-full">
            <Carousel autoPlay infiniteLoop className="w-full max-w-full" showThumbs={false}>
                {
                    banners?.map(banner => {
                        return banner.maincategory && banner.subcategory && banner.subchildcategory ?
                            <Link key={banner._id} to={`childcategoryproducts/${banner.subchildcategory}`}>
                                <div>
                                    <img className="flex-1" src={banner.banner} />
                                </div>
                            </Link> : banner.maincategory && banner.subcategory && !banner.subchildcategory ?
                                <Link key={banner._id} to={`subcategoryproducts/${banner.subcategory}`}>
                                    <div>
                                        <img className="flex-1" src={banner.banner} />
                                    </div>
                                </Link> :
                                <Link key={banner._id} to={`maincategoryproducts/${banner.maincategory}`}>
                                    <div>
                                        <img className="flex-1" src={banner.banner} />
                                    </div>
                                </Link>
                    })
                }
            </Carousel>
        </div>
    );
};

export default Banner;