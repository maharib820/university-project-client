import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../../Hooks/useAxiosPrivate";
import { FaUsers } from "react-icons/fa";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { RiShoppingCartFill } from "react-icons/ri";
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';

const AdminDashboard = () => {

    const axiosPrivate = useAxiosPrivate();

    const { data: stats } = useQuery({
        queryKey: ["stats"],
        queryFn: async () => {
            const res = await axiosPrivate.get("/stats");
            return res.data;
        }
    });

    const { data: statschart } = useQuery({
        queryKey: ["statschart"],
        queryFn: async () => {
            const res = await axiosPrivate.get("/maincatwish");
            return res.data;
        }
    });

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042']

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    const pieChartData = statschart?.map(data => {
        return {
            name: data.ainCategory,
            value: data.totalRevenue
        }
    })

    return (
        <div className="p-5">
            <div className="flex gap-10">
                <div className="flex-1 bg-white border shadow h-32 p-5 flex items-center gap-10">
                    <div className="bg-green-200 rounded-full">
                        <div>
                            <FaUsers className="text-green-600 m-3"></FaUsers>
                        </div>
                    </div>
                    <div>
                        <div className="stat-title">Users</div>
                        <div className="stat-value">{stats?.users}</div>
                    </div>
                </div>
                <div className="flex-1 bg-white border shadow h-32 p-5 flex items-center gap-10">
                    <div className="bg-orange-200 rounded-full">
                        <div>
                            <MdOutlineProductionQuantityLimits className="text-orange-600 m-3"></MdOutlineProductionQuantityLimits>
                        </div>
                    </div>
                    <div>
                        <div className="stat-title">Total Products</div>
                        <div className="stat-value">{stats?.products}</div>
                    </div>
                </div>
                <div className="flex-1 bg-white border shadow h-32 p-5 flex items-center gap-10">
                    <div className="bg-red-200 rounded-full">
                        <div>
                            <RiShoppingCartFill className="text-red-600 m-3"></RiShoppingCartFill>
                        </div>
                    </div>
                    <div>
                        <div className="stat-title">Total Orders</div>
                        <div className="stat-value">{stats?.orders}</div>
                    </div>
                </div>
                <div className="flex-1 bg-white border shadow h-32 p-5 flex items-center gap-10">
                    <div className="bg-blue-200 rounded-full">
                        <div>
                            <FaUsers className="text-blue-600 m-3"></FaUsers>
                        </div>
                    </div>
                    <div>
                        <div className="stat-title">Revenue</div>
                        <div className="stat-value">{stats?.revenue}</div>
                    </div>
                </div>

            </div>
            {
                statschart ? <div className="w-full mt-28">
                    <div className="flex">
                        <div className="w-full flex-grow">
                            <BarChart
                                width={500}
                                height={300}
                                data={statschart}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="mainCategory" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="totalRevenue" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
                            </BarChart>
                        </div>
                        <div className="w-full flex-grow">
                            <BarChart
                                width={500}
                                height={300}
                                data={statschart}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="mainCategory" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="totalSold" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
                            </BarChart>
                        </div>
                        <div className="w-full flex-grow">
                            <PieChart width={400} height={242}>
                                <Pie
                                    data={pieChartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {pieChartData?.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                            <p className="text-center w-[400px]">Revenue percentage of Main Categories</p>
                        </div>
                    </div>
                </div> : ""
            }
        </div>
    );
};

export default AdminDashboard;