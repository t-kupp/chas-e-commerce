# Google Analytics 4 Implementation

## Overview

This project implements Google Analytics 4 (GA4) e-commerce event tracking to monitor user behavior throughout the purchase funnel. By tracking key actions from product views to completed purchases, we can identify where users drop off and make data-driven improvements.

---

## Strategy

Track the complete customer journey:

```
Browse → View Product → Add to Cart → Checkout → Payment → Purchase
```

Each step is tracked as an event, allowing us to:

- Calculate conversion rates at each stage
- Identify bottlenecks where users abandon their purchase
- Understand which products perform best
- Make informed decisions about site improvements

---

## Implementation

### Files Created

#### `/apps/web/app/lib/analytics.ts`

Central utility file containing all tracking functions.

**Functions:**

- `trackProductView()` - Tracks when users view a product
- `trackAddToCart()` - Tracks when users add items to cart
- `trackRemoveFromCart()` - Tracks when users remove items
- `trackBeginCheckout()` - Tracks when users start checkout
- `trackAddPaymentInfo()` - Tracks when users select payment method
- `trackPurchase()` - Tracks completed transactions

---

### Files Modified

#### 1. `/apps/web/app/components/ProductActions.tsx`

**Event:** `view_item`

**What was added:**

```typescript
useEffect(() => {
  trackProductView(pokemon);
}, [pokemon]);
```

**Why:** Tracks product interest and helps identify which products users want to see more of.

---

#### 2. `/apps/web/app/context/cart.tsx`

**Events:** `add_to_cart`, `remove_from_cart`

**What was added:**

```typescript
// In addToCart function
trackAddToCart(pokemon, quantity);

// In removeFromCart function
const itemToRemove = cart.find((item) => item.pokemonId === pokemonId);
if (itemToRemove) {
  trackRemoveFromCart(itemToRemove);
}
```

**Why:**

- `add_to_cart` shows purchase intent
- `remove_from_cart` indicates potential issues with products or pricing

---

#### 3. `/apps/web/app/checkout/page.tsx`

**Event:** `begin_checkout`

**What was added:**

```typescript
const hasTrackedCheckout = useRef(false);

useEffect(() => {
  if (isMounted && user && cart.length > 0 && !hasTrackedCheckout.current) {
    trackBeginCheckout(cart, getTotalPrice());
    hasTrackedCheckout.current = true;
  }
}, [isMounted, user, cart, getTotalPrice]);
```

**Why:** Measures how many users with items in their cart actually start the checkout process. High drop-off here might indicate issues with the login requirement.

---

#### 4. `/apps/web/app/components/PaypalCheckout.tsx`

**Events:** `add_payment_info`, `purchase`

**What was added:**

```typescript
// In createOrder function
trackAddPaymentInfo("PayPal", cart, getTotalPrice());

// In onApprove function (after successful order creation)
const orderId = createdOrder.data.id || createdOrder.data.documentId || details.id;
const tax = getTotalPrice() * 0.2;

trackPurchase(
  orderId.toString(),
  cart,
  getTotalPrice(),
  tax,
  0 // Free shipping
);
```

**Why:**

- `add_payment_info` shows users committed enough to select payment method
- `purchase` captures actual revenue and successful transactions

---

## Events Summary

| Event              | Trigger                     | Data Tracked                      | Purpose                   |
| ------------------ | --------------------------- | --------------------------------- | ------------------------- |
| `view_item`        | User views product page     | Product ID, name, price, category | Product interest analysis |
| `add_to_cart`      | User clicks "Add to Cart"   | Product details, quantity         | Purchase intent           |
| `remove_from_cart` | User removes item from cart | Product details, quantity         | Problem detection         |
| `begin_checkout`   | User reaches checkout page  | All cart items, total value       | Checkout conversion       |
| `add_payment_info` | User clicks PayPal button   | Payment method, order value       | Payment friction analysis |
| `purchase`         | Order successfully created  | Transaction ID, revenue, tax      | Revenue tracking          |

---

## How It Helps

### Before Implementation

- No idea which products users viewed vs purchased
- Couldn't identify where users abandoned their purchase
- No data to guide improvement decisions

### After Implementation

- See exactly where users drop off (e.g., 100 views → 20 add-to-cart → 5 purchases)
- Identify low-performing products that need better descriptions or pricing
- Measure impact of any changes made to the site
- Track actual revenue and best-selling products

### Example Insights

- If many users view a product but few add it to cart → improve product page
- If many add to cart but few complete checkout → simplify checkout process
- If certain products have high removal rates → investigate pricing or descriptions

---

## Testing

View events in Google Analytics 4:

1. **Reports → Engagement → Events** - See event counts
2. **Explore → Funnel Exploration** - Visualize drop-off between stages
3. **Reports → Monetization → E-commerce purchases** - See revenue data

In development, all events are logged to the browser console:

```
📊 GA Event: view_item { currency: 'USD', value: 25.99, items: [...] }
```

---

## Technical Details

- **Platform:** Google Analytics 4
- **Integration:** `@next/third-parties/google`
- **Framework:** Next.js 14
- **Language:** TypeScript (fully typed)
- **GA Property ID:** G-8EJ2LZQSRB
