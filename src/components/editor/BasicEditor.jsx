import { useRef, useMemo, useCallback } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import axios from "axios";
import jwtAxios from "../../service/util/JwtUtil";
import { API_BASE_URL } from "../../service/util/api-config";

const BasicEditor = ({
  value = "",
  onChange,
  theme = "snow",
  customModules = {},
  customFormats = [],
  s3Folder = "notice", // S3 폴더명을 props
}) => {
  const quillRef = useRef();

  // 이미지 삭제 기능
  const deleteImageFromS3 = useCallback(async (imageUrl) => {
    try {
      const response = await jwtAxios.delete(`${API_BASE_URL}/api/s3/delete`, {
        data: {
          fileUrl: imageUrl,
          folder: s3Folder
        }
      });
      
      if (response.data.success) {
        console.log("S3 이미지 삭제 성공:", response.data.deletedFile);
        return true;
      } else {
        console.error("S3 이미지 삭제 실패:", response.data.message);
        return false;
      }
    } catch (error) {
      console.error("S3 이미지 삭제 중 오류:", error);
      return false;
    }
  }, [s3Folder]);

  const imageHandler = useCallback(async () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      try {
        const { data } = await jwtAxios.post(
          `${API_BASE_URL}/api/s3/presigned`,
          {
            folder: s3Folder,
            filenames: [file.name], // 문자열 배열로 감싸야 함
          }
        );
        console.log("S3 응답:", data);

        // S3 응답에서 URL 추출
        const presignedUrl = data[0].presignedUrl;
        const filename = data[0].filename;

        // fileUrl 구성 방법 1: presignedUrl에서 추출
        let fileUrl = presignedUrl.split("?")[0];

        // fileUrl 구성 방법 2: 직접 구성 (백업)
        if (!fileUrl.includes(filename)) {
          // S3 버킷 URL 직접 구성
          fileUrl = `https://kosta-blog.s3.ap-northeast-2.amazonaws.com/${filename}`;
        }

        console.log("presignedUrl:", presignedUrl);
        console.log("filename:", filename);
        console.log("구성된 fileUrl:", fileUrl);

        if (!fileUrl) {
          alert("파일 URL을 가져올 수 없습니다.");
          return;
        }

        // await jwtAxios.put(presignedUrl, file, { // S3로 put은 인증 토큰이 붙어 있음 안됨
        await axios.put(presignedUrl, file, {
          headers: { "Content-Type": file.type },
        });

        // 에디터 참조 방식 수정
        const quill = quillRef.current?.getEditor?.();
        if (!quill) {
          alert("에디터가 아직 로딩되지 않았습니다.");
          return;
        }

        // 현재 선택 범위 또는 커서 위치 가져오기
        const range = quill.getSelection(true);
        const index = range ? range.index : quill.getLength();

        // 이미지 HTML 생성
        const imageHTML = `<p><img src="${fileUrl}" style="max-width: 100%; height: auto;" alt="업로드된 이미지"></p>`;

        // 현재 에디터의 HTML 가져오기
        const currentHTML = quill.root.innerHTML;

        console.log("이미지 삽입 시도:", fileUrl);
        console.log("삽입 위치:", index);

        // 커서 위치에 해당하는 텍스트 위치 찾기
        const textContent = quill.getText();

        // 새로운 HTML 생성 (간단한 방법)
        let newHTML;
        if (index === 0) {
          // 맨 앞에 삽입
          newHTML = imageHTML + currentHTML;
        } else if (index >= textContent.length - 1) {
          // 맨 뒤에 삽입
          newHTML = currentHTML + imageHTML;
        } else {
          // 중간에 삽입 - 단순하게 처리
          newHTML = currentHTML.replace(/<\/p>$/, `</p>${imageHTML}`);
        }

        // 에디터 내용 업데이트
        quill.root.innerHTML = newHTML;

        // 중요: 이미지 삽입 후 onChange 호출하여 상태 업데이트
        if (onChange) {
          setTimeout(() => {
            onChange(quill.root.innerHTML);
          }, 100);
        }
      } catch (err) {
        console.error("이미지 업로드 실패", err);
        alert("이미지 업로드에 실패했습니다.");
      }
    };
  }, [onChange, s3Folder]);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          ["link", "image"],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      ...customModules,
    }),
    [imageHandler, customModules]
  );

  const formats = useMemo(
    () => [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "blockquote",
      "list",
      "bullet",
      "indent",
      "link",
      "image",
      ...customFormats,
    ],
    [customFormats]
  );

  // onChange 핸들러 최적화 - 이미지 삽입 시 방해하지 않도록
  const handleChange = useCallback(
    (content, delta, source, editor) => {
      // 모든 변경사항을 처리하되, 무한 루프 방지
      if (onChange && content !== value) {
        onChange(content);
      }
    },
    [onChange, value]
  );

  return (
    <div className="editor-area">
      <ReactQuill
        ref={quillRef}
        value={value}
        onChange={handleChange}
        theme={theme}
        modules={modules}
        formats={formats}
        style={{ minHeight: "300px", backgroundColor: "white" }}
        placeholder="내용을 입력해주세요..."
        preserveWhitespace={false}
      />
    </div>
  );
};

export default BasicEditor;