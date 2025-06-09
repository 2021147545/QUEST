"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [form, setForm] = useState({ id: "", pw: "", nickname: "", hakbeon: "" });
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSmallHeight, setIsSmallHeight] = useState(false);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    if (!form.id || !form.pw || !form.nickname || !form.hakbeon) {
      setError("모든 항목을 입력해주세요.");
      return;
    }
    setIsRegistering(true);

    const addrScript = "https://script.google.com/macros/s/AKfycbwJMxHtipPghnlaYOMtPG0dQ1gXaurTdZzGQMnHOa17OZJhyp3cHgN2vNLFPwDpFvtV8Q/exec";

    const checkQuery = new URLSearchParams({
      action: "read",
      table: "info"
    });
    try {
      const checkRes = await fetch(`${addrScript}?${checkQuery}`, { method: "GET" });
      const checkJson = await checkRes.json();
      if (!checkJson.success || !Array.isArray(checkJson.data)) {
        setError("중복 확인에 실패했습니다. 다시 시도해주세요.");
        return;
      }

      const users = checkJson.data;

      if (users.find((user: any) => user.id === form.id)) {
        setError("이미 존재하는 아이디입니다.");
        return;
      }
      if (users.find((user: any) => user.nickname === form.nickname)) {
        setError("이미 존재하는 닉네임입니다.");
        return;
      }
      if (users.find((user: any) => String(user.hakbeon).trim() === String(form.hakbeon).trim())) {
        setError("이미 등록된 학번입니다.");
        return;
      }

      const data = {
        id: form.id,
        pw: form.pw,
        money: "100",
        exp: "0",
        level: "1",
        nickname: form.nickname,
        hakbeon: form.hakbeon,
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
    finally {
    setIsRegistering(false); // 종료
  }
  
  useEffect(()=>{
    const check = () => setIsMobile(window.innerWidth < 768);
        check();
  })

  };

  if (isMobile) {
    return (
    <div className="h-screen w-screen relative bg-[#000000] flex items-center justify-center p-10 overflow-hidden">
      {/* 모서리 장식 */}
      <img src="/nasa.png" className="absolute top-3 left-3 w-6 h-6 z-20" alt="screw"/>
      <img src="/nasa.png" className="absolute top-3 right-3 w-6 h-6 z-20" alt="screw"/>
      <img src="/nasa.png" className="absolute bottom-3 left-3 w-6 h-6 z-20" alt="screw"/>
      <img src="/nasa.png" className="absolute bottom-3 right-3 w-6 h-6 z-20" alt="screw"/>

      {/* 내부 콘텐츠 영역 (프레임 안쪽) */}
      <div className="h-full w-full bg-[#583c24] flex items-center justify-center rounded-none relative z-0 border border-black transition-all duration-300"
          style={{
            minHeight: isSmallHeight
            ? `calc(${window.innerHeight}px - 200px)`
            : "calc(100vh - 120px)",
            background: "#583c24",
            padding: "20px 0",
            transition: "min-height 0.3s"
          }}>
        <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto space-y-6 z-10 px-4">
          <h1 className="text-2xl font-bold text-white mb-4 mt-6">회원가입</h1>
          <div className="w-full space-y-4">
            <input
              name="id"
              placeholder="아이디"
              onChange={handleChange}
              className="w-full h-12 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none"
            />
            <input
              name="pw"
              type="password"
              placeholder="비밀번호"
              onChange={handleChange}
              className="w-full h-12 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none"
            />
            <input
              name="nickname"
              placeholder="닉네임"
              onChange={handleChange}
              className="w-full h-12 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none"
            />
            <input
              name="hakbeon"
              placeholder="학번 (중복 방지를 위해 필요합니다.)"
              onChange={handleChange}
              className="w-full h-12 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none"
            />
            
            <button
              onClick={handleRegister}
              className="w-full bg-gray-400 hover:bg-gray-500 text-white text-lg px-4 py-3 rounded-xl mt-2 shadow"
            >
              가입하기
              {isRegistering && (
                <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur bg-black/40">
                    <div className="w-14 h-14 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
                </div>
                )}
            </button>
            {error && <p className="text-red-400 text-center text-sm">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );


  }

  return (
    <div className="h-screen w-screen relative bg-black p-10 overflow-hidden">
      {/* 모서리 장식 */}
      <img src="/nasa.png" className="absolute top-3 left-3 w-6 h-6 z-20" alt="screw"/>
      <img src="/nasa.png" className="absolute top-3 right-3 w-6 h-6 z-20" alt="screw"/>
      <img src="/nasa.png" className="absolute bottom-3 left-3 w-6 h-6 z-20" alt="screw"/>
      <img src="/nasa.png" className="absolute bottom-3 right-3 w-6 h-6 z-20" alt="screw"/>

      {/* 내부 콘텐츠 영역 (프레임 안쪽) */}
      <div className="h-full w-full bg-[#583c24] flex items-center justify-center rounded-none relative z-0 border border-black">
        <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto space-y-6 z-10 px-4">
          <h1 className="text-2xl font-bold text-white mb-4 mt-6">회원가입</h1>
          <div className="w-full space-y-4">
            <input
              name="id"
              placeholder="아이디"
              onChange={handleChange}
              className="w-full h-12 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none"
            />
            <input
              name="pw"
              type="password"
              placeholder="비밀번호"
              onChange={handleChange}
              className="w-full h-12 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none"
            />
            <input
              name="nickname"
              placeholder="닉네임"
              onChange={handleChange}
              className="w-full h-12 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none"
            />
            <input
              name="hakbeon"
              placeholder="학번 (중복 방지를 위해 필요합니다.)"
              onChange={handleChange}
              className="w-full h-12 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none"
            />
            
            <button
              onClick={handleRegister}
              className="w-full bg-gray-400 hover:bg-gray-500 text-white text-lg px-4 py-3 rounded-xl mt-2 shadow"
            >
              가입하기
              {isRegistering && (
                <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur bg-black/40">
                    <div className="w-14 h-14 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
                </div>
                )}
            </button>
            {error && <p className="text-red-400 text-center text-sm">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
