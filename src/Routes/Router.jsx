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
import HomePageSlider from "../Pages/AdminSide/HomePageSlider";
import OrderFullInfo from "../Pages/UserSide/OrderFullInfo";
import ManageDiscount from "../Pages/AdminSide/ManageDiscount";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";

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
                element: <PrivateRoute><AllWishlistDetails></AllWishlistDetails></PrivateRoute>
            },
            {
                path: "payment",
                element: <PrivateRoute><Payment></Payment></PrivateRoute>
            },
            {
                path: "viewcartpage",
                element: <PrivateRoute><ViewCartPage></ViewCartPage></PrivateRoute>
            },
            {
                path: "paymentmoney",
                element: <PrivateRoute><PaymentMoney></PaymentMoney></PrivateRoute>
            },
            {
                path: "userorderpage",
                element: <PrivateRoute><UserOrderPage></UserOrderPage></PrivateRoute>
            },
            {
                path: "userprofile",
                element: <PrivateRoute><UserProfile></UserProfile></PrivateRoute>
            },
            {
                path: "orderfullinfo/:id",
                element: <PrivateRoute><OrderFullInfo></OrderFullInfo></PrivateRoute>, 
            }
        ],
    },
    {
        path: "dashboard",
        element: <Dashboard></Dashboard>,
        children: [
            {
                path: "admindashboard",
                element: <AdminRoute><AdminDashboard></AdminDashboard></AdminRoute>
            },
            {
                path: "addnewproduct",
                element: <AdminRoute><AddNewProduct></AddNewProduct></AdminRoute>
            },
            {
                path: "allproduct",
                element: <AdminRoute><AllProduct></AllProduct></AdminRoute>
            },
            {
                path: "allcategories",
                element: <AdminRoute><AllCategories></AllCategories></AdminRoute>
            },
            {
                path: "maincategories",
                element: <AdminRoute><MainCategories></MainCategories></AdminRoute>
            },
            {
                path: "subcategories",
                element: <AdminRoute><SubCategories></SubCategories></AdminRoute>
            },
            {
                path: "subchildcategories",
                element: <AdminRoute><SubChildCategories></SubChildCategories></AdminRoute>
            },
            {
                path: "orders",
                element: <AdminRoute><Orders></Orders></AdminRoute>
            },
            {
                path: "manageusers",
                element: <AdminRoute><ManageUsers></ManageUsers></AdminRoute>
            },
            {
                path: "productordersbyuser",
                element: <AdminRoute><ProductOrdersByUser></ProductOrdersByUser></AdminRoute>
            },
            {
                path: "updatesingleproductdetails/:id",
                element: <AdminRoute><UpdateSingleProductDetails></UpdateSingleProductDetails></AdminRoute>
            },
            {
                path: "homepageslider",
                element: <AdminRoute><HomePageSlider></HomePageSlider></AdminRoute>
            },
            {
                path: "managediscount",
                element: <AdminRoute><ManageDiscount></ManageDiscount></AdminRoute>
            }
        ]
    }
]);

export default router;