import { useQuery } from "@tanstack/react-query";
import { MdEdit } from "react-icons/md";
import useAxiosPrivate from "../../Hooks/useAxiosPrivate";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import moment from "moment";
import { DataGrid } from '@mui/x-data-grid';

const ProductOrdersByUser = () => {

    const axiosPrivate = useAxiosPrivate();

    const { data: orderProduct, refetch } = useQuery({
        queryKey: ["orderProduct"],
        queryFn: async () => {
            const res = await axiosPrivate("/vieworderhistoryadmin");
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

    const columns = [
        { field: 'index', headerName: '#', flex: 1 },
        { field: 'time', headerName: 'Date', flex: 2, valueGetter: (params) => moment(params.row.time).format('MMMM Do YYYY, h:mm:ss a') },
        { field: 'transactionId', headerName: 'Transaction ID', flex: 2 },
        { field: 'email', headerName: 'User Email', flex: 2 },
        {
            field: 'products',
            headerName: 'Products',
            flex: 2,
            renderCell: (params) => (
                <div>
                    <Link to={`/orderfullinfo/${params.row.id}`}>
                        <button><div className="badge badge-primary badge-outline">details</div></button>
                    </Link>
                </div>
            ),
        },
        { field: 'amountpaid', headerName: 'Total Price', flex: 2, valueGetter: (params) => params.row.amountpaid},
        {
            field: 'userAddress',
            headerName: 'User Address',
            flex: 2,
            renderCell: (params) => (
                <div>
                    <button onClick={() => {
                        console.log(params);
                        document.getElementById('my_modal_address').showModal()
                    }}>
                        <div className="badge badge-secondary badge-outline">view</div>
                    </button>
                    <dialog id="my_modal_address" className="modal">
                        <div className="modal-box">
                            <h3 className="font-bold text-center">Address</h3>
                            <div className="overflow-x-auto">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Country</th>
                                            <th>District</th>
                                            <th>Phone No</th>
                                            <th>Town</th>
                                            <th>Street Address</th>
                                            <th>Postcode</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{params.row.userAddress[0].country}</td>
                                            <td>{params.row.userAddress[0].district}</td>
                                            <td>{params.row.userAddress[0].phone}</td>
                                            <td>{params.row.userAddress[0].town}</td>
                                            <td>{params.row.userAddress[0].streetaddress}</td>
                                            <td>{params.row.userAddress[0].postcode}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <form method="dialog" className="modal-backdrop">
                            <button>close</button>
                        </form>
                    </dialog>
                </div>
            ),
        },
        { field: 'status', headerName: 'Product Status', flex: 2 },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 2,
            renderCell: (params) => {
                // console.log(params);
                const { id, status } = params.row;
                return (
                    <>
                        {
                            status === "pending" ?
                                <button onClick={() => handleStatus(id, "approved")} className="bg-orange-600 text-white flex items-center px-2 rounded-full">
                                    <MdEdit />
                                    Approve
                                </button>
                                :
                                status === "approved" ?
                                    <button onClick={() => handleStatus(id, "completed")} className="bg-green-600 text-white flex items-center px-2 rounded-full">
                                        <MdEdit />
                                        Confirm
                                    </button>
                                    :
                                    <div className="badge badge-accent bg-red-600 text-white">delivered</div>
                        }
                    </>
                );
            },
        },
    ];

    const rows = orderProduct?.map((order, index) => ({
        id: order._id,
        index: index + 1,
        time: order.time,
        transactionId: order.transactionId,
        email: order.email,
        products: order.products,
        amountpaid: order.amountpaid,
        userAddress: order.userdetails,
        status: order.status,
    }));

    return (
        <div>
            <h2 className="font-bold text-2xl mb-5">Orders</h2>
            <div className="shadow-lg p-6 bg-white rounded-lg">
                <p className="mb-5 font-semibold pb-4 border-b">Orders List</p>
                {
                    orderProduct && orderProduct.length > 0 ?
                        <div style={{ height: 400, width: '100%' }}>
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                pageSize={5}
                            />
                        </div>
                        : <p>No orders found</p>
                }
            </div>
        </div>
        // <div>
        //     <h2 className="font-bold text-2xl mb-5">Orders</h2>
        //     <div className="shadow-lg p-6 bg-white rounded-lg">
        //         <p className="mb-5 font-semibold pb-4 border-b">Orders List</p>
        //         <div className="overflow-x-auto">
        //             <table className="table">
        //                 {/* head */}
        //                 <thead>
        //                     <tr>
        //                         <th></th>
        //                         <th>Date</th>
        //                         <th>Transaction ID</th>
        //                         <th>User Email</th>
        //                         <th>Products</th>
        //                         <th>Total Price</th>
        //                         <th>User Address</th>
        //                         <th>Product Status</th>
        //                         <th>Actions</th>
        //                     </tr>
        //                 </thead>
        //                 <tbody>
        //                     {
        //                         orderProduct?.map((order, index) => {
        //                             return <tr key={index}>
        //                                 <td>{index + 1}</td>
        //                                 <td>{moment(order?.time).format('MMMM Do YYYY, h:mm:ss a')}</td>
        //                                 <td>{order.transactionId}</td>
        //                                 <td>{order.email}</td>
        //                                 <td>
        //                                     <div>
        //                                         <Link to={`/orderfullinfo/${order?._id}`}><button><div className="badge badge-primary badge-outline">details</div></button></Link>
        //                                     </div>
        //                                 </td>
        //                                 <td>{order.amountpaid} Taka</td>
        //                                 <td>
        //                                     <div>
        //                                         <button onClick={() => document.getElementById('my_modal_address').showModal()}><div className="badge badge-secondary badge-outline">view</div></button>
        //                                         <dialog id="my_modal_address" className="modal">
        //                                             <div className="modal-box">
        //                                                 <h3 className="font-bold text-center">Address</h3>
        //                                                 <div className="overflow-x-auto">
        //                                                     <table className="table">
        //                                                         {/* head */}
        //                                                         <thead>
        //                                                             <tr>
        //                                                                 <th>Country</th>
        //                                                                 <th>District</th>
        //                                                                 <th>Phone No</th>
        //                                                                 <th>Town</th>
        //                                                                 <th>Street Address</th>
        //                                                                 <th>Postcode</th>
        //                                                             </tr>
        //                                                         </thead>
        //                                                         <tbody>
        //                                                             {/* row 1 */}
        //                                                             <tr>
        //                                                                 <td>{order.userdetails[0].country}</td>
        //                                                                 <td>{order.userdetails[0].district}</td>
        //                                                                 <td>{order.userdetails[0].phone}</td>
        //                                                                 <td>{order.userdetails[0].town}</td>
        //                                                                 <td>{order.userdetails[0].streetaddress}</td>
        //                                                                 <td>{order.userdetails[0].postcode}</td>
        //                                                             </tr>
        //                                                         </tbody>
        //                                                     </table>
        //                                                 </div>
        //                                             </div>
        //                                             <form method="dialog" className="modal-backdrop">
        //                                                 <button>close</button>
        //                                             </form>
        //                                         </dialog>
        //                                     </div>
        //                                 </td>
        //                                 <td>{order.status}</td>
        //                                 <td>
        //                                     {
        //                                         order.status === "pending"
        //                                             ?
        //                                             <button onClick={() => handleStatus(order._id, "approved")} className="btn bg-orange-600 text-white">
        //                                                 <MdEdit></MdEdit>
        //                                                 Approve
        //                                             </button>
        //                                             :
        //                                             order.status === "approved" ?
        //                                                 <button onClick={() => handleStatus(order._id, "completed")} className="btn bg-green-600 text-white">
        //                                                     <MdEdit></MdEdit>
        //                                                     Confirm
        //                                                 </button>
        //                                                 :
        //                                                 <div className="badge badge-accent bg-green-600 text-white">delivered</div>
        //                                     }
        //                                 </td>
        //                             </tr>
        //                         })
        //                     }
        //                 </tbody>
        //             </table>
        //         </div>
        //     </div>
        // </div>
    );
};

export default ProductOrdersByUser;