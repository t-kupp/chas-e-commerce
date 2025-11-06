"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "../context/cart";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

export default function CheckoutPage() {
  const { cart, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();

  const handleQuantityChange = (pokemonId: number, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(pokemonId, newQuantity);
    }
  };

  const handleIncrement = (pokemonId: number, currentQuantity: number) => {
    updateQuantity(pokemonId, currentQuantity + 1);
  };

  const handleDecrement = (pokemonId: number, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateQuantity(pokemonId, currentQuantity - 1);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Add some Pokemon cards to get started!</p>
          <Link
            href="/products"
            className="inline-block bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors font-medium"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6">Shopping Cart</h2>

            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.pokemonId}
                  className="flex items-center gap-4 border-b pb-4 last:border-b-0"
                >
                  {/* Product Image */}
                  <div className="relative w-24 h-24 shrink-0">
                    <Image
                      src={STRAPI_URL + item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-contain rounded"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="grow">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-gray-600">${item.price.toFixed(2)}</p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDecrement(item.pokemonId, item.quantity)}
                      className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.pokemonId, parseInt(e.target.value) || 1)
                      }
                      className="w-16 text-center border rounded px-2 py-1"
                      min="1"
                    />
                    <button
                      onClick={() => handleIncrement(item.pokemonId, item.quantity)}
                      className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="text-right min-w-20">
                    <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.pokemonId)}
                    className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded transition-colors"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Clear Cart Button */}
            <div className="mt-6 pt-6 border-t">
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-800 hover:underline text-sm"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-medium">Free</span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Including {(getTotalPrice() * 0.2).toFixed(2)} kr in taxes
                </p>
              </div>
            </div>

            <button className="w-full bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600 transition-colors font-semibold">
              Proceed to Payment
            </button>

            <Link
              href="/products"
              className="block text-center text-yellow-600 hover:text-yellow-700 hover:underline mt-4 font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
