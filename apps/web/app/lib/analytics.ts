// Google Analytics 4 E-commerce event tracking utility

type GAEvent =
  | "page_view"
  | "view_item"
  | "add_to_cart"
  | "remove_from_cart"
  | "begin_checkout"
  | "add_payment_info"
  | "purchase";

interface GAItem {
  item_id: string; // pokemonId as string
  item_name: string; // pokemon.name
  item_category: string; // pokemon.type.title
  item_category2?: string; // pokemon.rarity.title
  item_category3?: string; // pokemon.condition.title
  item_variant?: string; // pokemon.condition.title
  price: number; // pokemon.price
  quantity: number; // quantity
}

interface GAEventParams {
  // For view_item
  currency?: string;
  value?: number;
  items?: GAItem[];

  // For add_to_cart / remove_from_cart
  // uses currency, value, items

  // For begin_checkout
  // uses currency, value, items
  coupon?: string;

  // For add_payment_info
  payment_type?: string;

  // For purchase
  transaction_id?: string;
  affiliation?: string;
  shipping?: number;
  tax?: number;

  // Index signature for additional properties
  [key: string]: unknown;
}

/**
 * Send event to Google Analytics 4
 */
export function trackEvent(eventName: GAEvent, params?: GAEventParams) {
  if (typeof window === "undefined") return;

  // Check if gtag is available
  if (typeof window.gtag === "undefined") {
    console.warn("Google Analytics not loaded yet");
    return;
  }

  try {
    window.gtag("event", eventName, params);

    // Debug logging in development
    if (typeof window !== "undefined" && window.location.hostname === "localhost") {
      console.log("📊 GA Event:", eventName, params);
    }
  } catch (error) {
    console.error("Error tracking GA event:", error);
  }
}

/**
 * Track page view (usually automatic, but can be called manually for SPAs)
 */
export function trackPageView(url: string, title: string) {
  trackEvent("page_view", {
    page_location: url,
    page_title: title,
  } as unknown as GAEventParams);
}

/**
 * Track product view
 */
export function trackProductView(pokemon: {
  id: number;
  name: string;
  price: number;
  type?: { title: string };
  rarity?: { title: string };
  condition?: { title: string };
}) {
  const item: GAItem = {
    item_id: pokemon.id.toString(),
    item_name: pokemon.name,
    item_category: pokemon.type?.title || "Unknown",
    item_category2: pokemon.rarity?.title,
    item_category3: pokemon.condition?.title,
    item_variant: pokemon.condition?.title,
    price: pokemon.price,
    quantity: 1,
  };

  trackEvent("view_item", {
    currency: "USD",
    value: pokemon.price,
    items: [item],
  });
}

/**
 * Track add to cart
 */
export function trackAddToCart(
  pokemon: {
    id: number;
    name: string;
    price: number;
    type?: { title: string };
    rarity?: { title: string };
    condition?: { title: string };
  },
  quantity: number = 1
) {
  const item: GAItem = {
    item_id: pokemon.id.toString(),
    item_name: pokemon.name,
    item_category: pokemon.type?.title || "Unknown",
    item_category2: pokemon.rarity?.title,
    item_category3: pokemon.condition?.title,
    item_variant: pokemon.condition?.title,
    price: pokemon.price,
    quantity: quantity,
  };

  trackEvent("add_to_cart", {
    currency: "USD",
    value: pokemon.price * quantity,
    items: [item],
  });
}

/**
 * Track remove from cart
 */
export function trackRemoveFromCart(item: {
  pokemonId: number;
  name: string;
  price: number;
  quantity: number;
}) {
  const gaItem: GAItem = {
    item_id: item.pokemonId.toString(),
    item_name: item.name,
    item_category: "Pokemon Card",
    price: item.price,
    quantity: item.quantity,
  };

  trackEvent("remove_from_cart", {
    currency: "USD",
    value: item.price * item.quantity,
    items: [gaItem],
  });
}

/**
 * Track begin checkout
 */
export function trackBeginCheckout(
  cartItems: Array<{
    pokemonId: number;
    name: string;
    price: number;
    quantity: number;
  }>,
  totalValue: number
) {
  const items: GAItem[] = cartItems.map((item) => ({
    item_id: item.pokemonId.toString(),
    item_name: item.name,
    item_category: "Pokemon Card",
    price: item.price,
    quantity: item.quantity,
  }));

  trackEvent("begin_checkout", {
    currency: "USD",
    value: totalValue,
    items: items,
  });
}

/**
 * Track payment info added
 */
export function trackAddPaymentInfo(
  paymentType: string,
  cartItems: Array<{
    pokemonId: number;
    name: string;
    price: number;
    quantity: number;
  }>,
  totalValue: number
) {
  const items: GAItem[] = cartItems.map((item) => ({
    item_id: item.pokemonId.toString(),
    item_name: item.name,
    item_category: "Pokemon Card",
    price: item.price,
    quantity: item.quantity,
  }));

  trackEvent("add_payment_info", {
    currency: "USD",
    value: totalValue,
    payment_type: paymentType,
    items: items,
  });
}

/**
 * Track purchase completion
 */
export function trackPurchase(
  transactionId: string,
  cartItems: Array<{
    pokemonId: number;
    name: string;
    price: number;
    quantity: number;
  }>,
  totalValue: number,
  tax: number = 0,
  shipping: number = 0
) {
  const items: GAItem[] = cartItems.map((item) => ({
    item_id: item.pokemonId.toString(),
    item_name: item.name,
    item_category: "Pokemon Card",
    price: item.price,
    quantity: item.quantity,
  }));

  trackEvent("purchase", {
    transaction_id: transactionId,
    affiliation: "Pokemon Cards Store",
    currency: "USD",
    value: totalValue,
    tax: tax,
    shipping: shipping,
    items: items,
  });
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    gtag: (
      command: "config" | "event" | "set",
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
  }
}
