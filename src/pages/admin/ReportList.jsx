import React, { useState, useEffect } from "react";
import { getReportList } from "../../service/admin/ApiService";
const ReportList = () => {
  // 상태 관리
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 페이징 상태
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // 필터 상태
  const [filters, setFilters] = useState({
    status: "",
    reportType: "",
    sortBy: "createdAt",
    sortDir: "desc",
  });

  // 신고 목록 조회 함수
  const fetchReports = async (page = 0) => {
    setLoading(true);
    setError(null);

    try {
      const searchParams = {
        page: page,
        size: pageSize,
        ...filters,
      };

      const response = await getReportList(searchParams);

      setReports(response.reports);
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (err) {
      setError("신고 목록을 불러오는데 실패했습니다.");
      console.error("신고 목록 조회 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchReports(0);
  }, [pageSize, filters]);

  // 필터 변경 핸들러
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 검색 버튼 클릭
  const handleSearch = () => {
    setCurrentPage(0);
    fetchReports(0);
  };

  // 필터 초기화
  const handleReset = () => {
    setFilters({
      status: "",
      reportType: "",
      sortBy: "createdAt",
      sortDir: "desc",
    });
    setCurrentPage(0);
    fetchReports(0);
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 페이지 변경
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
      fetchReports(newPage);
    }
  };

  // 페이지 사이즈 변경
  const handlePageSizeChange = (e) => {
    setPageSize(parseInt(e.target.value));
    setCurrentPage(0);
  };

  // 정렬 변경
  const handleSort = (field) => {
    const newSortDir =
      filters.sortBy === field && filters.sortDir === "asc" ? "desc" : "asc";
    setFilters((prev) => ({
      ...prev,
      sortBy: field,
      sortDir: newSortDir,
    }));
    setCurrentPage(0);
    fetchReports(0);
  };

  // 상태별 스타일
  const getStatusStyle = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm";
      case "PROCESSED":
        return "bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm";
      case "REJECTED":
        return "bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm";
      default:
        return "bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm";
    }
  };

  return (
    <div>
      <h2>신고 목록 관리</h2>

      {/* 필터 */}
      <div>
        <div>
          <div>
            <label>신고 상태</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">전체</option>
              <option value="PENDING">처리 대기</option>
              <option value="PROCESSED">처리 완료</option>
              <option value="REJECTED">반려</option>
            </select>
          </div>

          <div>
            <label>신고 유형</label>
            <select
              name="reportType"
              value={filters.reportType}
              onChange={handleFilterChange}
            >
              <option value="">전체</option>
              <option value="SPAM">스팸</option>
              <option value="ABUSE">욕설/비방</option>
              <option value="INAPPROPRIATE">부적절한 내용</option>
              <option value="COPYRIGHT">저작권 침해</option>
            </select>
          </div>
        </div>

        <div>
          <button onClick={handleSearch}>필터 적용</button>
          <button onClick={handleReset}>초기화</button>
        </div>
      </div>

      {/* 페이지 사이즈 선택 */}
      <div>
        <div>
          <span>페이지당 항목 수:</span>
          <select value={pageSize} onChange={handlePageSizeChange}>
            <option value={5}>5개</option>
            <option value={10}>10개</option>
            <option value={20}>20개</option>
            <option value={50}>50개</option>
          </select>
        </div>

        <div>
          총 {totalElements}개 중 {currentPage * pageSize + 1}-
          {Math.min((currentPage + 1) * pageSize, totalElements)}개 표시
        </div>
      </div>

      {/* 로딩 및 에러 처리 */}
      {loading && (
        <div>
          <div>로딩 중...</div>
        </div>
      )}

      {error && (
        <div>
          <div>{error}</div>
        </div>
      )}

      {/* 신고 목록 테이블 */}
      {!loading && !error && (
        <>
          <div>
            <table>
              <thead>
                <tr>
                  <th>신고자 ID</th>
                  <th>피신고자 ID</th>
                  <th onClick={() => handleSort("reportType")}>
                    신고 유형
                    {filters.sortBy === "reportType" && (
                      <span>{filters.sortDir === "asc" ? "↑" : "↓"}</span>
                    )}
                  </th>
                  <th onClick={() => handleSort("status")}>
                    상태
                    {filters.sortBy === "status" && (
                      <span>{filters.sortDir === "asc" ? "↑" : "↓"}</span>
                    )}
                  </th>
                  <th onClick={() => handleSort("createdAt")}>
                    신고일시
                    {filters.sortBy === "createdAt" && (
                      <span>{filters.sortDir === "asc" ? "↑" : "↓"}</span>
                    )}
                  </th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan="6">조회된 신고가 없습니다.</td>
                  </tr>
                ) : (
                  reports.map((report, index) => (
                    <tr key={index}>
                      <td>{report.reporterId}</td>
                      <td>{report.reportedId}</td>
                      <td>{report.reportType}</td>
                      <td>
                        <span>
                          {report.status === "PENDING"
                            ? "처리 대기"
                            : report.status === "PROCESSED"
                            ? "처리 완료"
                            : report.status === "REJECTED"
                            ? "반려"
                            : report.status}
                        </span>
                      </td>
                      <td>{formatDate(report.createdAt)}</td>
                      <td>
                        <button>상세보기</button>
                        {report.status === "PENDING" && <button>처리</button>}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* 페이징 */}
          {totalPages > 1 && (
            <div>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
              >
                이전
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index)}
                  disabled={currentPage === index}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
              >
                다음
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReportList;
