"use client";

import { useEffect, useState } from "react";
import { Quest } from "../type";
import { LogOut, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function MyPage() {
  const [username, setUsername] = useState("");
  const [money, setMoney] = useState("");
  const [level, setLevel] = useState("");
  const [myQuests, setMyQuests] = useState<Quest[]>([]);
  const [acceptedQuests, setAcceptedQuests] = useState<Quest[]>([]);
  const router = useRouter();

  const addrScript =
    "https://script.google.com/macros/s/AKfycbwJMxHtipPghnlaYOMtPG0dQ1gXaurTdZzGQMnHOa17OZJhyp3cHgN2vNLFPwDpFvtV8Q/exec";

  useEffect(() => {
    const stored = localStorage.getItem("username");
    if (!stored) {
      router.push("/login");
    } else {
      setUsername(stored);
      fetchUserInfo(stored);
      fetchQuests(stored);
    }
    // eslint-disable-next-line
  }, []);

  const fetchUserInfo = async (nickname: string) => {
    const query = new URLSearchParams({
      action: "read",
      table: "info",
    });
    try {
      const res = await fetch(`${addrScript}?${query}`, { method: "GET" });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const user = json.data.find((u: any) => u.nickname === nickname);
        if (user) {
          setMoney(user.money || "0");
          setLevel(user.level || "1");
        }
      }
    } catch (e) {
      setMoney("0");
      setLevel("1");
    }
  };

  const fetchQuests = async (nickname: string) => {
    const query = new URLSearchParams({
      action: "read",
      table: "quests",
    });
    try {
      const res = await fetch(`${addrScript}?${query}`, { method: "GET" });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const quests: Quest[] = json.data;
        setMyQuests(quests.filter((q) => q.nickname === nickname));
        setAcceptedQuests(quests.filter((q) => q.angel === nickname));
      }
    } catch (e) {
      setMyQuests([]);
      setAcceptedQuests([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    alert("로그아웃되었습니다.");
    router.replace("/login");
  };

  const handleComplete = async (quest: Quest) => {
  if (!quest.angel) {
    alert("수락자가 없습니다.");
    return;
  }
  if (!window.confirm(`정말로 "${quest.quest}" 퀘스트를 완료 처리할까요?\n보상(${quest.reward}G)가 수락자에게 전달됩니다.`)) return;

  // 1. 유저 데이터 읽기
  const infoQuery = new URLSearchParams({ action: "read", table: "info" });
  const res = await fetch(`${addrScript}?${infoQuery}`, { method: "GET" });
  const json = await res.json();

  if (!(json.success && Array.isArray(json.data))) {
    alert("유저 정보 불러오기 실패");
    return;
  }

  const myInfo = json.data.find((u: any) => u.nickname === username);
  const angelInfo = json.data.find((u: any) => u.nickname === quest.angel);
  if (!myInfo || !angelInfo) {
    alert("유저 정보를 찾을 수 없습니다.");
    return;
  }
  const reward = parseInt(quest.reward ?? "0", 10);
  const myMoney = parseInt(myInfo.money ?? "0", 10);
  const angelMoney = parseInt(angelInfo.money ?? "0", 10);

  if (myMoney < reward) {
    alert("보상 지급에 필요한 크레딧이 부족합니다.");
    return;
  }

  // 2. 보상 이동: 내 크레딧 차감, angel 크레딧 증가 (동기/비동기 update)
  const updateMyQuery = new URLSearchParams({
    action: "update",
    table: "info",
    nickname: myInfo.nickname, // <-- id 대신 nickname
    data: JSON.stringify({ money: String(myMoney - reward) }),
  });
    const updateAngelQuery = new URLSearchParams({
    action: "update",
    table: "info",
    nickname: angelInfo.nickname, // <-- id 대신 nickname
    data: JSON.stringify({ money: String(angelMoney + reward) }),
    });


  // 동시 실행 (성공 체크)
  try {
    const [myRes, angelRes] = await Promise.all([
      fetch(`${addrScript}?${updateMyQuery}`, { method: "GET" }),
      fetch(`${addrScript}?${updateAngelQuery}`, { method: "GET" }),
    ]);
    const myResJson = await myRes.json();
    const angelResJson = await angelRes.json();
    if (!(myResJson.success && angelResJson.success)) {
      alert("크레딧 이동에 실패했습니다.");
      return;
    }

    // 3. 퀘스트 row 삭제 (혹은 done=true 등 완료 플래그 업데이트)
    const deleteQuestQuery = new URLSearchParams({
      action: "delete",
      table: "quests",
      id: quest.id,
    });
    const delRes = await fetch(`${addrScript}?${deleteQuestQuery}`, { method: "GET" });
    const delJson = await delRes.json();
    if (!delJson.success) {
      alert("퀘스트 완료 처리(삭제)에 실패했습니다.");
      return;
    }

    alert("퀘스트 완료! 보상이 지급되었습니다.");
    // 새로고침
    fetchUserInfo(username);
    fetchQuests(username);
  } catch (e) {
    alert("퀘스트 완료 처리 중 오류 발생");
  }
};


  return (
    <div className="h-screen w-screen relative bg-[#000000] p-10 overflow-hidden">
      {/* 모서리 장식 */}
      <img src="/nasa.png" className="absolute top-3 left-3 w-6 h-6 z-20" alt="screw" />
      <img src="/nasa.png" className="absolute top-3 right-3 w-6 h-6 z-20" alt="screw" />
      <img src="/nasa.png" className="absolute bottom-3 left-3 w-6 h-6 z-20" alt="screw" />
      <img src="/nasa.png" className="absolute bottom-3 right-3 w-6 h-6 z-20" alt="screw" />

      <div className="h-full w-full bg-[#583c24] flex flex-col rounded-none relative z-0 border border-black">
        {/* 상단바 */}
        <div className="sticky top-0 bg-[#583c24] z-10 flex justify-between items-center px-6 py-4 border-b border-black">
          <div className="flex items-center gap-3">
            <Image src="/quest.png" alt="Quest Logo" width={72} height={30} priority />
            <span className="text-white font-bold text-lg">마이페이지</span>
          </div>
          <div className="text-white flex items-center gap-4 font-semibold">
            <span>Lv.{level}</span>
            <span className="flex items-center gap-1"><User size={16} />{username}</span>
            <span className="flex items-center gap-1"><svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#FFD600"/></svg>{money} G</span>
          </div>
        </div>

        {/* 본문 스크롤 영역 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* 내가 올린 퀘스트 */}
          <div>
            <h2 className="text-lg text-white font-bold mb-3">내가 올린 퀘스트</h2>
            {myQuests.length === 0 ? (
              <div className="text-gray-200">아직 등록한 퀘스트가 없습니다.</div>
            ) : (
              <ul className="space-y-4">
                {myQuests.map((q) => (
                  <li key={q.id} className="bg-white rounded-md shadow border border-black px-4 py-3 flex flex-col">
                    <span className="text-base font-semibold text-black ">{q.quest}</span>
                    <span className="text-xs text-gray-500 mb-2">보상: {q.reward} / 경험치: {q.exp}</span>
                    {q.angel ? (
                      <div className="flex gap-3 items-center">
                        <span className="text-indigo-500 text-sm font-semibold">수락자: {q.angel}</span>
                        <button
                        className="ml-2 text-xs text-white bg-gray-400 hover:bg-gray-500 px-2 py-1 rounded"
                        onClick={() => handleComplete(q)}
                        >
                        퀘스트 완료
                        </button>
                    </div>
                    ) : (
                      <span className="text-gray-400 text-sm">수락 대기 중</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* 내가 수락한 퀘스트 */}
          <div>
            <h2 className="text-lg text-white font-bold mb-3">내가 수락한 퀘스트</h2>
            {acceptedQuests.length === 0 ? (
              <div className="text-gray-200">수락한 퀘스트가 없습니다.</div>
            ) : (
              <ul className="space-y-4">
                {acceptedQuests.map((q) => (
                  <li key={q.id} className="bg-white rounded-md shadow border border-black px-4 py-3 flex flex-col">
                    <span className="text-base font-semibold text-black">{q.quest}</span>
                    <span className="text-xs text-gray-500 mb-2">보상: {q.reward} / 경험치: {q.exp}</span>
                    <span className="text-gray-500 text-xs">요청자: {q.nickname}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        {/* 로그아웃 버튼: 하단 오른쪽에 작게 */}
        <button
          onClick={handleLogout}
          className="absolute bottom-5 right-6 text-xs text-white px-3 py-1 rounded bg-red-500 hover:bg-red-600 shadow flex items-center gap-1"
        >
          <LogOut size={14} /> 로그아웃
        </button>
      </div>
    </div>
  );
}
