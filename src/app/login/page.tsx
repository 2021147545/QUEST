"use client"
{/*login page*/}

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { HelpCircle } from "lucide-react";
export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const router = useRouter();

  // --------- 방문자 정보 기록 함수 ---------
  function padValue(value: number) {
    return value < 10 ? "0" + value : value;
  }
  function getTimeStamp() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${padValue(year)}-${padValue(month)}-${padValue(day)} ${padValue(hours)}:${padValue(minutes)}:${padValue(seconds)}`;
  }
  // 쿠키에서 값 가져오기
  function getCookieValue(name: string) {
    if (typeof document === "undefined") return undefined;
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop()?.split(";").shift();
  }
  // 쿠키에 값 저장하기
  function setCookieValue(name: string, value: string, days: number) {
    if (typeof document === "undefined") return;
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }
  // UV id 생성/저장
  function getUVfromCookie() {
    const hash = Math.random().toString(36).substring(2, 8).toUpperCase();
    const existingHash = getCookieValue("user");
    if (!existingHash) {
      setCookieValue("user", hash, 180);
      return hash;
    } else {
      return existingHash;
    }
  }


  const handleLogin = async () => {
  if (!username.trim() || !password.trim()) {
    setError("아이디와 비밀번호를 입력해주세요.");
    return; 
  }

  setIsLoggingIn(true); // 로그인 시작

  const addrScript = "https://script.google.com/macros/s/AKfycbwJMxHtipPghnlaYOMtPG0dQ1gXaurTdZzGQMnHOa17OZJhyp3cHgN2vNLFPwDpFvtV8Q/exec";
  const query = new URLSearchParams({
    action: "read",
    table: "info"
  });

  try {
    const res = await fetch(`${addrScript}?${query}`, { method: "GET" });
    const json = await res.json();

    if (!json.success || !json.data) {
      setError("로그인 데이터를 불러올 수 없습니다.");
      return;
    }

    const users = json.data;
    const matched = users.find((user: any) =>
      user.id === username.trim() && user.pw === password.trim()
    );

    if (matched) {
      localStorage.setItem("username", matched.nickname || matched.id);
      router.push("/");
    } else {
      setError("아이디 또는 비밀번호가 일치하지 않습니다.");
    }
  } catch (err) {
    setError("로그인 중 오류가 발생했습니다.");
    console.error(err);
  } finally {
    setIsLoggingIn(false); // 로그인 종료
  }
};

    useEffect(() => {
  // (1) ip 먼저 받아온 후 기록
  fetch("https://api.ipify.org?format=json")
    .then(res => res.json())
    .then(({ ip }) => {
      // 나머지 방문자 정보 준비
      const id = getUVfromCookie();
      const landingUrl = window.location.href;
      const referer = document.referrer || "";
      const params = new URLSearchParams(window.location.search);
      const utm = params.get("utm") || "";
      const device = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? "mobile" : "desktop";
      const time_stamp = getTimeStamp();

      // 기록용 데이터 객체
      const data = JSON.stringify({
        id, landingUrl, ip, referer, time_stamp, utm, device
      });

      const addrScript = "https://script.google.com/macros/s/AKfycbwJMxHtipPghnlaYOMtPG0dQ1gXaurTdZzGQMnHOa17OZJhyp3cHgN2vNLFPwDpFvtV8Q/exec";
      fetch(`${addrScript}?action=insert&table=visitors&data=${encodeURIComponent(data)}`);
    })
    .catch(() => {
      // ip 가져오기 실패 시 ip: "unknown" 으로 기록
      const id = getUVfromCookie();
      const landingUrl = window.location.href;
      const referer = document.referrer || "";
      const params = new URLSearchParams(window.location.search);
      const utm = params.get("utm") || "";
      const device = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? "mobile" : "desktop";
      const time_stamp = getTimeStamp();
      const ip = "unknown";
      const data = JSON.stringify({
        id, landingUrl, ip, referer, time_stamp, utm, device
      });

      const addrScript = "https://script.google.com/macros/s/AKfycbwJMxHtipPghnlaYOMtPG0dQ1gXaurTdZzGQMnHOa17OZJhyp3cHgN2vNLFPwDpFvtV8Q/exec";
      fetch(`${addrScript}?action=insert&table=visitors&data=${encodeURIComponent(data)}`);
    });

  // 로그인 중복 체크(기존 코드)
  const stored = localStorage.getItem("username");
  if (stored) {
    router.replace("/"); // push 대신 replace를 쓰면 히스토리에도 남지 않음!
  }
}, [router]);

  return (
    <div className="h-screen w-screen relative bg-[#000000] p-10 overflow-hidden">
        <img src="/nasa.png" className="absolute top-3 left-3 w-6 h-6 z-20" alt="screw" sizes="40"/>
      <img src="/nasa.png" className="absolute top-3 right-3 w-6 h-6 z-20" alt="screw" />
      <img src="/nasa.png" className="absolute bottom-3 left-3 w-6 h-6 z-20" alt="screw" />
      <img src="/nasa.png" className="absolute bottom-3 right-3 w-6 h-6 z-20" alt="screw" />
      {/* 내부 콘텐츠 영역 (프레임 안쪽) */}
      <div className="h-full w-full bg-[#583c24] flex items-center justify-center rounded-none relative z-0 border border-black">
        {/* 로그인 콘텐츠 */}
        <div className="flex flex-col items-center justify-center w-full px-4 z-10">
          {/* 로고 */}
          <Image
            src="/quest.png"
            alt="Quest Logo"
            width={240}
            height={100}
            className="mb-8"
            priority
          />
          <h1 className="pt-0 pb-3 font-bold">하루를 완벽하게, 부담없이 도움받는 품앗이 플랫폼</h1>

          {/* 입력창 */}
          <div className="w-full max-w-xs space-y-4">
            <input
              type="text"
              placeholder="ID"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full h-12 px-4 py-2 rounded-2xl border border-gray-300 shadow-sm focus:outline-none"
            />
            <input
              type="password"
              placeholder="PW"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 px-4 py-2 rounded-2xl border border-gray-300 shadow-sm focus:outline-none"
            />

            {/* 버튼들 */}
            <div className="flex justify-between items-center pt-2 text-sm text-gray-700">
              <button className="hover:underline text-gray-400" onClick={(e)=>router.push("../register")}>회원가입</button>
              <button
                onClick={() => router.push("/faq")}
                className="bg-gray-300 hover:bg-gray-400 text-[#583c24] px-4 py-2 rounded flex ml-25"
                >
                <HelpCircle  size={18} color="#583c24" />
                <span className="text-sm text-[#583c24]">FAQ</span>
              </button>
              <button
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="bg-gray-300 hover:bg-gray-400 text-[#583c24] px-4 py-2 rounded"
                >로그인
                {isLoggingIn && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur bg-opacity-30">
                        <div className="w-10 h-10 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
                    </div>
                    )}
                </button>
            </div>
            {/* 왼쪽 하단 - 관리자 정보 */}
            <div className="fixed bottom-6 left-12 text-xs text-gray-400">
                관리자: 20211475xx 이승민
            </div>

            {/* 오른쪽 하단 - 서비스 대상 안내 */}
            <div className=" text-xs text-gray-400 ">
                *서비스는 현재 연세대학교 소속원을 대상으로 하고 있습니다.
            </div>

            {error && (
              <p className="text-red-500 text-xs text-center mt-2">{error}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
