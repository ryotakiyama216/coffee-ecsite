"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PRODUCTS, Product } from "@/data/products";
import {
  CART_KEY,
  OrderRecord,
  getOrders,
  getUsers,
  saveOrders,
  getSessionEmail,
  User,
} from "@/lib/auth";
import CartPanel from "@/components/CartPanel";
import { CartItem, normalizeCart } from "@/lib/cart";

export default function Home() {
  const router = useRouter();
  const [isSessionChecked, setIsSessionChecked] = useState(false);
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [sessionEmail, setSessionEmail] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [categoryInput, setCategoryInput] = useState<
    "All" | Product["category"]
  >("All");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"All" | Product["category"]>(
    "All"
  );
  const [completedOrder, setCompletedOrder] = useState<OrderRecord | null>(null);
  const [statusMessage, setStatusMessage] = useState(
    "Pick your beans and add to cart."
  );

  useEffect(() => {
    setUsers(getUsers());
    const currentEmail = getSessionEmail();
    if (!currentEmail) {
      router.replace("/login");
      return;
    }
    setSessionEmail(currentEmail);
    setIsSessionChecked(true);
    const savedCart = JSON.parse(localStorage.getItem(CART_KEY) ?? "[]") as CartItem[];
    setCart(normalizeCart(savedCart));
    setIsCartLoaded(true);
    setOrders(getOrders());
  }, [router]);

  useEffect(() => {
    if (!isCartLoaded) return;
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, isCartLoaded]);

  useEffect(() => {
    saveOrders(orders);
  }, [orders]);

  const currentUser = users.find((user) => user.email === sessionEmail);

  const cartDetail = useMemo(
    () =>
      cart
        .map((item) => {
          const product = PRODUCTS.find((p) => p.id === item.productId);
          if (!product) return null;
          return { ...item, subTotal: product.price * item.quantity };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null),
    [cart]
  );
  const total = cartDetail.reduce((sum, item) => sum + item.subTotal, 0);

  const visibleProducts = useMemo(() => {
    const normalized = searchKeyword.trim().toLowerCase();
    return PRODUCTS.filter((product) => {
      const categoryMatch =
        selectedCategory === "All" || product.category === selectedCategory;
      const searchMatch =
        normalized.length === 0 ||
        product.name.toLowerCase().includes(normalized) ||
        product.origin.toLowerCase().includes(normalized) ||
        product.note.toLowerCase().includes(normalized);
      return categoryMatch && searchMatch;
    });
  }, [searchKeyword, selectedCategory]);

  const runSearch = (event: FormEvent) => {
    event.preventDefault();
    setSearchKeyword(keywordInput);
    setSelectedCategory(categoryInput);
  };

  const handlePurchase = () => {
    if (!currentUser) {
      setStatusMessage("Please login to checkout.");
      return;
    }
    if (!cartDetail.length) {
      setStatusMessage("Your cart is empty. Add some beans first.");
      return;
    }

    const order: OrderRecord = {
      id: `ORD-${Date.now()}`,
      email: currentUser.email,
      items: cart,
      total,
      purchasedAt: new Date().toLocaleString("ja-JP"),
    };
    setOrders((prev) => [order, ...prev]);
    setCart([]);
    setCompletedOrder(order);
    setStatusMessage(`Order complete! ID: ${order.id}`);
  };

  const myOrders = orders.filter((order) => order.email === sessionEmail);
  const formatYen = (price: number) => `¥${price.toLocaleString("ja-JP")}`;

  if (!isSessionChecked) {
    return (
      <main className="min-h-screen bg-[#2f1f17] px-4 py-8 text-[#f4e9dc]">
        <div className="mx-auto max-w-3xl text-center text-sm text-[#f2dbc1]">
          Checking session...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#2f1f17] px-4 py-6 text-[#f4e9dc]">
      <div className="mx-auto max-w-7xl">
        <section className="mt-4 grid gap-4 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-4">
            <form
              onSubmit={runSearch}
              className="rounded-xl border border-[#6f4b35] bg-[#4a2f23] p-3"
            >
              <div className="grid gap-2 md:grid-cols-[2fr_1fr_auto]">
                <input
                  value={keywordInput}
                  onChange={(event) => setKeywordInput(event.target.value)}
                  placeholder="Search by name, origin, taste"
                  className="rounded-md border border-[#6f4b35] bg-[#2e1c14] px-3 py-2 text-xs"
                />
                <select
                  value={categoryInput}
                  onChange={(event) =>
                    setCategoryInput(event.target.value as "All" | Product["category"])
                  }
                  className="rounded-md border border-[#6f4b35] bg-[#2e1c14] px-3 py-2 text-xs"
                >
                  <option value="All">All categories</option>
                  <option value="Blend">Blend</option>
                  <option value="Single Origin">Single Origin</option>
                  <option value="Decaf">Decaf</option>
                </select>
                <button className="rounded-md bg-[#d99152] px-4 py-2 text-xs font-semibold text-[#2f1f17] hover:bg-[#e8a86a]">
                  Search
                </button>
              </div>
              <p className="mt-2 text-[11px] text-[#d8bea4]">
                Results: {visibleProducts.length} / {statusMessage}
              </p>
            </form>

            <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {visibleProducts.map((product, index) => (
                <Link
                  href={`/products/${product.id}`}
                  key={product.id}
                  className="animate-fade-in-up rounded-xl border border-[#6f4b35] bg-[#4a2f23] p-3 transition hover:-translate-y-0.5 hover:border-[#f2b880]"
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#f2c48c]">
                    {product.origin}
                  </p>
                  <p className="mt-1 inline-block rounded-full border border-[#80573e] px-2 py-1 text-[11px] text-[#f6ddbf]">
                    {product.category}
                  </p>
                  <div className="mt-3 overflow-hidden rounded-lg border border-[#80573e]">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={720}
                      height={480}
                      className="h-32 w-full object-cover"
                    />
                  </div>
                  <h2 className="mt-2 text-base font-semibold">{product.name}</h2>
                  <p className="mt-1 text-xs text-[#f2dbc1]">{product.note}</p>
                  <div className="mt-3 space-y-1 text-xs text-[#f2dbc1]">
                    <p>Roast: {product.roast}</p>
                    <p>Weight: {product.grams}</p>
                  </div>
                  <p className="mt-3 text-lg font-bold text-[#ffd39d]">
                    {formatYen(product.price)}{" "}
                    <span className="text-[11px] font-normal text-[#f2dbc1]">View details</span>
                  </p>
                </Link>
              ))}
              {visibleProducts.length === 0 ? (
                <article className="sm:col-span-2 xl:col-span-3 rounded-xl border border-[#6f4b35] bg-[#4a2f23] p-4 text-center text-xs text-[#f2dbc1]">
                  No items found for this filter.
                </article>
              ) : null}
            </section>
          </div>

          <div className="space-y-4">
            <CartPanel
              cart={cart}
              setCart={setCart}
              showPurchase
              onPurchase={handlePurchase}
              requireLoginNote={!currentUser}
            />
            <div className="mt-4 border-t border-[#6f4b35] pt-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xs font-semibold text-[#f4e9dc]">🧾 Recent Orders</h3>
                <Link href="/history" className="text-[11px] text-[#ffd39d] hover:underline">
                  View all
                </Link>
              </div>
              {myOrders.length === 0 ? (
                <p className="mt-2 text-[11px] text-[#d8bea4]">No orders yet.</p>
              ) : (
                <ul className="mt-2 space-y-2 text-xs text-[#f2dbc1]">
                  {myOrders.slice(0, 4).map((order) => (
                    <li key={order.id} className="rounded border border-[#6f4b35] p-2">
                      <p>{order.id}</p>
                      <p>{formatYen(order.total)}</p>
                      <p className="text-[11px] text-[#d8bea4]">{order.purchasedAt}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      </div>

      {completedOrder ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1d120d]/70 px-4">
          <div className="animate-fade-in-up w-full max-w-md rounded-xl border border-[#f2b880]/40 bg-[#4a2f23] p-5 shadow-2xl">
            <p className="text-xs uppercase tracking-[0.18em] text-[#ffd39d]">
              Purchase Complete
            </p>
            <h2 className="mt-2 text-xl font-bold">ご購入ありがとうございます</h2>
            <div className="mt-3 space-y-1 text-xs text-[#f2dbc1]">
              <p>Order ID: {completedOrder.id}</p>
              <p>Total: {formatYen(completedOrder.total)}</p>
              <p>Date: {completedOrder.purchasedAt}</p>
            </div>
            <button
              onClick={() => setCompletedOrder(null)}
              className="mt-4 w-full rounded-md bg-[#d99152] px-3 py-2 text-xs font-semibold text-[#2f1f17] transition hover:bg-[#e8a86a]"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}
