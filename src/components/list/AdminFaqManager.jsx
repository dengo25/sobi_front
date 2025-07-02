"use client"

// 🛠️ 방법 2: 관리자 전용 래퍼 컴포넌트
import { useState } from "react"
import ControlledAccordions from "../list/ControlledAccordions"

const AdminFaqManager = ({ faqList, onUpdate, onDelete, onBulkDelete }) => {
  const [expanded, setExpanded] = useState(false)
  const [selectedItems, setSelectedItems] = useState(new Set())
  const [isAdminMode, setIsAdminMode] = useState(false)

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }

  const handleSelectItem = (itemId, isSelected) => {
    const newSelected = new Set(selectedItems)
    if (isSelected) {
      newSelected.add(itemId)
    } else {
      newSelected.delete(itemId)
    }
    setSelectedItems(newSelected)
  }

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(new Set(faqList.map((faq) => `panel-${faq.faqNo}`)))
    } else {
      setSelectedItems(new Set())
    }
  }

  const handleBulkDelete = () => {
    if (selectedItems.size === 0) {
      alert("삭제할 항목을 선택해주세요.")
      return
    }

    if (window.confirm(`선택한 ${selectedItems.size}개 항목을 삭제하시겠습니까?`)) {
      const idsToDelete = Array.from(selectedItems).map((panelId) => panelId.replace("panel-", ""))
      onBulkDelete?.(idsToDelete)
      setSelectedItems(new Set())
    }
  }

  const handleEdit = (panelId) => {
    const faqNo = panelId.replace("panel-", "")
    onUpdate?.(faqNo)
  }

  const handleDelete = (panelId) => {
    const faqNo = panelId.replace("panel-", "")
    if (window.confirm("이 FAQ를 삭제하시겠습니까?")) {
      onDelete?.(faqNo)
    }
  }

  return (
    <div className="admin-faq-manager">
      {/* 🛠️ 관리자 컨트롤 패널 */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">FAQ 관리</h3>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isAdminMode}
              onChange={(e) => setIsAdminMode(e.target.checked)}
              className="w-4 h-4"
            />
            <span>관리자 모드</span>
          </label>
        </div>

        {isAdminMode && (
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedItems.size === faqList.length && faqList.length > 0}
                onChange={handleSelectAll}
                className="w-4 h-4"
              />
              <span>전체 선택</span>
            </label>

            <span className="text-sm text-gray-600">선택됨: {selectedItems.size}개</span>

            <div className="ml-auto flex gap-2">
              <button
                onClick={handleBulkDelete}
                disabled={selectedItems.size === 0}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                선택 삭제
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 🛠️ FAQ 목록 */}
      <div className="space-y-2">
        {faqList.map((faq, index) => {
          const panelId = `panel-${faq.faqNo}`

          return (
            <ControlledAccordions
              key={faq.faqNo}
              name={panelId}
              title={faq.faqQuestion}
              content={faq.faqAnswer}
              expanded={expanded}
              handleChange={handleChange}
              // 관리자 모드 props
              isAdminMode={isAdminMode}
              isSelected={selectedItems.has(panelId)}
              onSelect={handleSelectItem}
              showActions={true}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )
        })}
      </div>
    </div>
  )
}

export default AdminFaqManager
