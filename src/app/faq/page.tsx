"use client";

export default function FAQPage() {
    const faqs = [
    {
      q: "1. 이 서비스는 어떤 원리로 작동하나요?",
      a: "도움을 요청하거나 제공하면, 인게임 머니로 보상하거나 받을 수 있는 품앗이 기반 구조입니다.",
    },
    {
      q: "2. 인게임 머니는 유료인가요?",
      a: "아닙니다! 서비스 등록 후 정기적으로 지급되며, 무료 시스템을 구축하여 부담없는 도움을 목표로 합니다.",
    },
    {
      q: "3. 도와주려고 하는 사람이 없으면 어떡하나요?",
      a: "도움을 주는 사람에게 보상이 가는 시스템을 만들어 서비스 활성화를 촉진합니다.",
    },
    {
      q: "4. 게임은 정확히 어떤 시스템인가요?",
      a: "동기부여 시스템! 다양한 도전 과제, 랭킹, 캐릭터 성장, 실물 보상 등으로 보람을 느끼게 합니다.",
    },
    {
      q: "5. 게임머니는 어떻게 사용이 가능한가요?",
      a: "게임머니로 도움을 요청할 때 결제하거나, 꾸미기·실물 보상 등 다양한 용도로 사용됩니다.",
    },
    {
      q: "6. 저를 도와줄 사람을 어떻게 신뢰하나요?",
      a: "뱃지, 평가, 활동 내역 등으로 신뢰도를 쌓을 수 있도록 설계되어 있습니다.",
    },
    {
      q: "7. 타 플랫폼과의 차이점이 뭔가요?",
      a: "현금 거래 없이 실질적 도움에 집중한 품앗이 구조가 가장 큰 차별점입니다.",
    },
  ];
  return (
    <div className="h-screen w-screen relative bg-black p-10 overflow-hidden">
      {/* 모서리 장식 */}
      <img src="/nasa.png" className="absolute top-3 left-3 w-6 h-6 z-20" alt="screw" />
      <img src="/nasa.png" className="absolute top-3 right-3 w-6 h-6 z-20" alt="screw" />
      <img src="/nasa.png" className="absolute bottom-3 left-3 w-6 h-6 z-20" alt="screw" />
      <img src="/nasa.png" className="absolute bottom-3 right-3 w-6 h-6 z-20" alt="screw" />

      {/* 프레임 + FAQ 영역 */}
      <div className="h-full w-full bg-[#583c24] flex flex-col relative z-0 border border-black p-10 items-center overflow-auto">
        <h1 className="text-3xl font-bold text-white text-center mb-10">FAQ</h1>
        {/* FAQ 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white/90 rounded-xl shadow border border-black p-6 flex flex-col h-full"
            >
              <h2 className="font-bold text-lg text-[#583c24] mb-2">{faq.q}</h2>
              <p className="text-gray-700 text-base">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
