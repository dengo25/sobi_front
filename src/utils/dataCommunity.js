import noticeImg1 from "../assets/images/img-notice-1.png";
import noticeImg2 from "../assets/images/img-notice-2.png";
import noticeImg3 from "../assets/images/img-notice-3.png";

export const notices = [
  {
    count: 13,
    noticeNo: 10,
    noticeCreateDate: "2024-07-20T10:30:00",
    noticeTitle: "SOBI 서비스 업데이트 안내",
    noticeContent: "<p>새로운 기능이 추가되었습니다. 많은 이용 바랍니다.</p>",
    imageUrls: [noticeImg1],
    memberId: "admin",
  },
  {
    count: 13,
    noticeNo: 9,
    noticeCreateDate: "2024-07-19T15:20:00",
    noticeTitle: "정기 점검 안내",
    noticeContent: `<p>서버 정기 점검이 예정되어 있습니다.</p>`,
    imageUrls: [noticeImg2],
    memberId: "admin",
  },
  {
    count: 13,
    noticeNo: 8,
    noticeCreateDate: "2024-07-18T09:15:00",
    noticeTitle: "이벤트 당첨자 발표",
    noticeContent: "<p>7월 이벤트 당첨자를 발표합니다.</p>",
    imageUrls: [noticeImg3],
    memberId: "admin",
  },
  {
    count: 3,
    noticeNo: 7,
    noticeCreateDate: "2025-07-07 21:19:08.734115",
    noticeTitle: "SOBI 그랜드 오픈 이벤트!",
    noticeContent:
      "서비스 출시를 기념하여 다양한 혜택을 준비했습니다. 지금 참여하세요!",
    memberId: "admin",
  },
  {
    count: 3,
    noticeNo: 6,
    noticeCreateDate: "2025-07-07 21:19:08.734115",
    noticeTitle: "SOBI를 이롭게 후기를 이롭게.",
    noticeContent:
      "후기 한 줄이 SOBI를 더 나은 플랫폼으로 만듭니다. 당신의 경험을 공유해주세요.",
    memberId: "admin",
  },
  {
    count: 600,
    noticeNo: 5,
    noticeCreateDate: "2025-07-08 09:00:00.000000",
    noticeTitle: "SOBI 베타 기념 회원가입 이벤트!",
    noticeContent:
      "베타 기간 동안 가입만 해도 1,000포인트를 드립니다. 서둘러 참여하세요!",
    memberId: "admin",
  },
  {
    count: 20,
    noticeNo: 4,
    noticeCreateDate: "2025-07-12 12:00:00.000000",
    noticeTitle: "여름맞이 후기 공모전 개최!",
    noticeContent:
      "여름 상품 사용 후기를 남기고, 푸짐한 경품의 주인공이 되어보세요.",
    memberId: "admin",
  },
  {
    count: 1000,
    noticeNo: 3,
    noticeCreateDate: "2025-07-14 18:45:30.654321",
    noticeTitle: "우수 후기 선정자 상품권 증정 안내",
    noticeContent: "최고의 후기를 남겨주신 10분께 모바일 상품권을 드립니다.",
    memberId: "admin",
  },
  {
    count: 99,
    noticeNo: 2,
    noticeCreateDate: "2025-07-17 09:30:00.000000",
    noticeTitle: "후기 작성 TIP 가이드북 무료 배포",
    noticeContent:
      "효과적인 후기 작성법을 담은 가이드북 PDF를 무료로 제공합니다.",
    memberId: "admin",
  },
  {
    count: 10,
    noticeNo: 1,
    noticeCreateDate: "2025-07-18 13:05:45.000000",
    noticeTitle: "SOBI 서비스 점검 안내 (07/20)",
    noticeContent:
      "07월 20일 오전 02:00~04:00 서비스 점검이 진행됩니다. 이용에 참고 부탁드립니다.",
    memberId: "admin",
  },
];

