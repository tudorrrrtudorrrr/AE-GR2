import axiosAuth from '../axios/axiosAuth';

export const getCart = async () => {
    try {
        const response = await axiosAuth.get('/cart');
        return response.data;
    } catch (error) {
        console.error("Error fetching cart:", error);
        return error.response?.data;
    }
};

export const addItemToCart = async (productId, quantity) => {
    try {
        const response = await axiosAuth.post('/cart/items', { productId, quantity });
        return response.data;
    } catch (error) {
        console.error("Error adding item to cart:", error);
        return error.response?.data;
    }
};

export const updateCartItemQuantity = async (productId, quantity) => {
    try {
        const response = await axiosAuth.put(`/cart/items/${productId}`, { quantity });
        return response.data;
    } catch (error) {
        console.error("Error updating cart item quantity:", error);
        return error.response?.data;
    }
};

export const removeCartItem = async (productId) => {
    try {
        const response = await axiosAuth.delete(`/cart/items/${productId}`);
        return response.data;
    } catch (error) {
        console.error("Error removing cart item:", error);
        return error.response?.data;
    }
};
