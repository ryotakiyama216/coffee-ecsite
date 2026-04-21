export type Grind = "豆" | "中挽き" | "細挽き";

export type CartItem = {
  productId: string;
  grind: Grind;
  quantity: number;
};

export const DEFAULT_GRIND: Grind = "豆";

export const normalizeCart = (
  raw: CartItem[] | { productId: string; quantity: number; grind?: Grind }[]
): CartItem[] =>
  raw.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
    grind: "grind" in item && item.grind ? item.grind : DEFAULT_GRIND,
  }));
