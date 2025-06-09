"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [form, setForm] = useState({ id: "", pw: "", nickname: "", hakbeon: "" });
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSmall, setIsSmall] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  // 윈도우/컨테이너 크기 감지
  useEffect(() => {
    const handleResize = () => {
      setIsSmall(window.innerHeight < 600);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 입력창 포커스 감지 핸들러
  const handleFocus = () => setIsInputFocused(true);
  const handleBlur = () => setIsInputFocused(false);

  // 입력값 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 회원가입 함수(이전 코드 동일, 생략)
  // ... handleRegister 그대로 복붙

  // 스타일 상태: 작아지면(=키보드 올라오거나 창 작으면) 자동 적용
  const shouldCompact = isSmall || isInputFocused;

  return (
    <div className="h-screen w-screen relative bg-black p-10 overflow-hidden">
      {/* 모서리 장식 */}
      <img src="/nasa.png" className="absolute top-3 left-3 w-6 h-6 z-20" alt="screw"/>
      <img src="/nasa.png" className="absolute top-3 right-3 w-6 h-6 z-20" alt="screw"/>
      <img src="/nasa.png" className="absolute bottom-3 left-3 w-6 h-6 z-20" alt="screw"/>
      <img src="/nasa.png" className="absolute bottom-3 right-3 w-6 h-6 z-20" alt="screw"/>

      {/* 내부 콘텐츠 영역 */}
      <div
        ref={containerRef}
        className={`
          h-full w-full bg-[#583c24] flex items-center justify-center relative z-0 border border-black
          transition-all duration-300
        `}
      >
        {/* 입력창 및 버튼 영역 */}
        <div
          className={`
            flex flex-col items-center justify-center w-full max-w-md mx-auto
            z-10 px-4
            transition-all duration-300
            ${shouldCompact
              ? "space-y-3 py-4 max-h-[70vh] overflow-y-auto"
              : "space-y-6 py-16"
            }
          `}
          style={{
            fontSize: shouldCompact ? "0.95rem" : "1.1rem"
          }}
        >
          <h1 className={`text-2xl font-bold text-white mb-2 mt-2 transition-all duration-200 ${shouldCompact ? "text-xl" : ""}`}>
            회원가입
          </h1>
          <div className="w-full space-y-3">
            <input
              name="id"
              placeholder="아이디"
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className={`w-full h-12 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none transition-all ${shouldCompact ? "h-10" : ""}`}
            />
            <input
              name="pw"
              type="password"
              placeholder="비밀번호"
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className={`w-full h-12 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none transition-all ${shouldCompact ? "h-10" : ""}`}
            />
            <input
              name="nickname"
              placeholder="닉네임"
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className={`w-full h-12 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none transition-all ${shouldCompact ? "h-10" : ""}`}
            />
            <input
              name="hakbeon"
              placeholder="학번 (중복 방지를 위해 필요합니다.)"
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className={`w-full h-12 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none transition-all ${shouldCompact ? "h-10" : ""}`}
            />
            <button
              onClick={handleRegister}
              className="w-full bg-gray-400 hover:bg-gray-500 text-white text-lg px-4 py-3 rounded-xl mt-2 shadow"
              style={shouldCompact ? { fontSize: "1rem", padding: "0.8rem" } : {}}
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
