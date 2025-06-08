"use client";
{/*register page*/}

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [form, setForm] = useState({ id: "", pw: "", nickname: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    if (!form.id || !form.pw || !form.nickname) {
      setError("모든 항목을 입력해주세요.");
      return;
    }

    try {
      const addrScript = "https://script.google.com/macros/s/AKfycbwJMxHtipPghnlaYOMtPG0dQ1gXaurTdZzGQMnHOa17OZJhyp3cHgN2vNLFPwDpFvtV8Q/exec";
      const data = {
        id: form.id,
        pw: form.pw,
        money: "100",
        exp: "0",
        level: "1",
        nickname: form.nickname
      };
      const query = new URLSearchParams({
        action: "insert",
        table: "info",
        data: JSON.stringify(data)
      });
      const res = await fetch(`${addrScript}?${query}`, { method: "GET" });
      const json = await res.json();

      if (json.success) {
        alert("회원가입 완료!");
        router.push("/login");
      } else {
        setError("회원가입 실패. 다시 시도해주세요.");
      }
    } catch (err) {
      setError("오류 발생");
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto space-y-4">
      <h1 className="text-xl font-bold">회원가입</h1>
      <input name="id" placeholder="아이디" onChange={handleChange} className="w-full border p-2 rounded" />
      <input name="pw" type="password" placeholder="비밀번호" onChange={handleChange} className="w-full border p-2 rounded" />
      <input name="nickname" placeholder="닉네임" onChange={handleChange} className="w-full border p-2 rounded" />
      <button onClick={handleRegister} className="bg-blue-500 text-white px-4 py-2 rounded">가입하기</button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
