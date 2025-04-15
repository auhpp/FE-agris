import DefaultAdminLayout from "../layouts/components/admin/DefaultAdminLayout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import { routes } from "./../config/routes";
import SearchProductAdmin from "../pages/admin/SearchProduct";
import SearchAccount from "../pages/admin/SearchAccount";
import SearchSupplier from "../pages/admin/SearchSupplier";
import CreateProduct from "../pages/admin/CreateProduct";
import Home from "../pages/Home";
import Account from "../pages/Account";
import Profile from "../pages/Profile";
import Address from "../pages/Address";
import Password from "../pages/Password";
import Cart from "../pages/Cart";
import ProductDetail from "../pages/ProductDetail";
import Product from "../pages/Product";
import SearchProduct from "../pages/SearchProduct";
import ImportGoods from "../pages/admin/ImportGoods";
import GoodsReceipt from "../pages/admin/GoodsReceipt";
import Order from "../pages/Order";
import HeaderLayout from "../layouts/HeaderLayout/index,";
import Warehouse from "../pages/admin/Warehouse";
import Staff from "../pages/admin/Staff";
import StaffConfirmPassword from "../pages/StaffConfirmPassword";
import StockDetail from "../pages/StockDetail";
import Purchase from "../pages/Purchase";
import OrderManagement from "../pages/admin/OrderManagement";
import OrderDetailManagement from "../pages/admin/OrderDetailManagement";
import OrderDetail from "./../pages/OrderDetail"
import CategoryManagement from "../pages/admin/CategoryManagement";

export const publicRoutes = [
    { path: routes.login, page: Login },
    { path: routes.register, page: Register },
    { path: routes.home, page: Home },
    { path: routes.productDetail, page: ProductDetail },
    { path: routes.products, page: Product },
    { path: routes.search, page: SearchProduct },
    { path: routes.staffAccountConfirmPassword, page: StaffConfirmPassword, layout: null }
]

export const privateRoutes = [
    { path: routes.account, page: Account },
    { path: routes.profile, page: Profile, layout: Account },
    { path: routes.address, page: Address, layout: Account },
    { path: routes.password, page: Password, layout: Account },
    { path: routes.cart, page: Cart },
    { path: routes.order, page: Order, layout: HeaderLayout },
    { path: routes.purchase, page: Purchase, layout: Account },
    { path: routes.orderDetail, page: OrderDetail, layout: Account }


]

export const adminRoutes = [
    { path: routes.createProduct, page: CreateProduct, layout: DefaultAdminLayout },
    { path: routes.searchProduct, page: SearchProductAdmin, layout: DefaultAdminLayout },
    { path: routes.searchAccount, page: SearchAccount, layout: DefaultAdminLayout },
    { path: routes.importGoods, page: ImportGoods, layout: DefaultAdminLayout },
    { path: routes.searchSupplier, page: SearchSupplier, layout: DefaultAdminLayout },
    { path: routes.goodsReceipt, page: GoodsReceipt, layout: null },
    { path: routes.warehouse, page: Warehouse, layout: DefaultAdminLayout },
    { path: routes.staff, page: Staff, layout: DefaultAdminLayout },
    { path: routes.stockDetail, page: StockDetail, layout: DefaultAdminLayout },
    { path: routes.orderManagement, page: OrderManagement, layout: DefaultAdminLayout },
    { path: routes.orderDetailManagement, page: OrderDetailManagement, layout: DefaultAdminLayout },
    { path: routes.categoryManagement, page: CategoryManagement, layout: DefaultAdminLayout },


]
