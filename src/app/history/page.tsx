"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PRODUCTS } from "@/data/products";
import { getOrders, getSessionEmail, OrderRecord } from "@/lib/auth";

export default function HistoryPage() {
  const [sessionEmail, setSessionEmail] = useState("");
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const email = getSessionEmail();
    setSessionEmail(email);
    setOrders(getOrders());
    setIsChecked(true);
  }, []);

  const myOrders = useMemo(
    () =>
      orders
        .filter((order) => order.email === sessionEmail)
        .sort((a, b) => Number(b.id.replace("ORD-", "")) - Number(a.id.replace("ORD-", ""))),
    [orders, sessionEmail]
  );

  const formatYen = (price: number) => `¥${price.toLocaleString("ja-JP")}`;

  if (!isChecked) {
    return (
      <main className="min-h-screen bg-[#2f1f17] px-4 py-8 text-[#f4e9dc]">
        <div className="mx-auto max-w-5xl text-center text-sm text-[#f2dbc1]">
          Loading order history...
        </div>
      </main>
    );
  }

  if (!sessionEmail) {
    return (
      <main className="min-h-screen bg-[#2f1f17] px-4 py-8 text-[#f4e9dc]">
        <div className="mx-auto max-w-5xl rounded-xl border border-[#6f4b35] bg-[#4a2f23] p-5">
          <h1 className="text-lg font-semibold">🧾 Order History</h1>
          <p className="mt-2 text-sm text-[#f2dbc1]">Please login to view your order history.</p>
          <Link href="/login" className="mt-3 inline-block text-sm text-[#ffd39d] hover:underline">
            Go to Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#2f1f17] px-4 py-6 text-[#f4e9dc]">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-xl border border-[#6f4b35] bg-[#4a2f23] p-5">
          <h1 className="text-lg font-semibold">🧾 Order History</h1>
          <p className="mt-1 text-xs text-[#d8bea4]">
            Check purchased items and quantities for each order.
          </p>
        </div>

        <section className="mt-4 space-y-4">
          {myOrders.length === 0 ? (
            <article className="rounded-xl border border-[#6f4b35] bg-[#4a2f23] p-5 text-sm text-[#f2dbc1]">
              No order history yet.
            </article>
          ) : (
            myOrders.map((order) => (
              <article
                key={order.id}
                className="rounded-xl border border-[#6f4b35] bg-[#4a2f23] p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#6f4b35] pb-2">
                  <p className="text-sm font-semibold text-[#ffd39d]">Order ID: {order.id}</p>
                  <p className="text-xs text-[#d8bea4]">{order.purchasedAt}</p>
                </div>

                <div className="mt-3 space-y-2">
                  {order.items.map((item) => {
                    const product = PRODUCTS.find((p) => p.id === item.productId);
                    if (!product) return null;
                    const subTotal = product.price * item.quantity;
                    return (
                      <div
                        key={`${order.id}-${item.productId}-${item.grind}`}
                        className="rounded-md border border-[#80573e] bg-[#3a251b] p-3"
                      >
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="mt-1 text-xs text-[#f2dbc1]">Grind: {item.grind}</p>
                        <p className="text-xs text-[#f2dbc1]">Qty: {item.quantity}</p>
                        <p className="text-xs text-[#f2dbc1]">Subtotal: {formatYen(subTotal)}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-3 border-t border-[#6f4b35] pt-2 text-right">
                  <p className="text-xs text-[#f2dbc1]">Total: {formatYen(order.total)}</p>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
