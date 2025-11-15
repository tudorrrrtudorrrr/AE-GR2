import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as cartApi from '../../api/cart.routes';

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const response = await cartApi.getCart();
    if (!response.success) {
      return rejectWithValue(response.message);
    }
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const addToCart = createAsyncThunk('cart/addToCart', async ({ productId, quantity }, { rejectWithValue, dispatch }) => {
  try {
    const response = await cartApi.addItemToCart(productId, quantity);
    if (!response.success) {
      return rejectWithValue(response.message);
    }
    dispatch(fetchCart()); // Refetch the cart to get updated totals and items
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const updateItemQuantity = createAsyncThunk('cart/updateItemQuantity', async ({ productId, quantity }, { rejectWithValue, dispatch }) => {
  try {
    const response = await cartApi.updateCartItemQuantity(productId, quantity);
    if (!response.success) {
      return rejectWithValue(response.message);
    }
    dispatch(fetchCart());
    return { productId, quantity };
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const removeItemFromCart = createAsyncThunk('cart/removeItemFromCart', async (productId, { rejectWithValue, dispatch }) => {
  try {
    const response = await cartApi.removeCartItem(productId);
    if (!response.success) {
      return rejectWithValue(response.message);
    }
    dispatch(fetchCart());
    return productId;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const initialState = {
  items: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // The backend returns the cart with products nested.
        state.items = action.payload.Products || [];
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateItemQuantity.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(removeItemFromCart.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const selectCartItems = (state) => state.cart.items;
export const selectCartStatus = (state) => state.cart.status;
export const selectCartError = (state) => state.cart.error;

export const selectCartTotal = (state) => {
  return state.cart.items.reduce((total, item) => {
    return total + item.price * item.ShoppingCartItem.quantity;
  }, 0);
};

export const selectTotalCartItems = (state) => {
    return state.cart.items.reduce((total, item) => {
        return total + item.ShoppingCartItem.quantity;
    }, 0);
};

export default cartSlice.reducer;

