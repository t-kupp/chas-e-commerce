"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../app/context/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Mail,
  Calendar,
  Package,
  Heart,
  Settings,
  LogOut,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

interface Order {
  id: number;
  documentId: string;
  total: number;
  orderStatus: string;
  createdAt: string;
  orderItems?: {
    id: number;
    Quantity: number;
    pokemon?: {
      name: string;
      price: number;
    };
  }[];
}

interface UserStats {
  totalOrders: number;
  totalSpent: number;
  favoriteCount: number;
}

export default function AccountPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalOrders: 0,
    totalSpent: 0,
    favoriteCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    async function fetchUserData() {
      if (!user) return;

      try {
        const token = localStorage.getItem("jwt");

        // fetch orders
        const ordersRes = await fetch(
          `${STRAPI_URL}/api/orders?populate[orderItems][populate][pokemon][populate]=*&sort=createdAt:desc&pagination[limit]=5`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const ordersData = await ordersRes.json();

        console.log("Account page orders response:", ordersData);

        if (ordersData.error) {
          console.error("Error fetching orders:", ordersData.error);
          setOrders([]);
        } else {
          const userOrders = ordersData.data || [];
          setOrders(userOrders);

          // calculate stats from all user's orders
          const totalSpent = userOrders.reduce(
            (sum: number, order: Order) => sum + Number(order.total || 0),
            0
          );

          setStats({
            totalOrders: userOrders.length,
            totalSpent: totalSpent,
            favoriteCount: 0,
          });
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    }

    if (user) fetchUserData();
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 mt-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your account...</p>
        </div>
      </div>
    );
  }
  // ------------------------------------------

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border-l-4 border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* profile icon */}
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                <User size={40} className="text-gray-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2 text-gray-900">
                  Welcome back, {user.username}!
                </h1>
                <p className="text-gray-600 flex items-center gap-2">
                  <Mail size={16} />
                  {user.email}
                </p>
              </div>
            </div>
            {/* logout button */}
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-2 bg-gray-100 hover:bg-red-100 text-gray-700 hover:text-red-700 px-6 py-3 rounded-lg transition font-medium border border-gray-200"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        {/* stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* total orders */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">
                  Total Orders
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalOrders}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Package className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>

          {/* total spent */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">
                  Total Spent
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  ${stats.totalSpent.toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          {/* favorites */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">
                  Wishlist Cards
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.favoriteCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Heart className="text-red-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* quick qctions & account info column */}
          <div className="lg:col-span-1">
            {/* quick actions */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-200 pb-3">
                <Settings size={20} className="text-yellow-600" />
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Link
                  href="/orders"
                  className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-yellow-50 rounded-lg transition group"
                >
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition">
                    <Package className="text-yellow-600" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">View Orders</p>
                    <p className="text-sm text-gray-600">
                      Track your purchases
                    </p>
                  </div>
                </Link>

                <Link
                  href="/favorites"
                  className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-red-50 rounded-lg transition group"
                >
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition">
                    <Heart className="text-red-600" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Wishlist</p>
                    <p className="text-sm text-gray-600">Saved rare cards</p>
                  </div>
                </Link>

                <Link
                  href="/products"
                  className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-green-50 rounded-lg transition group"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition">
                    <ShoppingBag className="text-green-600" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Browse Cards</p>
                    <p className="text-sm text-gray-600">
                      Discover new rarities
                    </p>
                  </div>
                </Link>
              </div>
            </div>

            {/* account info */}
            <div className="bg-white rounded-xl shadow-md p-6 mt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-200 pb-3">
                <User size={20} className="text-yellow-600" />
                Trainer Profile
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <User className="text-gray-600 mt-0.5" size={18} />
                  <div>
                    <p className="text-xs text-gray-600 mb-0.5">Username</p>
                    <p className="font-semibold text-gray-900">
                      {user.username}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="text-gray-600 mt-0.5" size={18} />
                  <div>
                    <p className="text-xs text-gray-600 mb-0.5">Email</p>
                    <p className="font-semibold text-gray-900 break-all">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="text-gray-600 mt-0.5" size={18} />
                  <div>
                    <p className="text-xs text-gray-600 mb-0.5">Member Since</p>
                    <p className="font-semibold text-gray-900">
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* recent orders */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-3">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Package size={20} className="text-yellow-600" />
                  Recent Orders
                </h2>
                <Link
                  href="/orders"
                  className="text-yellow-600 hover:text-yellow-700 text-sm font-medium"
                >
                  View All Orders →
                </Link>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200">
                    <Package className="text-gray-400" size={32} />
                  </div>
                  <p className="text-gray-600 mb-4">
                    No recent purchases found.
                  </p>
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg font-bold transition"
                  >
                    <ShoppingBag size={18} />
                    Start Collecting Cards
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-gray-200 rounded-lg p-5 bg-gray-50 hover:bg-gray-100 transition"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <Package className="text-yellow-600" size={20} />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              Order #{order.id}
                            </p>
                            <p className="text-xs text-gray-600">
                              {new Date(order.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-xl text-gray-900">
                            ${Number(order.total).toFixed(2)}
                          </p>
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              order.orderStatus === "completed"
                                ? "bg-green-100 text-green-800"
                                : order.orderStatus === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : order.orderStatus === "shipped"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {order.orderStatus.charAt(0).toUpperCase() +
                              order.orderStatus.slice(1)}
                          </span>
                        </div>
                      </div>

                      {/* order items preview */}
                      {order.orderItems && order.orderItems.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs text-gray-600 mb-2">
                            Items ({order.orderItems.length}):
                          </p>
                          <div className="space-y-1">
                            {order.orderItems.slice(0, 3).map((item) => (
                              <div
                                key={item.id}
                                className="text-sm text-gray-700 flex justify-between"
                              >
                                <span>
                                  {item.Quantity}x{" "}
                                  {item.pokemon?.name || "Unknown Card"}
                                </span>
                                <span className="text-gray-600">
                                  $
                                  {(
                                    (item.pokemon?.price || 0) * item.Quantity
                                  ).toFixed(2)}
                                </span>
                              </div>
                            ))}
                            {order.orderItems.length > 3 && (
                              <p className="text-xs text-gray-500 italic">
                                +{order.orderItems.length - 3} more items
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
