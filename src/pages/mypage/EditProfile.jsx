import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Typography,
  Avatar,
  Divider,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { updateMypage } from "../../service/member/ApiService";

const EditProfile = ({ open, onClose, userInfo, onUpdate }) => {
  const [formData, setFormData] = useState({
    memberName: "",
    memberEmail: "",
    memberGender: "",
    memberBirth: "",
    memberAddr: "",
    memberZip: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // userInfo가 변경될 때마다 폼 데이터 초기화
  useEffect(() => {
    if (userInfo) {
      setFormData({
        memberName: userInfo.memberName || "",
        memberEmail: userInfo.memberEmail || "",
        memberGender: userInfo.memberGender || "",
        memberBirth: userInfo.memberBirth || "",
        memberAddr: userInfo.memberAddr || "",
        memberZip: userInfo.memberZip || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [userInfo]);

  // 다이얼로그가 닫힐 때 상태 초기화
  useEffect(() => {
    if (!open) {
      setError("");
      if (userInfo) {
        setFormData({
          memberName: userInfo.memberName || "",
          memberEmail: userInfo.memberEmail || "",
          memberGender: userInfo.memberGender || "",
          memberBirth: userInfo.memberBirth || "",
          memberAddr: userInfo.memberAddr || "",
          memberZip: userInfo.memberZip || "",
          password: "",
          confirmPassword: "",
        });
      }
    }
  }, [open, userInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 에러 메시지 초기화
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.memberName.trim()) {
      setError("이름을 입력해주세요.");
      return false;
    }

    if (!formData.memberEmail.trim()) {
      setError("이메일을 입력해주세요.");
      return false;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.memberEmail)) {
      setError("올바른 이메일 형식을 입력해주세요.");
      return false;
    }

    // 생년월일 형식 검증
    if (formData.memberBirth && !/^\d{6}$/.test(formData.memberBirth)) {
      setError("생년월일은 6자리 숫자(YYMMDD)로 입력해주세요.");
      return false;
    }

    // 우편번호 형식 검증 (5자리 숫자)
    if (formData.memberZip && !/^\d{5}$/.test(formData.memberZip)) {
      setError("우편번호는 5자리 숫자로 입력해주세요.");
      return false;
    }

    // 비밀번호가 입력된 경우에만 검증
    if (formData.password) {
      if (formData.password.length < 4) {
        setError("비밀번호는 4자 이상이어야 합니다.");
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("비밀번호가 일치하지 않습니다.");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 수정할 데이터 준비
      const updateData = {
        memberName: formData.memberName,
        memberEmail: formData.memberEmail,
        memberGender: formData.memberGender,
        memberBirth: formData.memberBirth,
        memberAddr: formData.memberAddr,
        memberZip: formData.memberZip,
      };

      // 비밀번호가 입력된 경우에만 포함
      if (formData.password.trim()) {
        updateData.password = formData.password;
      }

      const response = await updateMypage(updateData);

      if (response) {
        // 부모 컴포넌트에 업데이트된 정보 전달 및 성공 메시지 표시
        onUpdate(response, "회원정보가 성공적으로 수정되었습니다!");

        // 바로 다이얼로그 닫기
        onClose();
      }
    } catch (err) {
      console.error("회원정보 수정 오류:", err);
      setError("회원정보 수정 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        },
      }}
    >
      <Box sx={{ position: "relative" }}>
        {/* 헤더 영역 */}
        <Box
          sx={{
            p: 4,
            pb: 2,
            textAlign: "center",
            borderBottom: "1px solid #f0f0f0",
            position: "relative",
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 16,
              top: 16,
              color: "#666",
              width: 32,
              height: 32,
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            ✕
          </IconButton>

          <Avatar
            sx={{
              width: 64,
              height: 64,
              mx: "auto",
              mb: 2,
              bgcolor: "#4ecdc4",
              fontSize: "24px",
              color: "white",
            }}
          >
            {userInfo?.memberName?.charAt(0).toUpperCase() || "U"}
          </Avatar>

          <Typography
            variant="h6"
            sx={{ fontWeight: 600, mb: 0.5, fontSize: "18px" }}
          >
            회원정보 수정
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: "14px" }}
          >
            {userInfo?.memberName || "사용자"}#{userInfo?.id || "N/A"}
          </Typography>
        </Box>

        {/* 폼 영역 */}
        <DialogContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" gap={3}>
              {error && (
                <Alert
                  severity="error"
                  sx={{
                    borderRadius: 2,
                    backgroundColor: "#ffebee",
                    border: "1px solid #ffcdd2",
                    fontSize: "14px",
                  }}
                >
                  {error}
                </Alert>
              )}

              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1, fontSize: "14px", fontWeight: "500" }}
                >
                  사용자 ID
                </Typography>
                <TextField
                  value={userInfo?.memberId || ""}
                  disabled
                  fullWidth
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      border: "1px solid rgb(255, 255, 255)",
                      fontSize: "14px",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                  }}
                  helperText="사용자 ID는 변경할 수 없습니다."
                />
              </Box>

              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1, fontSize: "14px", fontWeight: "500" }}
                >
                  이름 *
                </Typography>
                <TextField
                  name="memberName"
                  value={formData.memberName}
                  onChange={handleChange}
                  required
                  fullWidth
                  disabled={loading}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      border: "1px solid rgb(255, 255, 255)",
                      fontSize: "14px",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                  }}
                />
              </Box>

              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1, fontSize: "14px", fontWeight: "500" }}
                >
                  이메일 *
                </Typography>
                <TextField
                  name="memberEmail"
                  type="email"
                  value={formData.memberEmail}
                  onChange={handleChange}
                  required
                  fullWidth
                  disabled={loading}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      border: "1px solid rgb(255, 255, 255)",
                      fontSize: "14px",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                  }}
                />
              </Box>

              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1, fontSize: "14px", fontWeight: "500" }}
                >
                  성별
                </Typography>
                <FormControl fullWidth variant="outlined">
                  <Select
                    name="memberGender"
                    value={formData.memberGender}
                    onChange={handleChange}
                    disabled={loading}
                    displayEmpty
                    sx={{
                      borderRadius: 2,
                      fontSize: "14px",
                    }}
                  >
                    <MenuItem value="" sx={{ fontSize: "14px" }}>
                      선택
                    </MenuItem>
                    <MenuItem value="M" sx={{ fontSize: "14px" }}>
                      남성
                    </MenuItem>
                    <MenuItem value="F" sx={{ fontSize: "14px" }}>
                      여성
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1, fontSize: "14px", fontWeight: "500" }}
                >
                  생년월일
                </Typography>
                <TextField
                  name="memberBirth"
                  value={formData.memberBirth}
                  onChange={handleChange}
                  fullWidth
                  disabled={loading}
                  variant="outlined"
                  placeholder="YYMMDD (예: 901225)"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      border: "1px solid rgb(255, 255, 255)",
                      fontSize: "14px",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                  }}
                  helperText="6자리 숫자로 입력해주세요 (예: 901225)"
                />
              </Box>

              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1, fontSize: "14px", fontWeight: "500" }}
                >
                  우편번호
                </Typography>
                <TextField
                  name="memberZip"
                  value={formData.memberZip}
                  onChange={handleChange}
                  fullWidth
                  disabled={loading}
                  variant="outlined"
                  placeholder="12345"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      border: "1px solid rgb(255, 255, 255)",
                      fontSize: "14px",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                  }}
                  helperText="5자리 숫자로 입력해주세요"
                />
              </Box>

              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1, fontSize: "14px", fontWeight: "500" }}
                >
                  주소
                </Typography>
                <TextField
                  name="memberAddr"
                  value={formData.memberAddr}
                  onChange={handleChange}
                  fullWidth
                  disabled={loading}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      border: "1px solid rgb(255, 255, 255)",
                      fontSize: "14px",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                  }}
                />
              </Box>

              <Divider sx={{ my: 1 }} />

              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1, fontSize: "14px", fontWeight: "500" }}
                >
                  새 비밀번호 (선택사항)
                </Typography>
                <TextField
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  fullWidth
                  disabled={loading}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      border: "1px solid rgb(255, 255, 255)",
                      fontSize: "14px",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                  }}
                  helperText="비밀번호를 변경하지 않으려면 비워두세요."
                />
              </Box>

              {formData.password && (
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1, fontSize: "14px", fontWeight: "500" }}
                  >
                    비밀번호 확인
                  </Typography>
                  <TextField
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    fullWidth
                    disabled={loading}
                    error={
                      formData.password !== formData.confirmPassword &&
                      formData.confirmPassword !== ""
                    }
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        fontSize: "14px",
                      },
                    }}
                    helperText={
                      formData.password !== formData.confirmPassword &&
                      formData.confirmPassword !== ""
                        ? "비밀번호가 일치하지 않습니다."
                        : ""
                    }
                  />
                </Box>
              )}
            </Box>

            {/* 버튼 영역 */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 4,
                pt: 3,
                borderTop: "1px solid #f0f0f0",
              }}
            >
              <Button
                onClick={onClose}
                disabled={loading}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  color: "#666",
                  fontSize: "14px",
                  "&:hover": {
                    backgroundColor: "#f8f9fa",
                  },
                }}
              >
                취소
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  backgroundColor: "#4ecdc4",
                  fontSize: "14px",
                  "&:hover": {
                    backgroundColor: "#26b5a8",
                  },
                  "&:disabled": {
                    backgroundColor: "#ccc",
                  },
                }}
                startIcon={
                  loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : null
                }
              >
                {loading ? "수정 중..." : "수정"}
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default EditProfile;
