"use client";

import { useState } from "react";
import { Typography, ThemeProvider } from "@mui/material";
import {
  Close as CloseIcon,
  Security as SecurityIcon,
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

const FooterPP = ({ open, onClose }) => {
  return (
    <ThemeProvider theme={sobiTheme}>
      <StyledDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        {/* 헤더 */}
        <HeaderSection>
          <CloseButton onClick={onClose}>
            <CloseIcon />
          </CloseButton>

          <SecurityIcon sx={{ fontSize: 48, mb: 1, opacity: 0.9 }} />
          <Typography variant="h4" fontWeight={700}>
            개인정보 처리방침
          </Typography>
        </HeaderSection>

        {/* 컨텐츠 */}
        <ContentSection>
          <Typography variant="h3">🔒 개인정보 처리방침</Typography>

          <Typography variant="body1">
            SOBI(이하 "회사")는 이용자의 개인정보를 중요하게 생각하며,
            『개인정보 보호법』 등 관련 법령에 따라 아래와 같이 개인정보를
            안전하게 관리합니다.
          </Typography>

          <Typography variant="h4">1. 수집하는 개인정보 항목</Typography>
          <Typography variant="body1">
            <strong>회원가입 시:</strong> 이메일, 비밀번호, 닉네임
          </Typography>
          <Typography variant="body1">
            <strong>후기 작성 시:</strong> 이미지 파일, 위치 정보(선택 시)
          </Typography>
          <Typography variant="body1">
            <strong>서비스 이용 시:</strong> IP 주소, 쿠키, 접속 로그, 이용 기록
          </Typography>

          <Typography variant="h4">2. 개인정보의 수집 및 이용 목적</Typography>
          <ul>
            <li>회원 식별 및 서비스 제공</li>
            <li>후기 기반 큐레이션 알고리즘 개선</li>
            <li>고객 문의 대응 및 공지사항 전달</li>
            <li>통계 분석 및 서비스 개선</li>
          </ul>

          <Typography variant="h4">3. 개인정보 보유 및 이용 기간</Typography>
          <Typography variant="body1">
            회원 탈퇴 시까지 또는 수집 및 이용 목적 달성 시까지
          </Typography>
          <Typography variant="body1">
            단, 관계 법령에 따라 보관이 필요한 경우 해당 기간 동안 보관
          </Typography>

          <Typography variant="h4">4. 개인정보의 제3자 제공</Typography>
          <Typography variant="body1">
            회사는 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다.
            단, 다음의 경우는 예외로 합니다.
          </Typography>
          <ul>
            <li>이용자가 사전에 동의한 경우</li>
            <li>법령에 따라 제공이 요구되는 경우</li>
          </ul>

          <Typography variant="h4">5. 개인정보 처리 위탁</Typography>
          <Typography variant="body1">
            회사는 원활한 서비스 제공을 위해 다음과 같은 외부 업체에 위탁할 수
            있습니다.
          </Typography>
          <Typography variant="body1">
            (예: AWS – 데이터 저장, 이메일 발송 시스템 등)
          </Typography>

          <Typography variant="h4">6. 이용자의 권리 및 행사 방법</Typography>
          <Typography variant="body1">
            이용자는 언제든지 개인정보 열람, 정정, 삭제, 처리 정지를 요청할 수
            있습니다.
          </Typography>
          <Typography variant="body1">
            회원탈퇴는 서비스 내 설정 메뉴 또는 이메일을 통해 요청할 수
            있습니다.
          </Typography>

          <Typography variant="h4">7. 개인정보 보호를 위한 노력</Typography>
          <Typography variant="body1">
            회사는 개인정보 보호를 위해 암호화, 방화벽, 접근제어 등의
            기술적·관리적 보호조치를 시행합니다.
          </Typography>

          <SectionDivider />
        </ContentSection>
      </StyledDialog>
    </ThemeProvider>
  );
};

export default FooterPP;
