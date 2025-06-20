"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { MessageCircle, Send, Bot, User, Minimize2, Maximize2, RotateCcw, Loader2, Sparkles, X } from "lucide-react"

// 메시지 타입 정의
interface ChatMessage {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
  isTyping?: boolean
}

// 빠른 질문 템플릿
const quickQuestions = [
  "채용오더는 어떻게 등록하나요?",
  "후보자 매칭률은 어떻게 계산되나요?",
  "분석 기능 사용법을 알려주세요",
  "게시판은 어떻게 사용하나요?",
  "대시보드 화면 구성을 설명해주세요",
]

// 초기 환영 메시지
const welcomeMessage: ChatMessage = {
  id: "welcome",
  type: "bot",
  content: `안녕하세요! 👋 searchFlow 사용법 도우미입니다.

궁금한 것이 있으시면 언제든 물어보세요. 아래 버튼을 클릭하거나 직접 질문을 입력해주세요.

• 채용오더 등록 및 관리
• 후보자 매칭 및 분석
• 대시보드 사용법
• 게시판 활용법
• 기타 기능 문의

어떤 도움이 필요하신가요?`,
  timestamp: new Date(),
}

export function Chatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // 메시지 목록 끝으로 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 메시지 전송 핸들러
  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: content.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // 타이핑 인디케이터 표시
    const typingMessage: ChatMessage = {
      id: "typing",
      type: "bot",
      content: "",
      timestamp: new Date(),
      isTyping: true,
    }
    setMessages((prev) => [...prev, typingMessage])

    // Mock API 호출 (실제로는 n8n webhook 호출)
    try {
      // 2-4초 랜덤 지연으로 실제 응답 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 2000 + 2000))

      // Mock 응답 생성
      const botResponse = generateMockResponse(content)

      // 타이핑 메시지 제거 후 실제 응답 추가
      setMessages((prev) => {
        const withoutTyping = prev.filter((msg) => msg.id !== "typing")
        return [
          ...withoutTyping,
          {
            id: Date.now().toString(),
            type: "bot",
            content: botResponse,
            timestamp: new Date(),
          },
        ]
      })
    } catch (error) {
      console.error("챗봇 응답 오류:", error)
      setMessages((prev) => {
        const withoutTyping = prev.filter((msg) => msg.id !== "typing")
        return [
          ...withoutTyping,
          {
            id: Date.now().toString(),
            type: "bot",
            content: "죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
            timestamp: new Date(),
          },
        ]
      })
    } finally {
      setIsTyping(false)
    }
  }

  // Mock 응답 생성 함수 (실제로는 n8n + Gemini 응답)
  const generateMockResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase()

    if (lowerQuestion.includes("채용오더") || lowerQuestion.includes("등록")) {
      return `채용오더 등록 방법을 안내해드리겠습니다! 📝

**1단계: 등록 시작**
• 대시보드 왼쪽 채용오더 패널에서 '+' 버튼 클릭

**2단계: 기본 정보 입력**
• 회사명 (필수)
• 포지션명 (필수)
• 경력 요건

**3단계: 상세 정보 작성**
• 주요 업무
• 자격 요건
• 우대 사항
• 기타 정보

**4단계: 추가 설정**
• 마감 기한 설정 (선택)
• 긴급 채용 여부
• 내부 메모 (비공개)

**5단계: 등록 완료**
• '등록' 버튼 클릭하여 완료

등록 후 '분석하기' 버튼을 통해 AI 분석도 받아보세요! 🚀`
    }

    if (lowerQuestion.includes("매칭") || lowerQuestion.includes("적합도")) {
      return `후보자 매칭률 계산 방식을 설명해드리겠습니다! 🎯

**AI 매칭 알고리즘**
• 채용오더 요구사항 분석
• 후보자 경력/기술 데이터 분석
• 다차원 매칭 점수 계산

**주요 평가 요소**
• 기술 스택 일치도 (40%)
• 경력 수준 적합성 (25%)
• 지역/근무 조건 (15%)
• 학력/자격증 (10%)
• 기타 우대사항 (10%)

**매칭률 구간**
• 90% 이상: EXCELLENT (최우수)
• 80-89%: 높은 적합도
• 70-79%: 보통 적합도
• 70% 미만: 낮은 적합도

매칭률이 높을수록 성공적인 채용 가능성이 높습니다! ✨`
    }

    if (lowerQuestion.includes("분석") || lowerQuestion.includes("AI")) {
      return `AI 분석 기능 사용법을 안내해드리겠습니다! 🤖

**분석 시작하기**
• 채용오더 카드에서 '분석하기' 버튼 클릭
• 약 3초간 AI 분석 진행

**분석 결과 확인**
• '펼쳐보기' 버튼으로 상세 결과 확인

**분석 내용**
1. **포지션 가이드**
   - 해당 포지션에 적합한 인재상 제시
   - 핵심 역량 및 경험 요구사항

2. **추천 검색 키워드**
   - 후보자 검색에 유용한 키워드 제공
   - 기술 스택, 경험 분야별 키워드

3. **필터링 조건**
   - 경력, 나이, 성별, 지역
   - 학력, 연봉 범위 추천

분석 결과를 활용해 더 정확한 후보자 매칭을 받아보세요! 🎯`
    }

    if (lowerQuestion.includes("게시판") || lowerQuestion.includes("Q&A") || lowerQuestion.includes("FAQ")) {
      return `게시판 활용법을 안내해드리겠습니다! 📋

**게시판 접근**
• 헤더에서 '게시판' 메뉴 클릭

**카테고리별 이용**
• **Q&A**: 질문과 답변 게시판
• **FAQ**: 자주 묻는 질문 모음
• **사용법**: 기능별 상세 가이드

**게시글 작성**
• '글쓰기' 버튼으로 새 게시글 작성
• 카테고리 선택 및 태그 설정

**검색 및 필터**
• 제목, 내용, 태그로 검색 가능
• 카테고리별 필터링 지원

**게시글 상호작용**
• 조회수, 댓글 수 확인
• 답변 완료 상태 표시
• 고정글 우선 표시

궁금한 점은 언제든 게시판에 질문해주세요! 💬`
    }

    if (lowerQuestion.includes("대시보드") || lowerQuestion.includes("화면") || lowerQuestion.includes("구성")) {
      return `대시보드 화면 구성을 설명해드리겠습니다! 📊

**3단 구성 레이아웃**

**1. 왼쪽 패널 - 채용오더 목록**
• 등록된 모든 채용오더 표시
• 상태별 필터링 (진행중/완료/마감/긴급)
• 정렬 기능 (최신순/후보자순/마감순)
• 오더 등록/수정/삭제 기능

**2. 가운데 패널 - 후보자 목록/오더 상세**
• 선택된 오더의 후보자 목록 표시
• 후보자가 없을 경우 오더 상세정보 표시
• 매칭률 및 적합도 정보

**3. 오른쪽 패널 - 후보자 상세정보**
• 선택된 후보자의 상세 프로필
• 매칭 분석 결과 및 사유
• 제안서 작성 기능

**추가 기능**
• 실시간 상태 업데이트
• 반응형 디자인 지원
• 직관적인 클릭 네비게이션

효율적인 채용 관리를 위한 최적화된 구성입니다! 🎯`
    }

    // 기본 응답
    return `안녕하세요! 😊

질문해주신 내용에 대해 더 구체적으로 도움을 드리고 싶습니다.

**자주 묻는 질문들:**
• 채용오더 등록 방법
• 후보자 매칭 시스템
• AI 분석 기능 사용법
• 게시판 활용 방법
• 대시보드 화면 구성

위 주제들 중 궁금한 것이 있으시거나, 다른 질문이 있으시면 더 자세히 물어보세요!

아래 빠른 질문 버튼들도 활용해보세요. 🚀`
  }

  // 빠른 질문 클릭 핸들러
  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question)
  }

  // 채팅 초기화
  const handleReset = () => {
    setMessages([welcomeMessage])
    setInputValue("")
    setIsTyping(false)
  }

  // 엔터키 처리
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(inputValue)
    }
  }

  // 챗봇이 닫혀있을 때 플로팅 버튼
  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          <MessageCircle className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
        </Button>
        <div className="absolute -top-12 right-0 bg-gray-900 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          사용법 도우미
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card
        className={`shadow-2xl border-0 transition-all duration-300 ${isMinimized ? "w-80 h-16" : "w-96 h-[600px]"}`}
      >
        {/* 헤더 */}
        <CardHeader className="pb-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-medium">사용법 도우미</CardTitle>
                <p className="text-xs text-white/80">AI 기반 searchFlow 가이드</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* 메인 콘텐츠 */}
        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[calc(600px-80px)]">
            {/* 메시지 영역 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`flex items-start gap-2 max-w-[85%] ${
                      message.type === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    {/* 아바타 */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.type === "user"
                          ? "bg-blue-500 text-white"
                          : "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      }`}
                    >
                      {message.type === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>

                    {/* 메시지 버블 */}
                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        message.type === "user"
                          ? "bg-blue-500 text-white rounded-br-md"
                          : "bg-gray-100 text-gray-800 rounded-bl-md"
                      }`}
                    >
                      {message.isTyping ? (
                        <div className="flex items-center gap-1">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">답변을 생성하고 있습니다...</span>
                        </div>
                      ) : (
                        <div className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* 빠른 질문 버튼들 */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2">
                <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  빠른 질문
                </div>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.slice(0, 3).map((question, index) => (
                    <Button
                      key={index}
                      size="sm"
                      variant="outline"
                      className="text-xs h-7 px-2 hover:bg-blue-50 hover:border-blue-300"
                      onClick={() => handleQuickQuestion(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* 입력 영역 */}
            <div className="p-4">
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="궁금한 것을 물어보세요..."
                    disabled={isTyping}
                    className="pr-20 text-sm"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                      onClick={handleReset}
                      title="대화 초기화"
                    >
                      <RotateCcw className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-blue-500 hover:text-blue-600 disabled:opacity-50"
                      onClick={() => handleSendMessage(inputValue)}
                      disabled={!inputValue.trim() || isTyping}
                    >
                      <Send className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>AI 도우미 온라인</span>
                </div>
                <span>Enter로 전송</span>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