export const faqs = [
  {
    faqNo: 1,
    faqQuestion: "후기글은 어디에서 작성하나요?",
    faqAnswer:
      "후기는 회원가입을 해야 작성 가능하며, 상단 메뉴에 '후기' 메뉴를 클릭한뒤 '후기작성' 이라는 버튼을 클릭해야 작성 가능합니다.",
    memberId: "admin",
  },
  {
    faqNo: 2,
    faqQuestion: "신고는 어디에서 하나요?",
    faqAnswer:
      "신고는 현재 작성된 후기글에서만 가능하며, 해당하는 글의 하단부에 '신고하기'버튼을 클릭하면 가능합니다.",
    memberId: "admin",
  },
  {
    faqNo: 3,
    faqQuestion: "이벤트에 참여하고 싶은데 어디서 하나요?",
    faqAnswer:
      "SOBI의 모든 이벤트는 공지사항을 통해 개시되며, 해당 이벤트 게시글을 확인 후 참여하시면 됩니다.",
    memberId: "admin",
  },
  {
    faqNo: 4,
    faqQuestion: "작성한 후기를 수정하고 싶어요. 어떻게 하나요?",
    faqAnswer:
      "작성한 후기는 '내 후기' 메뉴에서 수정하고자 하는 글의 우측 상단에 있는 '수정' 버튼을 클릭 후 변경사항을 저장하면 됩니다.",
    memberId: "admin",
  },
  {
    faqNo: 5,
    faqQuestion: "후기를 삭제하려면 어떻게 하나요?",
    faqAnswer:
      "후기를 삭제하려면 '내 후기' 메뉴에서 삭제할 글의 우측 상단에 있는 '삭제' 버튼을 클릭하시면 즉시 삭제됩니다.",
    memberId: "admin",
  },
  {
    faqNo: 6,
    faqQuestion: "비밀번호를 잊어버렸을 때 어떻게 하나요?",
    faqAnswer:
      "로그인 페이지에서 '비밀번호 찾기'를 클릭하고, 가입 시 등록한 이메일을 입력하시면 비밀번호 재설정 링크가 전송됩니다.",
    memberId: "admin",
  },
  {
    faqNo: 7,
    faqQuestion: "후기에 이미지 첨부는 어떻게 하나요?",
    faqAnswer:
      "후기 작성 화면에서 '이미지 첨부' 영역을 클릭해 컴퓨터 또는 모바일에서 원하는 이미지를 선택하시면 됩니다.",
    memberId: "admin",
  },
  {
    faqNo: 8,
    faqQuestion: "비회원도 후기를 볼 수 있나요?",
    faqAnswer:
      "네, SOBI에 가입하지 않아도 모든 후기글은 자유롭게 조회 가능합니다.",
    memberId: "admin",
  },
  {
    faqNo: 9,
    faqQuestion: "이용 중 문제가 발생했어요. 어디에 문의하나요?",
    faqAnswer:
      "하단 '고객센터' 메뉴를 통해 1:1 문의를 남겨주시면 빠르게 답변 드리겠습니다.",
    memberId: "admin",
  },
  {
    faqNo: 10,
    faqQuestion: "회원 탈퇴는 어떻게 하나요?",
    faqAnswer:
      "로그인 후 마이페이지' 페이지 좌측 하단에 '회원 탈퇴' 버튼을 클릭하면 탈퇴 신청이 완료됩니다.",
    memberId: "admin",
  },
];

export const mainConfig = {
  title: "SOBI 메인",
  //   bannerImage: "/assets/banner.jpg",
  featuredNotices: [1, 3], // noticeNo 기준
  featuredFaqs: [1, 2], // faqNo 기준
};

export function getContent(type) {
  switch (type) {
    case "notice":
      return notices;
    case "faq":
      return faqs;
    case "main":
      return mainConfig;
    default:
      return [];
  }
}
