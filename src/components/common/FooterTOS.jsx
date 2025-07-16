"use client";

import { useState } from "react";
import { Typography, ThemeProvider } from "@mui/material";
import {
  Close as CloseIcon,
  Policy as PolicyIcon,
  Shield as ShieldIcon,
} from "@mui/icons-material";
import {
  sobiTheme,
  StyledDialog,
  HeaderSection,
  CloseButton,
  ContentSection,
  SectionDivider,
  HighlightBox,
} from "../../assets/styles/sobiThemeFooter";

const FooterTOS = ({ open, onClose }) => {
  return (
    <ThemeProvider theme={sobiTheme}>
      <StyledDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        {/* 헤더 */}
        <HeaderSection>
          <CloseButton onClick={onClose}>
            <CloseIcon />
          </CloseButton>

          <PolicyIcon sx={{ fontSize: 48, mb: 1, opacity: 0.9 }} />
          <Typography variant="h4" fontWeight={700}>
            서비스 이용약관
          </Typography>
        </HeaderSection>

        {/* 컨텐츠 */}
        <ContentSection>
          {/* 서비스 이용약관 */}
          <Typography variant="h3">✅ SOBI 서비스 이용약관</Typography>

          <Typography variant="h4">제1조 (목적)</Typography>
          <Typography variant="body1">
            이 약관은 SOBI(이하 "회사")가 제공하는 후기 기반 큐레이션
            서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자의 권리, 의무
            및 책임사항을 규정함을 목적으로 합니다.
          </Typography>

          <Typography variant="h4">제2조 (정의)</Typography>
          <Typography variant="body1">
            1. "서비스"란 회사가 제공하는 후기 공유, 추천, 검색 기능 및 이에
            부수하는 모든 서비스를 의미합니다.
          </Typography>
          <Typography variant="body1">
            2. "회원"이란 본 약관에 동의하고 회사가 제공하는 서비스를 이용하는
            자를 말합니다.
          </Typography>
          <Typography variant="body1">
            3. "콘텐츠"란 회원이 SOBI 플랫폼에 등록한 후기, 이미지, 댓글 등
            일체의 게시물을 의미합니다.
          </Typography>

          <Typography variant="h4">제3조 (약관의 게시 및 개정)</Typography>
          <Typography variant="body1">
            1. 회사는 본 약관을 서비스 초기 화면 또는 별도의 링크 화면에
            게시합니다.
          </Typography>
          <Typography variant="body1">
            2. 회사는 관련 법령을 위배하지 않는 범위에서 본 약관을 개정할 수
            있으며, 개정 시 사전 공지를 통해 회원에게 고지합니다.
          </Typography>

          <Typography variant="h4">제4조 (회원가입)</Typography>
          <Typography variant="body1">
            1. 회원가입은 이용자가 약관에 동의한 후 회사가 정한 절차에 따라
            신청함으로써 성립됩니다.
          </Typography>
          <Typography variant="body1">
            2. 회사는 다음과 같은 경우 회원가입을 제한하거나 취소할 수 있습니다.
          </Typography>
          <ul>
            <li>타인 명의로 가입한 경우</li>
            <li>허위 정보를 입력한 경우</li>
            <li>서비스 운영을 방해할 우려가 있는 경우</li>
          </ul>

          <Typography variant="h4">제5조 (서비스의 제공 및 변경)</Typography>
          <Typography variant="body1">
            1. 회사는 다음과 같은 서비스를 제공합니다:
          </Typography>
          <ul>
            <li>후기 등록, 수정, 삭제 기능</li>
            <li>카테고리/태그 기반 큐레이션 및 검색</li>
            <li>추천 알고리즘을 통한 맞춤형 후기 제공</li>
            <li>기타 회사가 정하는 서비스</li>
          </ul>
          <Typography variant="body1">
            2. 회사는 서비스 내용이나 기술적 사양을 변경할 수 있으며, 중요한
            변경 시 사전 공지합니다.
          </Typography>

          <Typography variant="h4">제6조 (회원의 의무)</Typography>
          <Typography variant="body1">
            1. 회원은 타인의 권리를 침해하거나 불법 콘텐츠를 등록해서는 안
            됩니다.
          </Typography>
          <Typography variant="body1">
            2. 회원은 회사의 사전 승인 없이 상업적 목적의 활동을 할 수 없습니다.
          </Typography>
          <Typography variant="body1">
            3. 회원은 본인의 계정 정보 보호에 대한 책임이 있으며, 이를 제3자에게
            공유해서는 안 됩니다.
          </Typography>

          <Typography variant="h4">제7조 (콘텐츠의 권리)</Typography>
          <Typography variant="body1">
            1. 회원이 작성한 후기 및 콘텐츠에 대한 저작권은 회원에게 있습니다.
          </Typography>
          <Typography variant="body1">
            2. 회사는 서비스 홍보, 콘텐츠 큐레이션 목적 범위 내에서 콘텐츠를
            사용할 수 있으며, 이에 동의하지 않을 경우 회원은 별도 요청을 통해
            콘텐츠 사용을 제한할 수 있습니다.
          </Typography>

          <Typography variant="h4">
            제8조 (계정 해지 및 서비스 이용 중지)
          </Typography>
          <Typography variant="body1">
            1. 회원은 언제든지 서비스 내 설정을 통해 탈퇴할 수 있습니다.
          </Typography>
          <Typography variant="body1">
            2. 회사는 다음의 경우 사전 통지 없이 회원 자격을 제한 또는 해지할 수
            있습니다:
          </Typography>
          <ul>
            <li>서비스 이용 규정을 위반한 경우</li>
            <li>불법행위 또는 부정 사용이 확인된 경우</li>
          </ul>

          <Typography variant="h4">제9조 (면책조항)</Typography>
          <Typography variant="body1">
            1. 회사는 회원이 서비스 이용 중 발생한 손해에 대해 고의 또는 중대한
            과실이 없는 한 책임을 지지 않습니다.
          </Typography>
          <Typography variant="body1">
            2. 회원 간 또는 회원과 제3자 간의 분쟁에 대해 회사는 개입하지
            않으며, 이에 대한 책임을 지지 않습니다.
          </Typography>

          <Typography variant="h4">제10조 (준거법 및 관할법원)</Typography>
          <Typography variant="body1">
            이 약관은 대한민국 법령에 따라 해석되며, 서비스 이용과 관련된 분쟁은
            서울중앙지방법원을 제1심 관할 법원으로 합니다.
          </Typography>

          <SectionDivider />
        </ContentSection>
      </StyledDialog>
    </ThemeProvider>
  );
};

export default FooterTOS;
