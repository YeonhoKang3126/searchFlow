"use client"

import { useState } from "react"
import RecruitmentDashboard from "../recruitment-dashboard"
import { Board } from "@/components/board"
import { Chatbot } from "@/components/chatbot"
import { Header } from "@/components/header"

export default function Page() {
  const [currentPage, setCurrentPage] = useState<"dashboard" | "board" | "chatbot">("dashboard")

  const handlePageChange = (page: "dashboard" | "board" | "chatbot") => {
    setCurrentPage(page)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage={currentPage} onPageChange={handlePageChange} />
      {currentPage === "dashboard" ? (
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <p className="text-gray-600 mt-2">포지션별 후보자 매칭 현황을 확인하세요</p>
            </div>
            <RecruitmentDashboard />
          </div>
        </div>
      ) : currentPage === "board" ? (
        <Board />
      ) : (
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">AI 도우미</h1>
              <p className="text-gray-600">searchFlow 사용법에 대해 궁금한 점을 물어보세요</p>
            </div>
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">🤖</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">AI 도우미가 도움을 드릴게요!</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                오른쪽 하단의 채팅 버튼을 클릭하여 searchFlow 사용법에 대해 언제든 질문해보세요.
              </p>
              <div className="flex justify-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>24시간 이용 가능</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>즉시 응답</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>AI 기반 정확한 답변</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 플로팅 챗봇 - 모든 페이지에서 접근 가능 */}
      <Chatbot />
    </div>
  )
}
