"use client";

import Link from "next/link";
import { PRODUCTS } from "@/data/products";
import { CartItem } from "@/lib/cart";

type Props = {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  onPurchase?: () => void;
  showPurchase?: boolean;
  requireLoginNote?: boolean;
};

export default function CartPanel({
  cart,
  setCart,
  onPurchase,
  showPurchase = false,
  requireLoginNote = false,
}: Props) {
  const cartDetail = cart
    .map((item) => {
      const product = PRODUCTS.find((p) => p.id === item.productId);
      if (!product) return null;
      return { ...item, product, subTotal: product.price * item.quantity };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const total = cartDetail.reduce((sum, item) => sum + item.subTotal, 0);
  const formatYen = (price: number) => `¥${price.toLocaleString("ja-JP")}`;

  const updateQuantity = (productId: string, grind: CartItem["grind"], quantity: number) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId && item.grind === grind
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromCart = (productId: string, grind: CartItem["grind"]) => {
    setCart((prev) =>
      prev.filter((item) => !(item.productId === productId && item.grind === grind))
    );
  };

  return (
    <aside className="rounded-xl border border-[#6f4b35] bg-[#4a2f23] p-4">
      <h2 className="text-base font-semibold">🛒 Cart</h2>
      <div className="mt-3 space-y-2">
        {cartDetail.length === 0 ? (
          <p className="text-xs text-[#d8bea4]">Your cart is empty.</p>
        ) : (
          cartDetail.map((item) => (
            <div
              key={`${item.productId}-${item.grind}`}
              className="rounded-md border border-[#6f4b35] p-2"
            >
              <p className="text-sm font-medium">{item.product.name}</p>
              <p className="text-[11px] text-[#d8bea4]">Grind: {item.grind}</p>
              <p className="text-xs text-[#f2dbc1]">{formatYen(item.subTotal)}</p>
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={() =>
                    updateQuantity(item.productId, item.grind, item.quantity - 1)
                  }
                  className="rounded bg-[#2e1c14] px-2 py-1 text-[11px]"
                >
                  -
                </button>
                <span className="text-xs">{item.quantity}</span>
                <button
                  onClick={() =>
                    updateQuantity(item.productId, item.grind, item.quantity + 1)
                  }
                  className="rounded bg-[#2e1c14] px-2 py-1 text-[11px]"
                >
                  +
                </button>
                <button
                  onClick={() => removeFromCart(item.productId, item.grind)}
                  className="ml-auto text-[11px] text-[#f3b9a8] hover:text-[#ffd1c3]"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-3 border-t border-[#6f4b35] pt-3">
        <p className="text-xs text-[#f2dbc1]">Total</p>
        <p className="text-xl font-bold text-[#ffd39d]">{formatYen(total)}</p>
        {showPurchase ? (
          <button
            onClick={onPurchase}
            className="mt-2 w-full rounded-md bg-[#e0a768] px-3 py-2 text-xs font-semibold text-[#2f1f17] transition hover:bg-[#efbb83] disabled:cursor-not-allowed disabled:bg-[#4f382a] disabled:text-[#bfa992]"
            disabled={cartDetail.length === 0}
          >
            Checkout
          </button>
        ) : null}
        {requireLoginNote ? (
          <p className="mt-2 text-[11px] text-[#d8bea4]">
            Please <Link href="/login" className="underline">login</Link> to checkout.
          </p>
        ) : null}
      </div>
    </aside>
  );
}
