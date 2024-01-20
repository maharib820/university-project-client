import useAxiosPrivate from "../../Hooks/useAxiosPrivate";
import useAuth from "../../Hooks/useAuth";
import { GoInfo } from "react-icons/go";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const UserOrderPage = () => {

    const axiosPrivate = useAxiosPrivate();
    const { user } = useAuth();

    const { data: orderDatas, isPending: isOrderPending } = useQuery({
        queryKey: ['orderDatas', user],
        queryFn: async () => {
            const res = await axiosPrivate(`/vieworderhistory/${user?.email}`);
            return res.data;
        }
    });

    console.log(orderDatas);

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
                                                        <button className="text-white">
                                                            <Link to={`/orderfullinfo/${order._id}`}>
                                                                <div className="badge badge-info gap-2 text-white">
                                                                    <GoInfo></GoInfo>
                                                                    view details
                                                                </div>
                                                            </Link>
                                                        </button>
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