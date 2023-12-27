import { useLocation } from "react-router-dom";
import ShowProducts from "../../Components/ShowProducts/ShowProducts";

const SearchedProduct = () => {

    const location = useLocation();
    console.log(location.state);

    return (
        <div className="max-w-7xl mx-auto mt-8">
            <div className="grid grid-cols-4 gap-5 mt-10">
                {
                    location?.state?.data?.map((product, index) => {
                        return <ShowProducts key={index} product={product}></ShowProducts>
                    })
                }
            </div>
        </div>
    );
};

export default SearchedProduct;