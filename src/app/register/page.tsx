"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUsers, registerUser, setSession, User } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("新しいアカウントを作成します。");

  useEffect(() => {
    setUsers(getUsers());
  }, []);

  const handleRegister = (event: FormEvent) => {
    event.preventDefault();
    const result = registerUser(name, email, password);
    if (!result.ok && result.reason === "empty") {
      setMessage("名前・メール・パスワードを入力してください。");
      return;
    }
    if (!result.ok && result.reason === "duplicate") {
      setMessage("このメールアドレスは既に登録されています。");
      return;
    }
    if (!result.ok) return;

    setSession(result.user.email);
    setUsers(result.users);
    setName("");
    setEmail("");
    setPassword("");
    setMessage("登録完了。ログイン状態になりました。");
    router.push("/");
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-[#2f1f17] px-4 py-8 text-[#f4e9dc]">
      <div className="mx-auto max-w-md rounded-xl border border-[#6f4b35] bg-[#4a2f23] p-5">
        <h1 className="text-xl font-bold">新規登録</h1>
        <p className="mt-2 text-xs text-[#f2dbc1]">{message}</p>

        <form onSubmit={handleRegister} className="mt-4 space-y-3">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="名前"
            className="w-full rounded-md border border-[#6f4b35] bg-[#2e1c14] px-3 py-2 text-xs"
          />
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
            登録する
          </button>
        </form>

        <p className="mt-4 text-xs text-[#d8bea4]">
          既にアカウントがある場合は <Link href="/login" className="underline">ログイン</Link>
        </p>
      </div>
    </main>
  );
}
