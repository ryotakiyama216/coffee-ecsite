import { CartItem } from "@/lib/cart";

export type User = {
  name: string;
  email: string;
  password: string;
};

export type OrderRecord = {
  id: string;
  email: string;
  items: CartItem[];
  total: number;
  purchasedAt: string;
};

type SessionPayload = {
  email: string;
  expiresAt: number;
};

export const USER_KEY = "ec_users";
export const SESSION_KEY = "ec_session_email";
export const CART_KEY = "ec_cart";
export const ORDER_KEY = "ec_orders";
export const SESSION_DURATION_MS = 60 * 60 * 1000;

export const setSession = (email: string) => {
  const payload: SessionPayload = {
    email,
    expiresAt: Date.now() + SESSION_DURATION_MS,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(payload));
};

export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
};

export const getSessionEmail = (): string => {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return "";

  try {
    const parsed = JSON.parse(raw) as SessionPayload;
    if (!parsed.email || !parsed.expiresAt) {
      clearSession();
      return "";
    }
    if (Date.now() > parsed.expiresAt) {
      clearSession();
      return "";
    }
    return parsed.email;
  } catch {
    // Migrate old format (plain email string) to new timed session.
    if (raw.includes("@")) {
      setSession(raw);
      return raw;
    }
    clearSession();
    return "";
  }
};

export const normalizeEmail = (value: string) => value.trim().toLowerCase();
export const normalizePassword = (value: string) => value.trim();

export const getUsers = (): User[] => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) ?? "[]") as User[];
  } catch {
    return [];
  }
};

export const saveUsers = (users: User[]) => {
  const existingUsers = getUsers();
  // Guard against accidental wipes from stale empty arrays.
  if (users.length === 0 && existingUsers.length > 0) {
    return;
  }
  localStorage.setItem(USER_KEY, JSON.stringify(users));
};

export const getOrders = (): OrderRecord[] => {
  try {
    return JSON.parse(localStorage.getItem(ORDER_KEY) ?? "[]") as OrderRecord[];
  } catch {
    return [];
  }
};

export const saveOrders = (orders: OrderRecord[]) => {
  const existingOrders = getOrders();
  // Guard against accidental wipes from stale empty arrays.
  if (orders.length === 0 && existingOrders.length > 0) {
    return;
  }
  localStorage.setItem(ORDER_KEY, JSON.stringify(orders));
};

export const registerUser = (name: string, email: string, password: string) => {
  const normalizedName = name.trim();
  const normalizedEmail = normalizeEmail(email);
  const normalizedPassword = normalizePassword(password);

  if (!normalizedName || !normalizedEmail || !normalizedPassword) {
    return { ok: false as const, reason: "empty" as const };
  }

  const users = getUsers();
  const duplicate = users.some(
    (user) => normalizeEmail(user.email) === normalizedEmail
  );
  if (duplicate) {
    return { ok: false as const, reason: "duplicate" as const };
  }

  const nextUsers = [
    ...users,
    {
      name: normalizedName,
      email: normalizedEmail,
      password: normalizedPassword,
    },
  ];
  saveUsers(nextUsers);
  return { ok: true as const, user: nextUsers[nextUsers.length - 1], users: nextUsers };
};

export const authenticateUser = (email: string, password: string): User | null => {
  const normalizedEmail = normalizeEmail(email);
  const normalizedPassword = normalizePassword(password);
  const users = getUsers();
  return (
    users.find(
      (user) =>
        normalizeEmail(user.email) === normalizedEmail &&
        user.password === normalizedPassword
    ) ?? null
  );
};
