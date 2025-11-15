import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import {
  fetchCart,
  updateItemQuantity,
  removeItemFromCart,
  selectCartItems,
  selectCartStatus,
  selectCartError,
  selectCartTotal,
} from '../store/slices/cartSlice';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ShoppingCartPage() {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const cartStatus = useSelector(selectCartStatus);
  const error = useSelector(selectCartError);
  const cartTotal = useSelector(selectCartTotal);

  useEffect(() => {
    if (cartStatus === 'idle') {
      dispatch(fetchCart());
    }
  }, [cartStatus, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleQuantityChange = (productId, quantity) => {
    if (quantity > 0) {
      dispatch(updateItemQuantity({ productId, quantity }));
    }
  };

  const handleRemoveItem = (productId) => {
    dispatch(removeItemFromCart(productId));
    toast.success('Item removed from cart');
  };

  if (cartStatus === 'loading') {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="mt-12">
            <p className="text-center text-gray-500">Your cart is empty.</p>
            <div className="mt-6 text-center">
              <Link
                to="/products"
                className="text-base font-medium text-indigo-600 hover:text-indigo-500"
              >
                Continue Shopping<span aria-hidden="true"> &rarr;</span>
              </Link>
            </div>
          </div>
        ) : (
          <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
            <section aria-labelledby="cart-heading" className="lg:col-span-7">
              <h2 id="cart-heading" className="sr-only">
                Items in your shopping cart
              </h2>

              <ul role="list" className="divide-y divide-gray-200 border-b border-t border-gray-200">
                {cartItems.map((product) => (
                  <li key={product.id} className="flex py-6 sm:py-10">
                    <div className="flex-shrink-0">
                      <img
                        src={product.image || 'https://via.placeholder.com/150'}
                        alt={product.name}
                        className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                      <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                        <div>
                          <div className="flex justify-between">
                            <h3 className="text-sm">
                              <a href={`/products/${product.id}`} className="font-medium text-gray-700 hover:text-gray-800">
                                {product.name}
                              </a>
                            </h3>
                          </div>
                          <p className="mt-1 text-sm font-medium text-gray-900">${product.price.toFixed(2)}</p>
                        </div>

                        <div className="mt-4 sm:mt-0 sm:pr-9">
                          <label htmlFor={`quantity-${product.id}`} className="sr-only">
                            Quantity, {product.name}
                          </label>
                          <input
                            id={`quantity-${product.id}`}
                            name={`quantity-${product.id}`}
                            type="number"
                            min="1"
                            value={product.ShoppingCartItem.quantity}
                            onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value, 10))}
                            className="max-w-20 rounded-md border border-gray-300 py-1.5 text-left text-base font-medium leading-5 text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                          />

                          <div className="absolute right-0 top-0">
                            <button type="button" onClick={() => handleRemoveItem(product.id)} className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500">
                              <span className="sr-only">Remove</span>
                              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="summary-heading" className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
              <h2 id="summary-heading" className="text-lg font-medium text-gray-900">Order summary</h2>
              <dl className="mt-6 space-y-4">
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <dt className="text-base font-medium text-gray-900">Order total</dt>
                  <dd className="text-base font-medium text-gray-900">${cartTotal.toFixed(2)}</dd>
                </div>
              </dl>
              <div className="mt-6">
                <button type="submit" className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50">
                  Checkout
                </button>
              </div>
            </section>
          </form>
        )}
      </div>
    </div>
  );
}

