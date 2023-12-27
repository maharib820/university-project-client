import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import ShowProducts from "../../Components/ShowProducts/ShowProducts";

const MainCategoryProducts = () => {

    const params = useParams();

    const axiosPublic = useAxiosPublic();

    const { data: msubcategories } = useQuery({
        queryKey: ["msubcategories"],
        queryFn: async () => {
            const res = await axiosPublic(`/allSubCategoriesOnMainCategory/${params.mainCategoryName}`);
            return res.data;
        }
    });

    const { data: products } = useQuery({
        queryKey: ["products"],
        queryFn: async () => {
            const res = await axiosPublic(`/getallproducts/${params.mainCategoryName}`);
            return res.data;
        }
    });

    return (
        <div className="max-w-7xl mx-auto mt-8">
            <div className="flex flex-wrap justify-start gap-5">
                {
                    msubcategories?.map(ms => {
                        return <Link to={`/subcategoryproducts/${ms.subcategory}`} key={ms._id}><button className="btn btn-outline btn-info">{ms.subcategory}</button></Link>
                    })
                }
            </div>
            <div className="grid grid-cols-4 gap-5 mt-10">
                {
                    products?.map(product => {
                        return <ShowProducts key={product._id} product={product}></ShowProducts>
                    })
                }
            </div>
        </div>
    );
};

export default MainCategoryProducts;