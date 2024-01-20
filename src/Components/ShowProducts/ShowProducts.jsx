import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../Hooks/useAuth';
import useAxiosPublic from '../../Hooks/useAxiosPublic';

const ShowProducts = ({ product }) => {

    const navigate = useNavigate();

    const { user } = useAuth();
    const axiosPublic = useAxiosPublic();

    const handleBtnClick = () => {
        const visitData = {
            email: user?.email,
            productId: product._id,
            viewedDate: new Date()
        };
        axiosPublic.post("/recentlyvisited", visitData)
            .then(res => {
                console.log(res.data);
            })
        navigate(`/productdetails/${product._id}`);
    }

    return (
        // <Link to={`/productdetails/${product._id}`}>
        <button onClick={handleBtnClick}>
            <div className="bg-white p-5 space-y-3 rounded-lg flex flex-col h-full">
                <div className='flex h-full'>
                    <img style={{ maxHeight: '250px' }} className='flex-grow object-cover' src={product.productpictures[0]} alt="" />
                </div>
                <p className="text-[#0066cc]">{product.productname}</p>
                <p>Brand: {product.productbrand}</p>
                <div>
                    {
                        product.productdiscount === 0 ?
                            <div className="text-xl text-red-600">
                                <p>৳ {product.productfinalprice}</p>
                            </div>
                            :
                            <div className="flex gap-2">
                                <p className="text-xl text-red-600">৳ {product.productfinalprice}</p>
                                <p className="text-xl text-[#999999]"><del>৳ {product.sellprice}</del></p>
                            </div>
                    }
                </div>
            </div>
        </button>
        // </Link>
    );
};

export default ShowProducts;

ShowProducts.propTypes = {
    product: PropTypes.object
}