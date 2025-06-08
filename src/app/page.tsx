"use client";

import { useEffect, useState } from "react";
import { Coins, HelpCircle, LogOut, Plus, Search, Send, User } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Quest } from "./type";

export default function HomePage() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [username, setUsername] = useState("");
  const [money, setMoney] = useState("0");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [newFeedback, setNewFeedback] = useState<string>("");
  const [newQuestTitle, setNewQuestTitle] = useState("");
  const [newQuestContent, setNewQuestContent] = useState("");
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState<Quest | null>(null);
  const [reward, setReward] = useState("0");
  const [exp, setExp] = useState("10");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFeedbacknow, setIsFeedbacknow] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("username");
    if (!stored) {
      router.push("/login");
    } else {
      setUsername(stored);
      fetchQuests();
      fetchUserInfo(stored).then(setMoney);
      const check = () => setIsMobile(window.innerWidth < 768);
      check();
    }
  }, []);

  const fetchQuests = async () => {
    setIsLoading(true);
    const addrScript = "https://script.google.com/macros/s/AKfycbwJMxHtipPghnlaYOMtPG0dQ1gXaurTdZzGQMnHOa17OZJhyp3cHgN2vNLFPwDpFvtV8Q/exec";
    const query = new URLSearchParams({ action: "read", table: "quests" });

    try {
      const res = await fetch(`${addrScript}?${query}`, { method: "GET" });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setQuests(json.data as Quest[]);
      }
    } catch (err) {
      console.error("퀘스트 불러오기 중 오류 발생:", err);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchUserInfo = async (nickname: string) => {
    const addrScript = "https://script.google.com/macros/s/AKfycbwJMxHtipPghnlaYOMtPG0dQ1gXaurTdZzGQMnHOa17OZJhyp3cHgN2vNLFPwDpFvtV8Q/exec";
    const query = new URLSearchParams({
      action: "read",
      table: "info",
  });

  try {
    const res = await fetch(`${addrScript}?${query}`, { method: "GET" });
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      const user = json.data.find((u: any) => u.nickname === nickname);
      return user?.money || "0";
    }
  } catch (e) {
    console.error("유저 정보 불러오기 실패:", e);
  }
  return "0";
};


  const handleAccept = async (id: string) => {
  // 이미 angel이 있으면 동작 X
  const quest = quests.find(q => q.id === id);
  if (!quest || quest.angel) {
    alert("이미 다른 사람이 수락한 퀘스트입니다.");
    return;
  }

  // 구글 Apps Script에 angel 업데이트 요청
  const addrScript = "https://script.google.com/macros/s/AKfycbwJMxHtipPghnlaYOMtPG0dQ1gXaurTdZzGQMnHOa17OZJhyp3cHgN2vNLFPwDpFvtV8Q/exec";
  const query = new URLSearchParams({
    action: "update",
    table: "quests",
    id,
    data: JSON.stringify({ angel: username })
  });

  try {
    const res = await fetch(`${addrScript}?${query}`, { method: "GET" });
    const json = await res.json();
    if (json.success) {
      setQuests(prev => prev.map(q => q.id === id ? { ...q, angel: username } : q));
    } else {
      alert("수락 실패: " + (json.error || ""));
    }
  } catch (e) {
    alert("수락 중 오류 발생");
  }
};


  const handleLogout = () => {
    localStorage.removeItem("username");
    alert("로그아웃되었습니다.");
    router.push("/login");
  };


  const handleCreate = async () => {
    if (!newQuestTitle.trim()) return;

    const data: Quest = {
      id: String(Date.now()),
      quest: newQuestTitle,
      description: newQuestContent,
      nickname: username,
      reward,
      exp,
      angel: null
    };

    const addrScript = "https://script.google.com/macros/s/AKfycbwJMxHtipPghnlaYOMtPG0dQ1gXaurTdZzGQMnHOa17OZJhyp3cHgN2vNLFPwDpFvtV8Q/exec";
    const query = new URLSearchParams({ action: "insert", table: "quests", data: JSON.stringify(data) });

    setIsSubmitting(true);
    try {
      const res = await fetch(`${addrScript}?${query}`, { method: "GET" });
      const json = await res.json();
      if (json.success) {
        setQuests(prev => [...prev, data]);
        setNewQuestTitle(""); setNewQuestContent(""); setReward("0"); setExp("10");
        setShowCreateModal(false);
      }
    } catch (e) {
      alert("에러 발생");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingQuest) return;

    const addrScript = "https://script.google.com/macros/s/AKfycbwJMxHtipPghnlaYOMtPG0dQ1gXaurTdZzGQMnHOa17OZJhyp3cHgN2vNLFPwDpFvtV8Q/exec";

    const query = new URLSearchParams({
      action: "update",
      table: "quests",
      id: editingQuest.id,
      data: JSON.stringify({
        quest: editingQuest.quest,
        description: editingQuest.description,
        reward: editingQuest.reward,
        exp: editingQuest.exp,
      })
    });

    try {
      const res = await fetch(`${addrScript}?${query}`, { method: "GET" });
      const json = await res.json();
      if (json.success) {
        setQuests(prev =>
          prev.map(q => (q.id === editingQuest.id ? editingQuest : q))
        );
        setShowEditModal(false);
        setEditingQuest(null);
      } else {
        alert("수정 실패");
      }
    } catch (e) {
      alert("수정 중 오류 발생");
    }
  };
  
  const handleFeedback = async () => {
    if (!newFeedback.trim()) return;

    const data = {
      username: username,
      feedback: newFeedback
    };

    const addrScript = "https://script.google.com/macros/s/AKfycbwJMxHtipPghnlaYOMtPG0dQ1gXaurTdZzGQMnHOa17OZJhyp3cHgN2vNLFPwDpFvtV8Q/exec";
    const query = new URLSearchParams({
      action: "insert",
      table: "tab_final",
      data: JSON.stringify(data)
    });

    setIsFeedbacknow(true);
    try {
      const res = await fetch(`${addrScript}?${query}`, { method: "GET" });
      const json = await res.json();
      if (json.success) {
        alert("피드백에 감사드립니다!!");
        setShowFeedbackModal(false);
        setNewFeedback("");
      } else {
        alert("전송 실패: " + json.error);
      }
    } catch (e) {
      alert("전송 중 오류 발생");
    } finally {
      setIsFeedbacknow(false);
    }
  };

  // ------ 여기부터 렌더링 ------
  if (isMobile) {
    return (
    <div className="h-screen w-screen relative bg-[#000000] p-10 overflow-hidden">
      {/* 모서리 이미지 */}
      <img src="/nasa.png" className="absolute top-3 left-3 w-6 h-6 z-20" alt="screw" />
      <img src="/nasa.png" className="absolute top-3 right-3 w-6 h-6 z-20" alt="screw" />
      <img src="/nasa.png" className="absolute bottom-3 left-3 w-6 h-6 z-20" alt="screw" />
      <img src="/nasa.png" className="absolute bottom-3 right-3 w-6 h-6 z-20" alt="screw" />

      {/* 전체 테두리 영역 */}
      <div className="h-full w-full bg-[#583c24] flex flex-col rounded-none relative z-0 border border-black">
        {/* ----- 상단바 (항상 고정) ----- */}
        <div className="sticky top-0 bg-[#583c24] z-10 flex flex-col border-b border-black px-3 py-2 space-y-1">
    {/* 1번째 줄: 크레딧, 관리자 피드백 */}
    <div className="flex justify-between items-center w-full">
      <div className="flex items-center text-white font-semibold text-xs">
        <Coins size={16} color="yellow" className="ml-5"/>
        <span className="ml-10">현재 크레딧: {money} G</span>
      </div>
      <button
        onClick={() => setShowFeedbackModal(true)}
        className="bg-amber-300 border border-amber-200 rounded-full px-2 py-1 shadow hover:bg-amber-400 flex items-center space-x-1"
      >
        <Send size={14} color="black" />
        <span className="text-xs text-black">관리자에게 하고 싶은 말</span>
      </button>
    </div>
    {/* 2번째 줄: FAQ, 마이페이지, 로그아웃 */}
    <div className="flex justify-end items-center w-full space-x-2 pt-1">
      <Image src="/quest.png" alt="Quest Logo" width={36} height={15} className="mr-5" priority />
      <button
        onClick={() => router.push("/faq")}
        className="bg-white border border-gray-300 rounded-full px-2 py-1 shadow hover:bg-gray-100 flex items-center space-x-1"
      >
        <HelpCircle size={14} color="black" />
        <span className="text-xs text-black">FAQ</span>
      </button>
      <button
        onClick={() => router.push("/mypage")}
        className="bg-white border border-gray-300 rounded-full px-2 py-1 shadow hover:bg-gray-100 flex items-center space-x-1"
      >
        <User size={14} color="black" />
        <span className="text-xs text-black">마이페이지</span>
      </button>
      <button
        onClick={handleLogout}
        className="bg-white border border-gray-300 rounded-full px-2 py-1 shadow hover:bg-gray-100 flex items-center space-x-1"
      >
        <LogOut size={14} color="black"/>
        <span className="text-xs text-black">로그아웃</span>
      </button>
    </div>
  </div>

        {/* ----- 게시글 리스트만 스크롤 ----- */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading ? (
            <p className="text-white text-center pt-8">퀘스트 목록을 불러오는 중입니다...</p>
          ) : (
            <ul className="space-y-4">
              {quests.map((q) => (
                <li
                  key={q.id}
                  className="bg-white p-4 rounded shadow flex justify-between items-center cursor-pointer"
                  onClick={() => setShowDetailModal(q)}
                >
                  <div>
                    <p className="text-lg text-black font-semibold">{q.quest}</p>
                    <p className="text-sm text-gray-500">요청자: {q.nickname}</p>
                  </div>
                  {/* 상태 표시 */}
                  {q.nickname === username ? (
                    <span className="text-gray-400 text-sm">내 퀘스트</span>
                  ) : q.angel ? (
                    q.angel === username ? (
                      <span className="text-indigo-500 text-sm">내가 수락</span>
                    ) : (
                      <span className="text-green-500 text-sm">이미 수락됨</span>
                    )
                  ) : (
                    <span className="text-blue-500 text-sm">자세히 보기</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* 플로팅 생성 버튼 */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-14 right-14 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full p-4 shadow-lg z-50"
      >
        <Plus size={24} />
      </button>

      {/* ----- 이하 모달 코드 동일 ----- */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-opacity-30 backdrop-blur flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-md space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-black">퀘스트 요청</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-black text-xl"
              >
                ✕
              </button>
            </div>
            <input
              type="text"
              value={newQuestTitle}
              onChange={(e) => setNewQuestTitle(e.target.value)}
              placeholder="퀘스트 제목"
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700"
            />
            <textarea
              value={newQuestContent}
              onChange={(e) => setNewQuestContent(e.target.value)}
              placeholder="자세한 설명 (선택)"
              rows={5}
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700"
            />
            <input
              type="number"
              value={reward}
              onChange={(e) => setReward(e.target.value)}
              placeholder="보상 금액"
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700"
            />
            <input
              type="number"
              value={exp}
              onChange={(e) => setExp(e.target.value)}
              placeholder="경험치"
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700"
            />
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-sm text-gray-500 hover:underline"
              >
                취소
              </button>
              <button
                onClick={handleCreate}
                disabled={isSubmitting}
                className={`text-sm text-white px-4 py-2 rounded ${
                  isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-gray-600 hover:bg-gray-700"
                }`}
              >
                {isSubmitting ? "요청 중..." : "요청"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/*관리자에게 피드백 모달*/}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 bg-opacity-30 backdrop-blur flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-md space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-black">관리자에게 피드백</h2>
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="text-gray-500 hover:text-black text-xl"
              >
                ✕
              </button>
            </div>
            <textarea
              value={newFeedback}
              onChange={(e) => setNewFeedback(e.target.value)}
              placeholder="하고 싶은 말이나 건의사항을 입력하세요"
              rows={5}
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700"
            />
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="text-sm text-gray-500 hover:underline"
              >
                취소
              </button>
              <button
                onClick={handleFeedback}
                disabled={isFeedbacknow}
                className={`text-sm text-white px-4 py-2 rounded ${
                  isFeedbacknow ? "bg-gray-400 cursor-not-allowed" : "bg-gray-600 hover:bg-gray-700"
                }`}
              >
                {isFeedbacknow ? "전송 중..." : "전송"}
              </button>
            </div>
          </div>
        </div>
      )}


      {/*퀘스트 디테일 보는 모달*/}
      {showDetailModal && (
        <div className="fixed inset-0 z-50 bg-opacity-50 backdrop-blur flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-md space-y-4">
            <h1 className="text-xl font-bold text-black">{showDetailModal.quest}</h1>
            <h2 className="text-base font-bold text-gray-800">{showDetailModal.description}</h2>
            <h2 className="text-xl font-bold text-gray-500">{showDetailModal.angel}</h2>
            {/* ... */}
            <div className="flex justify-end space-x-2 pt-4">
              <button
                onClick={() => setShowDetailModal(null)}
                className="text-sm text-gray-500 hover:underline"
              >
                닫기
              </button>
              {showDetailModal.nickname === username ? (
                <button onClick={() => { setEditingQuest(showDetailModal); setShowEditModal(true); }}
                  className="text-sm text-white bg-gray-400 hover:bg-gray-500 px-4 py-2 rounded"
                >
                  수정하기
                </button>
              ) : showDetailModal.angel ? (
                <button
                  disabled
                  className="text-sm text-white bg-gray-200 cursor-not-allowed px-4 py-2 rounded"
                >
                  이미 수락됨
                </button>
              ) : (
                <button
                  onClick={() => handleAccept(showDetailModal.id)}
                  className="text-sm text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
                >
                  수락하기
                </button>
              )}
            </div>
          </div>
        </div>
      )}


      {/*퀘스트 수정 모달*/}
      {showEditModal && editingQuest && (
        <div className="fixed inset-0 z-50 bg-opacity-30 backdrop-blur flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-md space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-black">퀘스트 수정</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-black text-xl"
              >
                ✕
              </button>
            </div>
            <input
              type="text"
              value={editingQuest.quest}
              onChange={(e) => setEditingQuest({ ...editingQuest, quest: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700"
            />
            <textarea
              value={editingQuest.description}
              onChange={(e) => setEditingQuest({ ...editingQuest, description: e.target.value })}
              rows={5}
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700"
            />
            <input
              type="number"
              value={editingQuest.reward}
              onChange={(e) => setEditingQuest({ ...editingQuest, reward: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700"
            />
            <input
              type="number"
              value={editingQuest.exp}
              onChange={(e) => setEditingQuest({ ...editingQuest, exp: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700"
            />
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowEditModal(false)}
                className="text-sm text-gray-500 hover:underline"
              >
                취소
              </button>
              <button
                onClick={handleUpdate}
                className="text-sm text-white px-4 py-2 bg-gray-400 hover:bg-gray-500 rounded"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
  }

  return (
    <div className="h-screen w-screen relative bg-[#000000] p-10 overflow-hidden">
      {/* 모서리 이미지 */}
      <img src="/nasa.png" className="absolute top-3 left-3 w-6 h-6 z-20" alt="screw" />
      <img src="/nasa.png" className="absolute top-3 right-3 w-6 h-6 z-20" alt="screw" />
      <img src="/nasa.png" className="absolute bottom-3 left-3 w-6 h-6 z-20" alt="screw" />
      <img src="/nasa.png" className="absolute bottom-3 right-3 w-6 h-6 z-20" alt="screw" />

      {/* 전체 테두리 영역 */}
      <div className="h-full w-full bg-[#583c24] flex flex-col rounded-none relative z-0 border border-black">
        {/* ----- 상단바 (항상 고정) ----- */}
        <div className="sticky top-0 bg-[#583c24] z-10 flex justify-between items-center px-6 py-4 border-b border-black">
          <Image src="/quest.png" alt="Quest Logo" width={72} height={30} priority />

          <div className="text-white font-semibold text-lg flex justify-"><Coins size={18} color="yellow"/>현재 크레딧: {money} G</div>

          <div className="flex space-x-3">
            <button
              onClick={() => setShowFeedbackModal(true)}
              className="bg-amber-300 border border-amber-200 rounded-full px-3 py-2 shadow hover:bg-amber-400 flex items-center space-x-1"
            >
              <Send size={18} color="black" />
              <span className="text-sm text-black">관리자에게 하고 싶은 말</span>
            </button>
            <button
              onClick={() => router.push("/faq")}
              className="bg-white border border-gray-300 rounded-full px-3 py-2 shadow hover:bg-gray-100 flex items-center space-x-1"
            >
              <HelpCircle  size={18} color="black" />
              <span className="text-sm text-black">FAQ</span>
            </button>
            <button
              onClick={() => alert("아직 구현 중입니다!")}
              className="bg-white border border-gray-300 rounded-full px-3 py-2 shadow hover:bg-gray-100 flex items-center space-x-1"
            >
              <Search size={18} color="black" />
              <span className="text-sm text-black">검색</span>
            </button>
            <button
              onClick={() => router.push("/mypage")}
              className="bg-white border border-gray-300 rounded-full px-3 py-2 shadow hover:bg-gray-100 flex items-center space-x-1"
            >
              <User size={18} color="black" />
              <span className="text-sm text-black">마이페이지</span>
            </button>
            <button
              onClick={handleLogout}
              className="bg-white border border-gray-300 rounded-full px-3 py-2 shadow hover:bg-gray-100 flex items-center space-x-1"
            >
              <LogOut size={18} color="black"/>
              <span className="text-sm text-black">로그아웃</span>
            </button>
          </div>
        </div>

        {/* ----- 게시글 리스트만 스크롤 ----- */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading ? (
            <p className="text-white text-center pt-8">퀘스트 목록을 불러오는 중입니다...</p>
          ) : (
            <ul className="space-y-4">
              {quests.map((q) => (
                <li
                  key={q.id}
                  className="bg-white p-4 rounded shadow flex justify-between items-center cursor-pointer"
                  onClick={() => setShowDetailModal(q)}
                >
                  <div>
                    <p className="text-lg text-black font-semibold">{q.quest}</p>
                    <p className="text-sm text-gray-500">요청자: {q.nickname}</p>
                  </div>
                  {/* 상태 표시 */}
                  {q.nickname === username ? (
                    <span className="text-gray-400 text-sm">내 퀘스트</span>
                  ) : q.angel ? (
                    q.angel === username ? (
                      <span className="text-indigo-500 text-sm">내가 수락</span>
                    ) : (
                      <span className="text-green-500 text-sm">이미 수락됨</span>
                    )
                  ) : (
                    <span className="text-blue-500 text-sm">자세히 보기</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* 플로팅 생성 버튼 */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-14 right-14 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full p-4 shadow-lg z-50"
      >
        <Plus size={24} />
      </button>

      {/* ----- 이하 모달 코드 동일 ----- */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-opacity-30 backdrop-blur flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-md space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-black">퀘스트 요청</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-black text-xl"
              >
                ✕
              </button>
            </div>
            <input
              type="text"
              value={newQuestTitle}
              onChange={(e) => setNewQuestTitle(e.target.value)}
              placeholder="퀘스트 제목"
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700"
            />
            <textarea
              value={newQuestContent}
              onChange={(e) => setNewQuestContent(e.target.value)}
              placeholder="자세한 설명 (선택)"
              rows={5}
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700"
            />
            <input
              type="number"
              value={reward}
              onChange={(e) => setReward(e.target.value)}
              placeholder="보상 금액"
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700"
            />
            <input
              type="number"
              value={exp}
              onChange={(e) => setExp(e.target.value)}
              placeholder="경험치"
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700"
            />
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-sm text-gray-500 hover:underline"
              >
                취소
              </button>
              <button
                onClick={handleCreate}
                disabled={isSubmitting}
                className={`text-sm text-white px-4 py-2 rounded ${
                  isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-gray-600 hover:bg-gray-700"
                }`}
              >
                {isSubmitting ? "요청 중..." : "요청"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/*관리자에게 피드백 모달*/}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 bg-opacity-30 backdrop-blur flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-md space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-black">관리자에게 피드백</h2>
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="text-gray-500 hover:text-black text-xl"
              >
                ✕
              </button>
            </div>
            <textarea
              value={newFeedback}
              onChange={(e) => setNewFeedback(e.target.value)}
              placeholder="하고 싶은 말이나 건의사항을 입력하세요"
              rows={5}
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700"
            />
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="text-sm text-gray-500 hover:underline"
              >
                취소
              </button>
              <button
                onClick={handleFeedback}
                disabled={isFeedbacknow}
                className={`text-sm text-white px-4 py-2 rounded ${
                  isFeedbacknow ? "bg-gray-400 cursor-not-allowed" : "bg-gray-600 hover:bg-gray-700"
                }`}
              >
                {isFeedbacknow ? "전송 중..." : "전송"}
              </button>
            </div>
          </div>
        </div>
      )}


      {/*퀘스트 디테일 보는 모달*/}
      {showDetailModal && (
        <div className="fixed inset-0 z-50 bg-opacity-50 backdrop-blur flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-md space-y-4">
            <h1 className="text-xl font-bold text-black">{showDetailModal.quest}</h1>
            <h2 className="text-base font-bold text-gray-800">{showDetailModal.description}</h2>
            <h2 className="text-xl font-bold text-gray-500">{showDetailModal.angel}</h2>
            {/* ... */}
            <div className="flex justify-end space-x-2 pt-4">
              <button
                onClick={() => setShowDetailModal(null)}
                className="text-sm text-gray-500 hover:underline"
              >
                닫기
              </button>
              {showDetailModal.nickname === username ? (
                <button onClick={() => { setEditingQuest(showDetailModal); setShowEditModal(true); }}
                  className="text-sm text-white bg-gray-400 hover:bg-gray-500 px-4 py-2 rounded"
                >
                  수정하기
                </button>
              ) : showDetailModal.angel ? (
                <button
                  disabled
                  className="text-sm text-white bg-gray-200 cursor-not-allowed px-4 py-2 rounded"
                >
                  이미 수락됨
                </button>
              ) : (
                <button
                  onClick={() => handleAccept(showDetailModal.id)}
                  className="text-sm text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
                >
                  수락하기
                </button>
              )}
            </div>
          </div>
        </div>
      )}


      {/*퀘스트 수정 모달*/}
      {showEditModal && editingQuest && (
        <div className="fixed inset-0 z-50 bg-opacity-30 backdrop-blur flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-md space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-black">퀘스트 수정</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-black text-xl"
              >
                ✕
              </button>
            </div>
            <input
              type="text"
              value={editingQuest.quest}
              onChange={(e) => setEditingQuest({ ...editingQuest, quest: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700"
            />
            <textarea
              value={editingQuest.description}
              onChange={(e) => setEditingQuest({ ...editingQuest, description: e.target.value })}
              rows={5}
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700"
            />
            <input
              type="number"
              value={editingQuest.reward}
              onChange={(e) => setEditingQuest({ ...editingQuest, reward: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700"
            />
            <input
              type="number"
              value={editingQuest.exp}
              onChange={(e) => setEditingQuest({ ...editingQuest, exp: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700"
            />
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowEditModal(false)}
                className="text-sm text-gray-500 hover:underline"
              >
                취소
              </button>
              <button
                onClick={handleUpdate}
                className="text-sm text-white px-4 py-2 bg-gray-400 hover:bg-gray-500 rounded"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
