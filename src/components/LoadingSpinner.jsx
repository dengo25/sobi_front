
export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center space-y-4">
        {/* 회전하는 스피너 */}
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>

        {/* 로딩 텍스트 */}
        <p className="text-gray-600">페이지를 불러오는 중...</p>
      </div>
    </div>
  )
}
