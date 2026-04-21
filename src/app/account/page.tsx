"use client";

import { FormEvent, useEffect, useState } from "react";
import { getSessionEmail, getUsers, saveUsers, setSession, User } from "@/lib/auth";

export default function AccountPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [sessionEmail, setSessionEmail] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("ログインユーザー情報を表示しています。");

  useEffect(() => {
    const sync = () => {
      const loadedUsers = getUsers();
      const currentEmail = getSessionEmail();
      setUsers(loadedUsers);
      setSessionEmail(currentEmail);

      const currentUser =
        loadedUsers.find((user) => user.email === currentEmail) ??
        loadedUsers.find(
          (user) => user.email.toLowerCase() === currentEmail.toLowerCase()
        );

      if (currentUser) {
        // Always hydrate form with currently logged-in user values.
        setName(currentUser.name);
        setEmail(currentUser.email);
        setCurrentPassword(currentUser.password);
      } else if (currentEmail) {
        setName("");
        setEmail(currentEmail);
        setCurrentPassword("");
        setMessage("ログイン情報を読み込みました。必要な項目を入力して更新できます。");
      }
    };

    sync();
    window.addEventListener("focus", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("focus", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const handleUpdate = (event: FormEvent) => {
    event.preventDefault();
    if (!sessionEmail) {
      setMessage("ログインしてから編集してください。");
      return;
    }
    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedCurrentPassword = currentPassword.trim();
    const normalizedNewPassword = newPassword.trim();

    if (!normalizedName || !normalizedEmail || !normalizedCurrentPassword) {
      setMessage("名前・メール・現在のパスワードを入力してください。");
      return;
    }
    const duplicate = users.some(
      (user) =>
        user.email.trim().toLowerCase() === normalizedEmail &&
        user.email.trim().toLowerCase() !== sessionEmail.trim().toLowerCase()
    );
    if (duplicate) {
      setMessage("このメールアドレスは既に使われています。");
      return;
    }

    const nextPassword = normalizedNewPassword || normalizedCurrentPassword;
    const nextUsers = users.map((user) =>
      user.email.trim().toLowerCase() === sessionEmail.trim().toLowerCase()
        ? { name: normalizedName, email: normalizedEmail, password: nextPassword }
        : user
    );
    setUsers(nextUsers);
    setSessionEmail(normalizedEmail);
    setCurrentPassword(nextPassword);
    setNewPassword("");
    saveUsers(nextUsers);
    setSession(normalizedEmail);
    setMessage("ユーザー情報を更新しました。");
  };

  if (!sessionEmail) {
    return (
      <main className="min-h-screen bg-[#2f1f17] px-4 py-8 text-[#f4e9dc]">
        <div className="mx-auto max-w-md rounded-xl border border-[#6f4b35] bg-[#4a2f23] p-5">
          <h1 className="text-xl font-bold">ユーザー情報</h1>
          <p className="mt-2 text-xs text-[#f2dbc1]">
            ユーザー情報を表示するにはログインが必要です。
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#2f1f17] px-4 py-8 text-[#f4e9dc]">
      <div className="mx-auto max-w-md rounded-xl border border-[#6f4b35] bg-[#4a2f23] p-5">
        <h1 className="text-xl font-bold">ユーザー情報</h1>
        <p className="mt-2 text-xs text-[#f2dbc1]">{message}</p>

        <form onSubmit={handleUpdate} className="mt-4 space-y-3">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="お名前"
            className="w-full rounded-md border border-[#6f4b35] bg-[#2e1c14] px-3 py-2 text-xs"
          />
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="メールアドレス"
            className="w-full rounded-md border border-[#6f4b35] bg-[#2e1c14] px-3 py-2 text-xs"
          />
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <input
              type={showPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
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
          <input
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            placeholder="新しいパスワード"
            className="w-full rounded-md border border-[#6f4b35] bg-[#2e1c14] px-3 py-2 text-xs"
          />
          <p className="text-[11px] text-[#d8bea4]">
            新しいパスワードが未入力の場合は、現在のパスワードを保持します。
          </p>
          <button className="w-full rounded-md bg-[#d99152] px-3 py-2 text-xs font-semibold text-[#2f1f17] hover:bg-[#e8a86a]">
            更新する
          </button>
        </form>
      </div>
    </main>
  );
}
