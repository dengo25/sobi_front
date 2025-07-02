// 🛠️ 관리자 FAQ 페이지 예시
import { useState, useEffect } from "react"
import AdminFaqManager from "../../components/list/AdminFaqManager"
// import { faqAPI } from "../../api/faq"

const AdminFaq = () => {
  const [faqList, setFaqList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFaqList()
  }, [])

  const fetchFaqList = async () => {
    try {
      setLoading(true)
      const response = await faqAPI.getList()
      setFaqList(response.data || response)
    } catch (error) {
      console.error("FAQ 목록 조회 실패:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = (faqNo) => {
    // 수정 페이지로 이동 또는 모달 열기
    console.log("수정:", faqNo)
    // navigate(`/admin/faq/edit/${faqNo}`)
  }

  const handleDelete = async (faqNo) => {
    try {
      await faqAPI.delete(faqNo)
      alert("FAQ가 삭제되었습니다.")
      fetchFaqList() // 목록 새로고침
    } catch (error) {
      console.error("FAQ 삭제 실패:", error)
      alert("삭제 중 오류가 발생했습니다.")
    }
  }

  const handleBulkDelete = async (faqNos) => {
    try {
      await Promise.all(faqNos.map((faqNo) => faqAPI.delete(faqNo)))
      alert(`${faqNos.length}개 FAQ가 삭제되었습니다.`)
      fetchFaqList() // 목록 새로고침
    } catch (error) {
      console.error("일괄 삭제 실패:", error)
      alert("삭제 중 오류가 발생했습니다.")
    }
  }

  if (loading) {
    return <div className="text-center py-8">로딩 중...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">FAQ 관리</h1>

      <AdminFaqManager
        faqList={faqList}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
      />
    </div>
  )
}

export default AdminFaq
