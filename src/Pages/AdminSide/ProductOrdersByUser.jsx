import { useQuery } from "@tanstack/react-query";
import { MdEdit } from "react-icons/md";
import useAxiosPrivate from "../../Hooks/useAxiosPrivate";
import Swal from "sweetalert2";

const ProductOrdersByUser = () => {

    const axiosPrivate = useAxiosPrivate();

    const { data: orderProduct, refetch } = useQuery({
        queryKey: ["orderProduct"],
        queryFn: async () => {
            const res = await axiosPrivate("/orderProductByUser");
            return res.data;
        }
    });

    // console.log(orderProduct);

    const handleStatus = (id, status) => {
        console.log(id);
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, change"
        }).then((result) => {
            if (result.isConfirmed) {
                axiosPrivate.put(`/updatestatus/${id}`, { status: status })
                    .then(res => {
                        console.log(res.data);
                        if (res.data.modifiedCount > 0) {
                            refetch()
                            Swal.fire({
                                title: "Updated",
                                text: "status updated successfully",
                                icon: "success"
                            });
                        }
                    })
            }
        });
    }

    return (
        <div>
            <h2 className="font-bold text-2xl mb-5">Orders</h2>
            <div className="shadow-lg p-6 bg-white rounded-lg">
                <p className="mb-5 font-semibold pb-4 border-b">Orders List</p>
                <div className="overflow-x-auto">
                    <table className="table">
                        {/* head */}
                        <thead>
                            <tr>
                                <th>User Email</th>
                                <th>Products</th>
                                <th>Total Price</th>
                                <th>User Address</th>
                                <th>Product Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                orderProduct?.map((order, index) => {
                                    return <tr key={index}>
                                        <td>{order.email}</td>
                                        <td>
                                            <div>
                                                <button onClick={() => document.getElementById('my_modal2').showModal()}><div className="badge badge-primary badge-outline">details</div></button>
                                                <dialog id="my_modal2" className="modal">
                                                    <div className="modal-box">
                                                        <div className="overflow-x-auto">
                                                            <table className="table">
                                                                {/* head */}
                                                                <thead>
                                                                    <tr>
                                                                        <th></th>
                                                                        <th>Name</th>
                                                                        <th>Image</th>
                                                                        <th>Quantity</th>
                                                                        <th>Brand</th>
                                                                        <th>Unit</th>
                                                                        <th>Net Price</th>
                                                                        <th>Total Price</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {
                                                                        order.cartId.map((dt, index) => {
                                                                            return <tr key={index}>
                                                                                <th>{index + 1}</th>
                                                                                <td>{dt.cartItemsList.productname}</td>
                                                                                <td><img className="w-12" src={dt.cartItemsList.productpictures[0]} alt="" /></td>
                                                                                <td>{dt.totalSelectedItems}</td>
                                                                                <td>{dt.cartItemsList.productbrand}</td>
                                                                                <td>{dt.cartItemsList.measurment} {dt.cartItemsList.productunit}</td>
                                                                                <td>{dt.cartItemsList.productfinalprice}</td>
                                                                                <td>{dt.cartItemsList.productfinalprice * dt.totalSelectedItems}</td>
                                                                            </tr>
                                                                        })
                                                                    }
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                    <form method="dialog" className="modal-backdrop">
                                                        <button>close</button>
                                                    </form>
                                                </dialog>
                                            </div>
                                        </td>
                                        <td>{order.amountpaid}</td>
                                        <td>
                                            <div>
                                                <button onClick={() => document.getElementById('my_mod2').showModal()}><div className="badge badge-accent badge-outline">detailed address</div></button>
                                                <dialog id="my_mod2" className="modal">
                                                    <div className="modal-box">
                                                        <div>
                                                            <div className="overflow-x-auto">
                                                                <table className="table">
                                                                    {/* head */}
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Name</th>
                                                                            <th>Image</th>
                                                                            <th>Phone</th>
                                                                            <th>Country</th>
                                                                            <th>District</th>
                                                                            <th>Town / City</th>
                                                                            <th>Street Address</th>
                                                                            <th>Zip Code</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {/* row 1 */}
                                                                        <tr>
                                                                            <td>{order.userDetails.name}</td>
                                                                            <td><img className="w-14 rounded-full" src={order.userDetails.profilepicture} alt="" /></td>
                                                                            <td>{order.userDetails.phone}</td>
                                                                            <td>{order.userDetails.country}</td>
                                                                            <td>{order.userDetails.district}</td>
                                                                            <td>{order.userDetails.town}</td>
                                                                            <td>{order.userDetails.streetaddress}</td>
                                                                            <td>{order.userDetails.postcode}</td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <form method="dialog" className="modal-backdrop">
                                                        <button>close</button>
                                                    </form>
                                                </dialog>
                                            </div>
                                        </td>
                                        <td>{order.status}</td>
                                        <td>
                                            {
                                                order.status === "pending"
                                                    ?
                                                    <button onClick={() => handleStatus(order._id, "approved")} className="btn bg-orange-600 text-white">
                                                        <MdEdit></MdEdit>
                                                        Approve
                                                    </button>
                                                    :
                                                    order.status === "approved" ?
                                                        <button onClick={() => handleStatus(order._id, "completed")} className="btn bg-green-600 text-white">
                                                            <MdEdit></MdEdit>
                                                            Confirm
                                                        </button>
                                                        :
                                                        <div className="badge badge-accent bg-green-600 text-white">delivered</div>
                                            }
                                        </td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProductOrdersByUser;