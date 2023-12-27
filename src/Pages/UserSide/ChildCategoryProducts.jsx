import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import ShowProducts from "../../Components/ShowProducts/ShowProducts";

const ChildCategoryProducts = () => {

    const params = useParams();
    console.log(params);

    const axiosPublic = useAxiosPublic();

    const { data: childproducts } = useQuery({
        queryKey: ["childproducts"],
        queryFn: async () => {
            const res = await axiosPublic(`/getallchildproducts/${params.childCategoryName}`);
            return res.data;
        }
    });

    return (
        <div className="max-w-7xl mx-auto mt-8">
            <div className="grid grid-cols-4 gap-5 mt-10">
                {
                    childproducts?.map(product => {
                        return <ShowProducts key={product._id} product={product}></ShowProducts>
                    })
                }
            </div>
        </div>
    );
};

export default ChildCategoryProducts;