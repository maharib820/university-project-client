import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import ShowProducts from "../../Components/ShowProducts/ShowProducts";

const SubCategoryProducts = () => {

    const params = useParams();

    const axiosPublic = useAxiosPublic();

    const { data: scubcategories } = useQuery({
        queryKey: ["scubcategories"],
        queryFn: async () => {
            const res = await axiosPublic(`/allSubChildCategoriesOnSubCategory/${params.subCategoryName}`);
            return res.data;
        }
    });

    const { data: subproducts } = useQuery({
        queryKey: ["subproducts"],
        queryFn: async () => {
            const res = await axiosPublic(`/getallsubproducts/${params.subCategoryName}`);
            return res.data;
        }
    });

    return (
        <div className="max-w-7xl mx-auto mt-8">
            <div className="flex flex-wrap justify-start gap-5">
                {
                    scubcategories?.map(ms => {
                        return <Link to={`/childcategoryproducts/${ms.subchildcategory}`} key={ms._id}><button className="btn btn-outline btn-info">{ms.subchildcategory}</button></Link>
                    })
                }
            </div>
            <div className="grid grid-cols-4 gap-5 mt-10">
                {
                    subproducts?.map(product => {
                        return <ShowProducts key={product._id} product={product}></ShowProducts>
                    })
                }
            </div>
        </div>
    );
};

export default SubCategoryProducts;