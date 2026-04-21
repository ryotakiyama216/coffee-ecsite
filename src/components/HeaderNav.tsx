"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { clearSession, getSessionEmail, getUsers, User } from "@/lib/auth";

export default function HeaderNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [users, setUsers] = useState<User[]>([]);
  const [sessionEmail, setSessionEmail] = useState("");

  useEffect(() => {
    const sync = () => {
      setUsers(getUsers());
      setSessionEmail(getSessionEmail());
    };
    sync();
    window.addEventListener("focus", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("focus", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const currentUserName = useMemo(
    () =>
      users.find((user) => user.email === sessionEmail)?.name ??
      (sessionEmail ? sessionEmail.split("@")[0] : ""),
    [users, sessionEmail]
  );

  const handleLogout = () => {
    clearSession();
    setSessionEmail("");
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#6f4b35] bg-[#2a1a13]/95 backdrop-blur">
      <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="text-sm font-semibold tracking-[0.1em] text-[#f5ddc2]">
          COFFEE BEANS STORE
        </Link>
        <nav className="flex items-center gap-4 text-xs text-[#efd5b8]">
          <Link href="/" className="hover:text-[#ffd39d]">
            Shop
          </Link>
          <Link href="/history" className="hover:text-[#ffd39d]">
            History
          </Link>
          <Link href="/account" className="hover:text-[#ffd39d]">
            {sessionEmail ? currentUserName || "Profile" : "Profile"}
          </Link>
          {sessionEmail ? (
            <button onClick={handleLogout} className="hover:text-[#ffd39d]">
              Logout
            </button>
          ) : (
            <Link href="/login" className={pathname === "/login" ? "text-[#ffd39d]" : "hover:text-[#ffd39d]"}>
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
