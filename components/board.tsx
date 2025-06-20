"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  MessageCircle,
  HelpCircle,
  BookOpen,
  Plus,
  Search,
  Calendar,
  User,
  Eye,
  MessageSquare,
  ChevronRight,
  Pin,
  CheckCircle,
} from "lucide-react"

// 게시글 타입 정의
interface BoardPost {
  id: number
  category: "qna" | "faq" | "guide"
  title: string
  content: string
  author: string
  createdAt: string
  views: number
  replies: number
  isPinned: boolean
  isAnswered?: boolean // Q&A용
  tags: string[]
}

// 초기 게시글 데이터
const initialPosts: BoardPost[] = [
  {
    id: 1,
    category: "faq",
    title: "searchFlow 서비스는 어떤 기능을 제공하나요?",
    content:
      "searchFlow는 AI 기반의 채용 매칭 플랫폼으로, 채용오더 등록, 후보자 분석, 매칭률 계산 등의 기능을 제공합니다.",
    author: "관리자",
    createdAt: "2025-01-20",
    views: 156,
    replies: 3,
    isPinned: true,
    tags: ["서비스소개", "기능"],
  },
  {
    id: 2,
    category: "guide",
    title: "채용오더 등록 방법 안내",
    content:
      "채용오더를 등록하는 방법에 대해 단계별로 설명드립니다.\n\n1. 대시보드에서 '+' 버튼 클릭\n2. 회사명, 포지션명 등 필수 정보 입력\n3. 주요 업무, 자격 요건 등 상세 정보 작성\n4. 등록 버튼 클릭하여 완료",
    author: "관리자",
    createdAt: "2025-01-19",
    views: 89,
    replies: 1,
    isPinned: true,
    tags: ["사용법", "채용오더"],
  },
  {
    id: 3,
    category: "qna",
    title: "분석 기능이 작동하지 않아요",
    content: "채용오더에서 '분석하기' 버튼을 눌렀는데 계속 로딩 상태에서 멈춰있습니다. 어떻게 해결할 수 있나요?",
    author: "김헤드헌터",
    createdAt: "2025-01-18",
    views: 42,
    replies: 2,
    isPinned: false,
    isAnswered: true,
    tags: ["분석", "오류"],
  },
  {
    id: 4,
    category: "faq",
    title: "후보자 매칭률은 어떻게 계산되나요?",
    content:
      "매칭률은 AI 알고리즘을 통해 채용오더의 요구사항과 후보자의 경력, 기술, 경험 등을 종합적으로 분석하여 계산됩니다.",
    author: "관리자",
    createdAt: "2025-01-17",
    views: 73,
    replies: 0,
    isPinned: false,
    tags: ["매칭", "알고리즘"],
  },
  {
    id: 5,
    category: "qna",
    title: "후보자 정보를 수정할 수 있나요?",
    content: "등록된 후보자의 정보를 수정하거나 업데이트하는 방법이 있는지 궁금합니다.",
    author: "이리크루터",
    createdAt: "2025-01-16",
    views: 28,
    replies: 1,
    isPinned: false,
    isAnswered: false,
    tags: ["후보자", "수정"],
  },
  {
    id: 6,
    category: "guide",
    title: "대시보드 화면 구성 및 사용법",
    content:
      "searchFlow 대시보드의 각 영역별 기능과 사용법을 안내합니다.\n\n• 왼쪽: 채용오더 목록\n• 가운데: 후보자 목록 또는 오더 상세정보\n• 오른쪽: 후보자 상세정보\n\n각 영역을 클릭하여 상세 정보를 확인할 수 있습니다.",
    author: "관리자",
    createdAt: "2025-01-15",
    views: 134,
    replies: 4,
    isPinned: false,
    tags: ["사용법", "대시보드"],
  },
]

