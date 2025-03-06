import DefaultAdminLayout from "../layouts/components/admin/DefaultAdminLayout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import {routes} from "./../config/routes";
import SearchProduct from "../pages/admin/SearchProduct";
import SearchAccount from "../pages/admin/SearchAccount";
import SearchCategory from "../pages/admin/SearchCategory";
import SearchSupplier from "../pages/admin/SearchSupplier";
import CreateProduct from "../pages/admin/CreateProduct";
import Home from "../pages/Home";
import Account from "../pages/Account";

import Profile from "../pages/Profile";
import Address from "../pages/Address";
import Password from "../pages/Password";
import Cart from "../pages/Cart";
import ProductDetail from "../pages/ProductDetail";

export const publicRoutes = [
    {path: routes.login, page: Login},
    {path: routes.register, page: Register},
    {path: routes.searchProduct, page: SearchProduct, layout: DefaultAdminLayout},
    {path: routes.searchAccount, page: SearchAccount, layout: DefaultAdminLayout},
    {path: routes.searchCategory, page: SearchCategory, layout: DefaultAdminLayout},
    {path: routes.searchSupplier, page: SearchSupplier, layout: DefaultAdminLayout},
    {path: routes.createProduct, page: CreateProduct, layout: null},
    {path: routes.home, page: Home},
    {path: routes.account, page: Account},
    {path: routes.profile, page: Profile, layout: Account},
    {path: routes.address, page: Address, layout: Account},
    {path: routes.password, page: Password , layout: Account},
    {path: routes.cart, page: Cart},
    {path: routes.productDetail, page: ProductDetail}



    
]

