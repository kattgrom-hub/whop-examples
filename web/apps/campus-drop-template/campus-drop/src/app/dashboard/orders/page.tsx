import Link from "next/link";
import { mockOrders } from "@/lib/dashboard-data";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  paid: "bg-blue-500/20 text-blue-400",
  shipped: "bg-purple-500/20 text-purple-400",
  delivered: "bg-green-500/20 text-green-400",
  cancelled: "bg-red-500/20 text-red-400",
};

export default function OrdersPage() {
  const activeOrders = mockOrders.filter((o) => o.status !== "delivered" && o.status !== "cancelled");
  const completedOrders = mockOrders.filter((o) => o.status === "delivered" || o.status === "cancelled");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">My Purchases</h1>

      {/* Active Orders */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 mb-8">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-lg font-semibold">In Progress ({activeOrders.length})</h2>
        </div>
        {activeOrders.length === 0 ? (
          <div className="p-6 text-center text-gray-400">
            No active orders.{" "}
            <Link href="/browse" className="text-green-500 hover:text-green-400">
              Browse listings
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {activeOrders.map((order) => (
              <div
                key={order.id}
                className="p-4 flex items-center gap-4"
              >
                <img
                  src={order.listingImage}
                  alt={order.listingTitle}
                  className="w-20 h-20 rounded-lg bg-gray-700 object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium mb-1 line-clamp-1">{order.listingTitle}</h3>
                  <p className="text-sm text-gray-400 mb-2">
                    Ordered on {order.createdAt}
                  </p>
                  {order.meetupLocation && (
                    <p className="text-sm text-gray-400">
                      <span className="text-gray-500">Meetup:</span> {order.meetupLocation}
                    </p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xl font-bold mb-2">${order.price}</p>
                  <span className={`text-xs px-2 py-1 rounded capitalize ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Orders */}
      <div className="bg-gray-800 rounded-xl border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Completed ({completedOrders.length})</h2>
        </div>
        {completedOrders.length === 0 ? (
          <div className="p-6 text-center text-gray-400">
            No completed orders yet.
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {completedOrders.map((order) => (
              <div
                key={order.id}
                className="p-4 flex items-center gap-4"
              >
                <img
                  src={order.listingImage}
                  alt={order.listingTitle}
                  className="w-20 h-20 rounded-lg bg-gray-700 object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium mb-1 line-clamp-1">{order.listingTitle}</h3>
                  <p className="text-sm text-gray-400 mb-2">
                    {order.status === "delivered" ? "Delivered" : "Cancelled"} on {order.createdAt}
                  </p>
                  {order.meetupLocation && order.status === "delivered" && (
                    <p className="text-sm text-gray-400">
                      <span className="text-gray-500">Picked up at:</span> {order.meetupLocation}
                    </p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xl font-bold mb-2">${order.price}</p>
                  <span className={`text-xs px-2 py-1 rounded capitalize ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-8 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
        <p className="text-gray-400 text-sm">
          <strong className="text-white">Secure payments secure.</strong> Your payment is held securely until you confirm receipt of the item.
        </p>
      </div>
    </div>
  );
}
