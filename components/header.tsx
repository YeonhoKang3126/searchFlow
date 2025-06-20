"use client"

interface HeaderProps {
  currentPage?: "dashboard" | "board" | "chatbot"
  onPageChange?: (page: "dashboard" | "board" | "chatbot") => void
}

export function Header({ currentPage = "dashboard", onPageChange }: HeaderProps) {
  const handleNavClick = (page: "dashboard" | "board" | "chatbot") => {
    if (onPageChange) {
      onPageChange(page)
    }
  }

  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold gradient-text">searchFlow</h1>
            <span className="ml-4 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Beta</span>
          </div>
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex space-x-6">
              <button
                onClick={() => handleNavClick("dashboard")}
                className={`transition-colors ${
                  currentPage === "dashboard" ? "text-blue-600 font-medium" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                대시보드
              </button>
              <button
                onClick={() => handleNavClick("board")}
                className={`transition-colors ${
                  currentPage === "board" ? "text-blue-600 font-medium" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                게시판
              </button>
              <button
                onClick={() => handleNavClick("chatbot")}
                className={`transition-colors ${
                  currentPage === "chatbot" ? "text-blue-600 font-medium" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                AI 도우미
              </button>
              <button className="text-gray-600 hover:text-gray-900 transition-colors">설정</button>
            </nav>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">U</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
