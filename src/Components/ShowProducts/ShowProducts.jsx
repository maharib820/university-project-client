import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const ShowProducts = ({ product }) => {
    return (
        <Link to={`/productdetails/${product._id}`}>
            <div className="bg-white p-5 space-y-3 rounded-lg">
                <img src={product.productpictures[0]} alt="" />
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
        </Link>
    );
};

export default ShowProducts;

ShowProducts.propTypes = {
    product: PropTypes.object
}