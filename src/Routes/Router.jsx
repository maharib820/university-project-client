import {
    createBrowserRouter,
} from "react-router-dom";
import Root from "../Layout/Root";
import Main from "../Pages/UserSide/Main";
import Login from "../Pages/Both/Authentication/Login";
import Register from "../Pages/Both/Authentication/Register";
import Dashboard from "../Layout/Dashboard";
import AdminDashboard from "../Pages/AdminSide/AdminDashboard";
import AddNewProduct from "../Pages/AdminSide/AddNewProduct";
import AllCategories from "../Pages/AdminSide/AllCategories";
import AllProduct from "../Pages/AdminSide/AllProduct";
import MainCategories from "../Pages/AdminSide/MainCategories";
import SubCategories from "../Pages/AdminSide/SubCategories";
import SubChildCategories from "../Pages/AdminSide/SubChildCategories";
import ManageUsers from "../Pages/AdminSide/ManageUsers";
import Orders from "../Pages/AdminSide/Orders";
import MainCategoryProducts from "../Pages/UserSide/MainCategoryProducts";
import ChildCategoryProducts from "../Pages/UserSide/ChildCategoryProducts";
import SubCategoryProducts from "../Pages/UserSide/SubCategoryProducts";
import SearchedProduct from "../Pages/UserSide/SearchedProduct";
import ProductDetailsPage from "../Pages/UserSide/ProductDetailsPage";
import AllWishlistDetails from "../Pages/UserSide/AllWishlistDetails";
import Payment from "../Pages/UserSide/Payment";
import ViewCartPage from "../Pages/UserSide/ViewCartPage";
import PaymentMoney from "../Pages/UserSide/PaymentMoney";
import UserOrderPage from "../Pages/UserSide/UserOrderPage";
import ProductOrdersByUser from "../Pages/AdminSide/ProductOrdersByUser";
import UpdateSingleProductDetails from "../Pages/AdminSide/UpdateSingleProductDetails";
import UserProfile from "../Pages/UserSide/UserProfile";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root></Root>,
        children: [
            {
                path: "/",
                element: <Main></Main>,
            },
            {
                path: "login",
                element: <Login></Login>
            },
            {
                path: "register",
                element: <Register></Register>
            },
            {
                path: "maincategoryproducts/:mainCategoryName",
                element: <MainCategoryProducts></MainCategoryProducts>
            },
            {
                path: "childcategoryproducts/:childCategoryName",
                element: <ChildCategoryProducts></ChildCategoryProducts>
            },
            {
                path: "subcategoryproducts/:subCategoryName",
                element: <SubCategoryProducts></SubCategoryProducts>
            },
            {
                path: "searchproducts",
                element: <SearchedProduct></SearchedProduct>
            },
            {
                path: "productdetails/:id",
                element: <ProductDetailsPage></ProductDetailsPage>
            },
            {
                path: "allwishlistDetails",
                element: <AllWishlistDetails></AllWishlistDetails>
            },
            {
                path: "payment",
                element: <Payment></Payment>
            },
            {
                path: "viewcartpage",
                element: <ViewCartPage></ViewCartPage>
            },
            {
                path: "paymentmoney",
                element: <PaymentMoney></PaymentMoney>
            },
            {
                path: "userorderpage",
                element: <UserOrderPage></UserOrderPage>
            },
            {
                path: "userprofile",
                element: <UserProfile></UserProfile>
            }
        ],
    },
    {
        path: "dashboard",
        element: <Dashboard></Dashboard>,
        children: [
            {
                path: "admindashboard",
                element: <AdminDashboard></AdminDashboard>
            },
            {
                path: "addnewproduct",
                element: <AddNewProduct></AddNewProduct>
            },
            {
                path: "allproduct",
                element: <AllProduct></AllProduct>
            },
            {
                path: "allcategories",
                element: <AllCategories></AllCategories>
            },
            {
                path: "maincategories",
                element: <MainCategories></MainCategories>
            },
            {
                path: "subcategories",
                element: <SubCategories></SubCategories>
            },
            {
                path: "subchildcategories",
                element: <SubChildCategories></SubChildCategories>
            },
            {
                path: "orders",
                element: <Orders></Orders>
            },
            {
                path: "manageusers",
                element: <ManageUsers></ManageUsers>
            },
            {
                path: "productordersbyuser",
                element: <ProductOrdersByUser></ProductOrdersByUser>
            },
            {
                path: "updatesingleproductdetails/:id",
                element: <UpdateSingleProductDetails></UpdateSingleProductDetails>
            }
        ]
    }
]);

export default router;