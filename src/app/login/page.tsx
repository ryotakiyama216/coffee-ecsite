"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  authenticateUser,
  clearSession,
  getSessionEmail,
  getUsers,
  setSession,
  User,
} from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [sessionEmail, setSessionEmail] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("登録済みアカウントでログインしてください。");

  useEffect(() => {
    setUsers(getUsers());
    setSessionEmail(getSessionEmail());
  }, []);

  const handleLogin = (event: FormEvent) => {
    event.preventDefault();
    const user = authenticateUser(email, password);
    if (!user) {
      setMessage("メールまたはパスワードが違います。");
      return;
    }
    setSession(user.email);
    setSessionEmail(user.email);
    setMessage(`${user.name}さん、ログインしました。`);
    setEmail("");
    setPassword("");
    router.push("/");
    router.refresh();
  };

  const handleLogout = () => {
    clearSession();
    setSessionEmail("");
    setMessage("ログアウトしました。");
    router.push("/login");
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-[#2f1f17] px-4 py-8 text-[#f4e9dc]">
      <div className="mx-auto max-w-md rounded-xl border border-[#6f4b35] bg-[#4a2f23] p-5">
        <h1 className="text-xl font-bold">ログイン</h1>
        <p className="mt-2 text-xs text-[#f2dbc1]">{message}</p>

        {sessionEmail ? (
          <div className="mt-4 space-y-3">
            <p className="text-sm">ログイン中: {sessionEmail}</p>
            <button
              onClick={handleLogout}
              className="w-full rounded-md bg-[#9e4f3a] px-3 py-2 text-xs font-semibold text-white hover:bg-[#b15f46]"
            >
              ログアウト
            </button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="mt-4 space-y-3">
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="email@example.com"
              className="w-full rounded-md border border-[#6f4b35] bg-[#2e1c14] px-3 py-2 text-xs"
            />
            <div className="grid grid-cols-[1fr_auto] gap-2">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="パスワード"
                className="w-full rounded-md border border-[#6f4b35] bg-[#2e1c14] px-3 py-2 text-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="rounded-md border border-[#6f4b35] px-3 py-2 text-[11px] text-[#f2dbc1] hover:bg-[#5a3929]"
              >
                {showPassword ? "隠す" : "表示"}
              </button>
            </div>
            <button className="w-full rounded-md bg-[#d99152] px-3 py-2 text-xs font-semibold text-[#2f1f17] hover:bg-[#e8a86a]">
              ログインする
            </button>
          </form>
        )}

        <p className="mt-4 text-xs text-[#d8bea4]">
          アカウントがない場合は <Link href="/register" className="underline">新規登録</Link>
        </p>
      </div>
    </main>
  );
}
