"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import PaypalCheckout from "../components/PaypalCheckout";
import { useAuth } from "../context/auth";
import { useCart } from "../context/cart";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

interface AddressFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export default function CheckoutPage() {
  const { user, isLoading } = useAuth();
  const { cart, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const [addressData, setAddressData] = useState<AddressFormData>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    function validateForm() {
      const requiredFields: (keyof AddressFormData)[] = [
        "fullName",
        "email",
        "phone",
        "address",
        "city",
        "postalCode",
        "country",
      ];

      const missingFields = requiredFields.filter((field) => !addressData[field].trim());

      setIsFormValid(missingFields.length === 0);
    }
    validateForm();
  }, [addressData]);

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

  const handleAddressChange = (field: keyof AddressFormData, value: string) => {
    setAddressData((prev) => ({ ...prev, [field]: value }));
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="opacity-60 mb-8">Add some Pokemon cards to get started!</p>
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

  // Show login gate if user is not logged in
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shopping Cart Preview */}
          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6">Shopping Cart</h2>
            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div
                  key={item.pokemonId}
                  className="flex items-center gap-4 border-b pb-4 last:border-b-0"
                >
                  <div className="relative w-16 h-16 shrink-0">
                    <Image
                      src={STRAPI_URL + item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-contain rounded"
                    />
                  </div>
                  <div className="grow">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm opacity-60">
                      ${item.price.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Login CTA */}
          <div className="bg-background rounded-lg shadow-md p-6 flex flex-col items-center justify-center text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-20 w-20 text-yellow-500 mb-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <h2 className="text-2xl font-bold mb-4">Login Required</h2>
            <p className="text-gray-600 mb-6 max-w-md">
              Please log in or create an account to complete your order. This allows you to track
              your orders and manage your purchases.
            </p>
            <div className="space-y-3 w-full max-w-sm">
              <Link
                href="/auth?redirect=/checkout"
                className="block w-full bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors font-medium text-center"
              >
                Log In
              </Link>
              <p className="text-sm text-gray-600">
                Don&apos;t have an account? You can register on the login page.
              </p>
            </div>
            <p className="text-sm text-gray-500 mt-6">
              Why do I need an account?
              <br />
              <span className="text-xs">Track orders • View history • Faster checkout</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Module 1: Shopping Cart & Order Summary */}
        <div className="bg-background rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6">Shopping Cart</h2>

          {/* Cart Items */}
          <div className="space-y-4 mb-6">
            {cart.map((item) => (
              <div
                key={item.pokemonId}
                className="flex flex-col sm:flex-row sm:items-center gap-4 border-b pb-4 last:border-b-0"
              >
                <div className="flex items-start gap-4 grow">
                  {/* Product Image */}
                  <div className="relative w-20 h-20 shrink-0">
                    <Image
                      src={STRAPI_URL + item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-contain rounded"
                    />
                  </div>

                  {/* Product Details and Quantity */}
                  <div className="grow flex flex-col gap-2">
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm opacity-60">${item.price.toFixed(2)}</p>
                    </div>

                    {/* Quantity Controls - Mobile */}
                    <div className="flex items-center gap-2 sm:hidden">
                      <button
                        onClick={() => handleDecrement(item.pokemonId, item.quantity)}
                        className="w-7 h-7 flex items-center justify-center bg-foreground/10 hover:bg-foreground/20 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                        className="w-14 text-center border rounded px-2 py-1 text-sm bg-background"
                        min="1"
                      />
                      <button
                        onClick={() => handleIncrement(item.pokemonId, item.quantity)}
                        className="w-7 h-7 flex items-center justify-center bg-foreground/10 hover:bg-foreground/20 rounded transition-colors"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Remove Button - Mobile */}
                  <button
                    onClick={() => removeFromCart(item.pokemonId)}
                    className="text-red-600 hover:text-red-800 hover:bg-red-600/10 p-2 rounded transition-colors sm:hidden self-start"
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

                {/* Quantity Controls - Desktop */}
                <div className="hidden sm:flex items-center gap-2">
                  <button
                    onClick={() => handleDecrement(item.pokemonId, item.quantity)}
                    className="w-7 h-7 flex items-center justify-center bg-foreground/10 hover:bg-foreground/20 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                    className="w-14 text-center border rounded px-2 py-1 text-sm bg-background"
                    min="1"
                  />
                  <button
                    onClick={() => handleIncrement(item.pokemonId, item.quantity)}
                    className="w-7 h-7 flex items-center justify-center bg-foreground/10 hover:bg-foreground/20 rounded transition-colors"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* Item Total */}
                <div className="text-right min-w-16 self-start sm:self-center">
                  <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>

                {/* Remove Button - Desktop */}
                <button
                  onClick={() => removeFromCart(item.pokemonId)}
                  className="hidden sm:block text-red-600 hover:text-red-800 hover:bg-red-600/10 p-2 rounded transition-colors"
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
          <div className="mb-6 pb-6 border-b">
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-800 hover:underline text-sm"
            >
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}

          <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="opacity-60">Subtotal:</span>
              <span className="font-medium">${getTotalPrice().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="opacity-60">Shipping:</span>
              <span className="font-medium text-green-600">Free</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              <p className="text-foreground/50 text-xs">
                Including ${(getTotalPrice() * 0.2).toFixed(2)} in taxes
              </p>
            </div>
          </div>
        </div>

        {/* Module 2: Shipping Address Form */}
        <div className="bg-background rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6">Shipping Address</h2>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium opacity-70 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                id="fullName"
                value={addressData.fullName}
                onChange={(e) => handleAddressChange("fullName", e.target.value)}
                className="w-full px-3 py-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-background"
                placeholder="Anna Andersson"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium opacity-70 mb-1">
                Email *
              </label>
              <input
                type="email"
                id="email"
                value={addressData.email}
                onChange={(e) => handleAddressChange("email", e.target.value)}
                className="w-full px-3 py-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-background"
                placeholder="anna.andersson@example.se"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium opacity-70 mb-1">
                Phone *
              </label>
              <input
                type="tel"
                id="phone"
                value={addressData.phone}
                onChange={(e) => handleAddressChange("phone", e.target.value)}
                className="w-full px-3 py-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-background"
                placeholder="070-123 45 67"
                required
              />
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium opacity-70 mb-1">
                Street Address *
              </label>
              <input
                type="text"
                id="address"
                value={addressData.address}
                onChange={(e) => handleAddressChange("address", e.target.value)}
                className="w-full px-3 py-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-background"
                placeholder="Drottninggatan 123"
                required
              />
            </div>

            {/* City */}
            <div>
              <label htmlFor="city" className="block text-sm font-medium opacity-70 mb-1">
                City *
              </label>
              <input
                type="text"
                id="city"
                value={addressData.city}
                onChange={(e) => handleAddressChange("city", e.target.value)}
                className="w-full px-3 py-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-background"
                placeholder="Stockholm"
                required
              />
            </div>

            {/* Postal Code */}
            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium opacity-70 mb-1">
                Postal Code *
              </label>
              <input
                type="text"
                id="postalCode"
                value={addressData.postalCode}
                onChange={(e) => handleAddressChange("postalCode", e.target.value)}
                className="w-full px-3 py-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-background"
                placeholder="111 21"
                required
              />
            </div>

            {/* Country */}
            <div>
              <label htmlFor="country" className="block text-sm font-medium opacity-70 mb-1">
                Country *
              </label>
              <input
                type="text"
                id="country"
                value={addressData.country}
                onChange={(e) => handleAddressChange("country", e.target.value)}
                className="w-full px-3 py-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-background"
                placeholder="Sweden"
                required
              />
            </div>

            {/* Payment Button */}
            <PaypalCheckout isFormValid={isFormValid} />
            <p className="text-xs opacity-50 text-center mt-4">* All fields are required</p>
          </form>
        </div>
      </div>
    </div>
  );
}
