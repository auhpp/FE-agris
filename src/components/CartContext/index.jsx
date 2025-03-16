import React, { createContext, useEffect, useState } from 'react'
import { getAllCart } from '../../services/cartService';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartSize, setCartSize] = useState();
    const [updateCart, setUpdateCart] = useState(0);
    useEffect(() => {
        getAllCart().then(
            data => {
                setCartSize(data.result?.totalElements ?? 0)
            }
        )
    }, [updateCart])
    return (
        <CartContext.Provider value={{ cartSize, updateCart, setUpdateCart }}>
            {children}
        </CartContext.Provider>
    )
}

export default CartContext;
