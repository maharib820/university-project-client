import useAxiosPrivate from "../../Hooks/useAxiosPrivate";
import useAuth from "../../Hooks/useAuth";
import { GoInfo } from "react-icons/go";
import { useQuery } from "@tanstack/react-query";

const UserOrderPage = () => {

    const axiosPrivate = useAxiosPrivate();
    const { user } = useAuth();
    // const [orderDatas, setOrderDatas] = useState(null);

    const { data: orderDatas, isPending: isOrderPending } = useQuery({
        queryKey: ['orderDatas', user],
        queryFn: async () => {
            const res = await axiosPrivate(`/myorder/${user?.email}`);
            return res.data;
        }
    });

    console.log(orderDatas);

    // useEffect(() => {
    //     axiosPrivate(`/myorder/${user?.email}`)
    //         .then(res => {
    //             setOrderDatas(res.data);
    //         })
    // }, [axiosPrivate, user?.email])
    // console.log(orderDatas);

    return (
        <div className="max-w-7xl mx-auto mt-10">
            <h2 className="mb-10 text-xl">My Orders</h2>
            <div className="overflow-x-auto">
                {
                    isOrderPending ? <div className="w-full flex justify-center"><span className="loading loading-spinner loading-lg"></span></div>
                        :
                        <table className="table">
                            {/* head */}
                            <thead>
                                <tr className="bg-white text-black text-base">
                                    <th></th>
                                    <th>Transaction ID</th>
                                    <th>Product Details</th>
                                    <th>Amount Paid</th>
                                    <th>Order Date</th>
                                    <th>Order Status</th>
                                </tr>
                            </thead>
                            {
                                <tbody>
                                    {
                                        orderDatas?.map((order, index) => {
                                            return <tr key={order._id} className="border-b border-b-black">
                                                <th>{index + 1}</th>
                                                <td>{order.transactionId}</td>
                                                <td>
                                                    <div>
                                                        <button onClick={() => document.getElementById('order_modal_2').showModal()}>
                                                            <div className="badge badge-info gap-2">
                                                                <GoInfo></GoInfo>
                                                                view details
                                                            </div>
                                                        </button>
                                                        <dialog id="order_modal_2" className="modal">
                                                            <div className="modal-box">
                                                                {
                                                                    <div className="overflow-x-auto">
                                                                        <table className="table">
                                                                            {/* head */}
                                                                            <thead>
                                                                                <tr>
                                                                                    <th></th>
                                                                                    <th>Image</th>
                                                                                    <th>Name</th>
                                                                                    <th>Quantity</th>
                                                                                    <th>Unit</th>
                                                                                    <th>Net Price</th>
                                                                                    <th>Total Price</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {
                                                                                    order?.cartId?.map((mo, index) => {
                                                                                        return <tr key={index}>
                                                                                            <th>{index+1}</th>
                                                                                            <td>
                                                                                                <img className="w-14" src={mo.cartItemsList.productpictures[0]} alt="" />
                                                                                            </td>
                                                                                            <td>{mo.cartItemsList.productname}</td>
                                                                                            <td>{mo.totalSelectedItems}</td>
                                                                                            <td>{mo.totalSelectedItems} x {mo.cartItemsList.measurment}{mo.cartItemsList.productunit}</td>
                                                                                            <td>{mo.cartItemsList.productfinalprice}</td>
                                                                                            <td>{mo.totalSelectedItems * mo.cartItemsList.productfinalprice}</td>
                                                                                        </tr>
                                                                                    })
                                                                                }
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                }
                                                            </div>
                                                            <form method="dialog" className="modal-backdrop">
                                                                <button>close</button>
                                                            </form>
                                                        </dialog>
                                                    </div>
                                                </td>
                                                <td>{order.amountpaid} tk</td>
                                                <td>{order.time.toString()}</td>
                                                <td>
                                                    {
                                                        order.status === "pending" ?
                                                            <div className="badge badge-secondary">{order.status}</div>
                                                            : order.status === "approve" ?
                                                                <div className="badge badge-primary">{order.status}</div> :
                                                                <div className="badge badge-accent">{order.status}</div>
                                                    }
                                                </td>
                                            </tr>
                                        })
                                    }
                                </tbody>
                            }
                        </table>
                }
            </div>
        </div>
    );
};

export default UserOrderPage;