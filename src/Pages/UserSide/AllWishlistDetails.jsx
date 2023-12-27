import { Link } from "react-router-dom";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import useWishlist from "../../Hooks/useWishlist";
import { RxCrossCircled } from "react-icons/rx";

const AllWishlistDetails = () => {

    const axiosPublic = useAxiosPublic();

    const { wishlist, refetchWishlist } = useWishlist();
    // console.log(wishlist);

    const handleWishItemDelete = (id) => {
        axiosPublic.delete(`/mywishlistelement/${id}`)
            .then(res => {
                console.log(res.data);
                refetchWishlist();
            })
    }

    return (
        <div className="max-w-7xl mx-auto mt-10">
            <h2 className="mb-10 text-xl">My Wishlist on Eshopz</h2>
            <div className="overflow-x-auto">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr className="bg-white text-black text-base">
                            <th></th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Unit Price</th>
                            <th>Stock Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            wishlist?.map(list => {
                                return <tr key={list._id} className="border-b border-b-black">
                                    <th><button onClick={() => handleWishItemDelete(list._id)}><RxCrossCircled className="text-2xl text-red-600"></RxCrossCircled></button></th>
                                    <td><img className="w-14" src={list.wishlistItems.productpictures} alt="" /></td>
                                    <td><Link to={`/productdetails/${list.productId}`}><p className="text-blue-800">{list.wishlistItems.productname}</p></Link></td>
                                    <td>
                                        {
                                            list.wishlistItems.productdiscount ?
                                                <div>{list.wishlistItems.productfinalprice}</div>
                                                :
                                                <div>{list.wishlistItems.productfinalprice}</div>
                                        }
                                    </td>
                                    <td>
                                        {
                                            list.wishlistItems.quantity > 0 ?
                                                <div><p className="text-green-500">Stock Available</p></div>
                                                :
                                                <div className="text-red-600"><p>Stock Out</p></div>
                                        }
                                    </td>
                                </tr>
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllWishlistDetails;