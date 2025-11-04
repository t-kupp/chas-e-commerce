"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../app/context/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

interface Pokemon {
  id: number;
  documentId: string;
  name: string;
  price: number;
  image: {
    url: string;
  };
}

interface OrderItem {
  id: number;
  pokemon: Pokemon;
  Quantity: number;
}

interface Order {
  id: number;
  documentId: string;
  total: number;
  orderStatus: string;
  createdAt: string;
  orderItems: OrderItem[];
}

export default function OrdersPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    async function fetchOrders() {
      if (!user) return;

      try {
        const token = localStorage.getItem("jwt");
        const url = `${STRAPI_URL}/api/orders?populate[orderItems][populate][pokemon][populate]=*&sort=createdAt:desc`;
        console.log("Fetching orders with URL:", url);
        console.log("User ID:", user.id);

        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        console.log("Orders response:", data);
        console.log("First order:", JSON.stringify(data.data?.[0], null, 2));
        console.log(
          "First order item:",
          JSON.stringify(data.data?.[0]?.orderItems?.[0], null, 2)
        );

        if (data.error) {
          console.error("Error fetching orders:", data.error);
          setOrders([]);
        } else {
          setOrders(data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    }

    if (user) fetchOrders();
  }, [user]);

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center mt-16">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      {/* back button */}
      <Link
        href="/account"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 group transition"
      >
        <ArrowLeft
          size={20}
          className="group-hover:-translate-x-1 transition-transform"
        />
        <span className="font-medium">Back to Account</span>
      </Link>

      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      {orders.length === 0 ? (
        <p className="text-gray-600">You haven&apos;t placed any orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden"
            >
              {/* order header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      Order #{order.id}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Placed on{" "}
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-2xl text-gray-900">
                      ${Number(order.total).toFixed(2)}
                    </p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                        order.orderStatus === "completed"
                          ? "bg-green-100 text-green-800"
                          : order.orderStatus === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.orderStatus.charAt(0).toUpperCase() +
                        order.orderStatus.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* order items */}
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4">
                  Items ({order.orderItems?.length || 0})
                </h4>
                <div className="space-y-4">
                  {order.orderItems?.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                    >
                      {/* pokemon image */}
                      {item.pokemon?.image?.url && (
                        <div className="shrink-0 w-20 h-28 bg-white rounded-md overflow-hidden border border-gray-200 relative">
                          <Image
                            src={`${STRAPI_URL}${item.pokemon.image.url}`}
                            alt={item.pokemon.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}

                      {/* pokemon details */}
                      <div className="grow">
                        <h5 className="font-semibold text-gray-900">
                          {item.pokemon?.name || "Unknown Pokémon"}
                        </h5>
                        <p className="text-sm text-gray-600 mt-1">
                          Quantity: {item.Quantity}
                        </p>
                        <p className="text-sm text-gray-600">
                          Price: ${Number(item.pokemon?.price || 0).toFixed(2)}{" "}
                          each
                        </p>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          $
                          {(
                            Number(item.pokemon?.price || 0) * item.Quantity
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* order summary */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">
                      Order Total:
                    </span>
                    <span className="font-bold text-xl text-gray-900">
                      ${Number(order.total).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
