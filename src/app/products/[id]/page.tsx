"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import CartPanel from "@/components/CartPanel";
import { PRODUCTS } from "@/data/products";
import {
  CART_KEY,
  OrderRecord,
  getOrders,
  getSessionEmail,
  getUsers,
  normalizeEmail,
  saveOrders,
} from "@/lib/auth";
import { CartItem, normalizeCart } from "@/lib/cart";

const GRIND_OPTIONS = ["Beans", "Medium", "Fine"] as const;
type Grind = (typeof GRIND_OPTIONS)[number];
export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [message, setMessage] = useState("Add items from this product page.");
  const [selectedGrind, setSelectedGrind] = useState<Grind>("Beans");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartLoaded, setIsCartLoaded] = useState(false);

  const product = useMemo(() => PRODUCTS.find((item) => item.id === params.id), [params.id]);

  useEffect(() => {
    const raw = JSON.parse(localStorage.getItem(CART_KEY) ?? "[]") as CartItem[];
    setCart(normalizeCart(raw));
    setIsCartLoaded(true);
  }, []);

  useEffect(() => {
    if (!isCartLoaded) return;
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, isCartLoaded]);

  const addToCart = () => {
    if (!product) return;
    setCart((prev) => {
      const found = prev.find(
        (item) => item.productId === product.id && item.grind === selectedGrind
      );
      return found
        ? prev.map((item) =>
            item.productId === product.id && item.grind === selectedGrind
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...prev, { productId: product.id, quantity: 1, grind: selectedGrind }];
    });
    setMessage(`${product.name} (${selectedGrind}) added to cart.`);
  };

  const handlePurchase = () => {
    const sessionEmail = getSessionEmail();
    if (!sessionEmail) {
      setMessage("Please login to checkout.");
      return;
    }
    if (!cart.length) {
      setMessage("Your cart is empty. Add some beans first.");
      return;
    }
    const users = getUsers();
    const currentUser = users.find(
      (user) => normalizeEmail(user.email) === normalizeEmail(sessionEmail)
    );
    if (!currentUser) {
      setMessage("Session not found. Please login again.");
      return;
    }
    const total = cart.reduce((sum, item) => {
      const productData = PRODUCTS.find((p) => p.id === item.productId);
      return sum + (productData ? productData.price * item.quantity : 0);
    }, 0);
    const newOrder: OrderRecord = {
      id: `ORD-${Date.now()}`,
      email: currentUser.email,
      items: cart,
      total,
      purchasedAt: new Date().toLocaleString("ja-JP"),
    };
    const orders = getOrders();
    saveOrders([newOrder, ...orders]);
    setCart([]);
    setMessage(`Order complete! ID: ${newOrder.id}`);
  };

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    const sameCategory = PRODUCTS.filter(
      (item) => item.id !== product.id && item.category === product.category
    );
    if (sameCategory.length >= 3) return sameCategory.slice(0, 3);
    const fallback = PRODUCTS.filter((item) => item.id !== product.id);
    return [...sameCategory, ...fallback].slice(0, 3);
  }, [product]);

  if (!product) {
    return (
      <main className="min-h-screen bg-[#2f1f17] px-6 py-8 text-[#f4e9dc]">
        <div className="mx-auto max-w-4xl rounded-2xl border border-[#6f4b35] bg-[#4a2f23] p-8">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <Link href="/" className="mt-4 inline-block text-[#ffd39d] hover:underline">
            ← Back to shop
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#2f1f17] px-4 py-6 text-[#f4e9dc]">
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[2fr_1fr]">
        <div>
          <Link href="/" className="text-xs text-[#ffd39d] hover:underline">
            ← Back to shop
          </Link>

          <section className="mt-3 grid gap-5 rounded-xl border border-[#6f4b35] bg-[#4a2f23] p-4 md:grid-cols-2">
            <div className="overflow-hidden rounded-xl border border-[#80573e]">
              <Image
                src={product.image}
                alt={product.name}
                width={720}
                height={480}
                className="h-full w-full object-cover"
              />
            </div>

            <div>
              <p className="inline-block rounded-full border border-[#80573e] px-3 py-1 text-xs text-[#f6ddbf]">
                {product.category}
              </p>
              <h1 className="mt-2 text-2xl font-bold">{product.name}</h1>
              <p className="mt-2 text-xs text-[#f2dbc1]">{product.description}</p>
              <dl className="mt-3 space-y-2 text-xs text-[#f2dbc1]">
                <div className="flex justify-between border-b border-[#6f4b35] pb-1">
                  <dt>Origin</dt>
                  <dd>{product.origin}</dd>
                </div>
                <div className="flex justify-between border-b border-[#6f4b35] pb-1">
                  <dt>Roast</dt>
                  <dd>{product.roast}</dd>
                </div>
                <div className="flex justify-between border-b border-[#6f4b35] pb-1">
                  <dt>Weight</dt>
                  <dd>{product.grams}</dd>
                </div>
                <div className="flex justify-between border-b border-[#6f4b35] pb-1">
                  <dt>Taste Note</dt>
                  <dd>{product.note}</dd>
                </div>
              </dl>
              <p className="mt-3 text-2xl font-bold text-[#ffd39d]">
                ¥{product.price.toLocaleString("ja-JP")}
              </p>
              <div className="mt-3">
                <p className="text-xs text-[#f2dbc1]">Grind Type</p>
                <div className="mt-2 flex gap-2">
                  {GRIND_OPTIONS.map((grind) => (
                    <button
                      key={grind}
                      onClick={() => setSelectedGrind(grind)}
                      className={`rounded-md border px-3 py-2 text-xs transition ${
                        selectedGrind === grind
                          ? "border-[#f2b880] bg-[#d99152] text-[#2f1f17]"
                          : "border-[#80573e] text-[#f2dbc1] hover:bg-[#5a3929]"
                      }`}
                    >
                      {grind}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={addToCart}
                className="mt-3 w-full rounded-md bg-[#d99152] px-3 py-2 text-xs font-semibold text-[#2f1f17] transition hover:bg-[#e8a86a]"
              >
                Add to Cart
              </button>
              <p className="mt-2 text-xs text-[#f2dbc1]">{message}</p>
            </div>
          </section>

          <section className="mt-4 rounded-xl border border-[#6f4b35] bg-[#4a2f23] p-4">
            <h2 className="text-lg font-bold">Related Items</h2>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              {relatedProducts.map((item) => (
                <Link
                  key={item.id}
                  href={`/products/${item.id}`}
                  className="rounded-xl border border-[#80573e] bg-[#3b2419] p-3"
                >
                  <div className="overflow-hidden rounded-lg border border-[#80573e]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={720}
                      height={480}
                      className="h-24 w-full object-cover"
                    />
                  </div>
                  <p className="mt-2 text-[11px] text-[#f2dbc1]">{item.category}</p>
                  <h3 className="text-sm font-semibold">{item.name}</h3>
                  <p className="mt-1 text-xs text-[#f2dbc1]">
                    ¥{item.price.toLocaleString("ja-JP")}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <CartPanel
          cart={cart}
          setCart={setCart}
          showPurchase
          onPurchase={handlePurchase}
          requireLoginNote={!getSessionEmail()}
        />
      </div>
    </main>
  );
}