export function Board() {
  const [posts, setPosts] = useState<BoardPost[]>(initialPosts)
  const [selectedCategory, setSelectedCategory] = useState<"all" | "qna" | "faq" | "guide">("all")
  const [selectedPost, setSelectedPost] = useState<BoardPost | null>(null)
  const [isWriteDialogOpen, setIsWriteDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [newPost, setNewPost] = useState({
    category: "qna" as "qna" | "faq" | "guide",
    title: "",
    content: "",
    tags: "",
  })

  // 필터링된 게시글
  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory
    const matchesSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  // 고정글과 일반글 분리 및 정렬
  const pinnedPosts = filteredPosts.filter((post) => post.isPinned).sort((a, b) => b.id - a.id)
  const regularPosts = filteredPosts.filter((post) => !post.isPinned).sort((a, b) => b.id - a.id)
  const sortedPosts = [...pinnedPosts, ...regularPosts]

  const handlePostClick = (post: BoardPost) => {
    // 조회수 증가
    setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, views: p.views + 1 } : p)))
    setSelectedPost({ ...post, views: post.views + 1 })
  }

  const handleWritePost = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPost.title && newPost.content) {
      const post: BoardPost = {
        id: Math.max(...posts.map((p) => p.id)) + 1,
        category: newPost.category,
        title: newPost.title,
        content: newPost.content,
        author: "사용자", // 실제로는 로그인된 사용자 정보
        createdAt: new Date().toISOString().split("T")[0],
        views: 0,
        replies: 0,
        isPinned: false,
        isAnswered: newPost.category === "qna" ? false : undefined,
        tags: newPost.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      }
      setPosts((prev) => [post, ...prev])
      setNewPost({ category: "qna", title: "", content: "", tags: "" })
      setIsWriteDialogOpen(false)
    }
  }

  const getCategoryInfo = (category: string) => {
    switch (category) {
      case "qna":
        return { name: "Q&A", icon: MessageCircle, color: "bg-blue-100 text-blue-800" }
      case "faq":
        return { name: "FAQ", icon: HelpCircle, color: "bg-green-100 text-green-800" }
      case "guide":
        return { name: "사용법", icon: BookOpen, color: "bg-purple-100 text-purple-800" }
      default:
        return { name: "전체", icon: MessageCircle, color: "bg-gray-100 text-gray-800" }
    }
  }

  const getCategoryCount = (category: "all" | "qna" | "faq" | "guide") => {
    if (category === "all") return posts.length
    return posts.filter((post) => post.category === category).length
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">게시판</h1>
            <p className="text-gray-600">Q&A, FAQ, 사용법 안내를 확인하세요</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* 카테고리 사이드바 */}
            <div className="lg:col-span-1">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">카테고리</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { key: "all" as const, name: "전체", icon: MessageSquare },
                    { key: "qna" as const, name: "Q&A", icon: MessageCircle },
                    { key: "faq" as const, name: "FAQ", icon: HelpCircle },
                    { key: "guide" as const, name: "사용법", icon: BookOpen },
                  ].map((category) => {
                    const Icon = category.icon
                    const count = getCategoryCount(category.key)
                    return (
                      <button
                        key={category.key}
                        onClick={() => setSelectedCategory(category.key)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                          selectedCategory === category.key
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {count}
                        </Badge>
                      </button>
                    )
                  })}
                </CardContent>
              </Card>
            </div>

            {/* 게시글 목록 */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      게시글 목록 ({sortedPosts.length})
                    </CardTitle>
                    <Button size="sm" onClick={() => setIsWriteDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-1" />
                      글쓰기
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="제목, 내용, 태그로 검색..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="max-h-[600px] overflow-y-auto">
                  <div className="space-y-3">
                    {sortedPosts.map((post) => {
                      const categoryInfo = getCategoryInfo(post.category)
                      const CategoryIcon = categoryInfo.icon
                      return (
                        <div
                          key={post.id}
                          onClick={() => handlePostClick(post)}
                          className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                            selectedPost?.id === post.id
                              ? "border-blue-500 bg-blue-50 shadow-blue-200/50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                {post.isPinned && <Pin className="h-4 w-4 text-red-500" />}
                                <Badge className={`text-xs ${categoryInfo.color}`}>
                                  <CategoryIcon className="h-3 w-3 mr-1" />
                                  {categoryInfo.name}
                                </Badge>
                                {post.category === "qna" && post.isAnswered && (
                                  <Badge className="text-xs bg-green-100 text-green-800">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    답변완료
                                  </Badge>
                                )}
                              </div>
                              <h3 className="font-semibold text-sm mb-2 line-clamp-2">{post.title}</h3>
                              <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                                <div className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  {post.author}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {post.createdAt}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  {post.views}
                                </div>
                                <div className="flex items-center gap-1">
                                  <MessageCircle className="h-3 w-3" />
                                  {post.replies}
                                </div>
                              </div>
                              {post.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {post.tags.map((tag, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      #{tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                            <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          </div>
                        </div>
                      )
                    })}
                    {sortedPosts.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>검색 결과가 없습니다</p>
                        <p className="text-sm">다른 검색어를 시도해보세요</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 게시글 상세보기 */}
            <div className="lg:col-span-1">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    {selectedPost ? "게시글 상세" : "게시글을 선택하세요"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="max-h-[600px] overflow-y-auto">
                  {selectedPost ? (
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          {selectedPost.isPinned && <Pin className="h-4 w-4 text-red-500" />}
                          <Badge className={`text-xs ${getCategoryInfo(selectedPost.category).color}`}>
                            {getCategoryInfo(selectedPost.category).name}
                          </Badge>
                          {selectedPost.category === "qna" && selectedPost.isAnswered && (
                            <Badge className="text-xs bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              답변완료
                            </Badge>
                          )}
                        </div>
                        <h2 className="font-bold text-lg mb-3">{selectedPost.title}</h2>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {selectedPost.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {selectedPost.createdAt}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            조회 {selectedPost.views}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" />
                            댓글 {selectedPost.replies}
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                          {selectedPost.content}
                        </p>
                      </div>

                      {selectedPost.tags.length > 0 && (
                        <>
                          <Separator />
                          <div>
                            <h4 className="font-semibold text-sm mb-2">태그</h4>
                            <div className="flex flex-wrap gap-1">
                              {selectedPost.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </>
                      )}

                      <Separator />

                      <div className="space-y-2">
                        <Button className="w-full" size="sm">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          댓글 작성
                        </Button>
                        {selectedPost.category === "qna" && !selectedPost.isAnswered && (
                          <Button variant="outline" className="w-full" size="sm">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            답변 작성
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>게시글을 선택하면</p>
                      <p>상세 내용을 확인할 수 있습니다</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* 글쓰기 다이얼로그 */}
      <Dialog open={isWriteDialogOpen} onOpenChange={setIsWriteDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>새 게시글 작성</DialogTitle>
            <DialogDescription>질문이나 의견을 자유롭게 작성해주세요.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleWritePost}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="category">카테고리 *</Label>
                <Select
                  value={newPost.category}
                  onValueChange={(value: "qna" | "faq" | "guide") => setNewPost({ ...newPost, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="카테고리를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="qna">Q&A - 질문과 답변</SelectItem>
                    <SelectItem value="faq">FAQ - 자주 묻는 질문</SelectItem>
                    <SelectItem value="guide">사용법 - 가이드 및 안내</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="title">제목 *</Label>
                <Input
                  id="title"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  placeholder="제목을 입력해주세요"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="content">내용 *</Label>
                <Textarea
                  id="content"
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  placeholder="내용을 입력해주세요"
                  rows={8}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="tags">태그 (선택사항)</Label>
                <Input
                  id="tags"
                  value={newPost.tags}
                  onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                  placeholder="태그를 쉼표로 구분하여 입력해주세요 (예: 분석, 오류, 사용법)"
                />
                <p className="text-xs text-gray-500">태그는 검색 시 도움이 됩니다</p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsWriteDialogOpen(false)}>
                취소
              </Button>
              <Button type="submit">작성완료</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
