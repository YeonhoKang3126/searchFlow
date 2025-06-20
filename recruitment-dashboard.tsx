"use client"

import { DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Calendar,
  Users,
  Briefcase,
  GraduationCap,
  Plus,
  Edit,
  Trash2,
  MapPin,
  FileText,
  Search,
  ChevronDown,
  ChevronUp,
  Loader2,
  BookOpen,
  Filter,
  SortAsc,
  SortDesc,
  Mail,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRecruitmentDashboard } from "@/hooks/useRecruitmentDashboard"
import { getDaysRemaining, getMatchInfo } from "@/utils/recruitment"
import { MatchRateCircle } from "@/components/match-rate-circle"

export default function RecruitmentDashboard() {
  const {
    // State
    candidates,
    selectedOrderId,
    selectedCandidate,
    selectedOrder,
    newOrder,
    setNewOrder,
    isDialogOpen,
    setIsDialogOpen,
    isEditMode,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    filterBy,
    setFilterBy,
    filteredAndSortedOrders,

    // Handlers
    handleOrderSelect,
    handleCandidateSelect,
    handleDeleteCandidate,
    handleAnalyzeOrder,
    handleToggleExpand,
    handleAddOrder,
    openDialog,
    handleEditOrder,
    handleDeleteOrder,
    handleCloseOrder,
  } = useRecruitmentDashboard()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Job Orders Panel */}
      <Card className="lg:col-span-1 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              채용오더 ({filteredAndSortedOrders.length})
            </CardTitle>
            {/* 정렬 및 필터 버튼들 */}
            <div className="flex items-center gap-2">
              {/* 정렬 버튼 */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0 border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-700"
                  >
                    {sortOrder === "desc" ? <SortDesc className="h-4 w-4" /> : <SortAsc className="h-4 w-4" />}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      setSortBy("date")
                      setSortOrder("desc")
                    }}
                    className={sortBy === "date" && sortOrder === "desc" ? "bg-gray-100" : ""}
                  >
                    최신순
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      setSortBy("date")
                      setSortOrder("asc")
                    }}
                    className={sortBy === "date" && sortOrder === "asc" ? "bg-gray-100" : ""}
                  >
                    오래된순
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      setSortBy("candidates")
                      setSortOrder("desc")
                    }}
                    className={sortBy === "candidates" && sortOrder === "desc" ? "bg-gray-100" : ""}
                  >
                    후보자 순
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      setSortBy("deadline")
                      setSortOrder("asc")
                    }}
                    className={sortBy === "deadline" && sortOrder === "asc" ? "bg-gray-100" : ""}
                  >
                    마감기한 순
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* 필터 버튼 */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0 border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-700"
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      setFilterBy("all")
                    }}
                    className={filterBy === "all" ? "bg-gray-100" : ""}
                  >
                    전체
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      setFilterBy("active")
                    }}
                    className={filterBy === "active" ? "bg-gray-100" : ""}
                  >
                    진행중
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      setFilterBy("completed")
                    }}
                    className={filterBy === "completed" ? "bg-gray-100" : ""}
                  >
                    완료
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      setFilterBy("closed")
                    }}
                    className={filterBy === "closed" ? "bg-gray-100" : ""}
                  >
                    마감
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      setFilterBy("urgent")
                    }}
                    className={filterBy === "urgent" ? "bg-gray-100" : ""}
                  >
                    긴급
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0 border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-700 group"
                onClick={openDialog}
              >
                <Plus className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
              </Button>
            </div>
          </div>
          <CardDescription>현재 진행 중인 채용오더들</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 max-h-[768px] overflow-y-auto">
          {filteredAndSortedOrders.map((order) => (
            <div
              key={order.id}
              className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg relative ${
                selectedOrderId === order.id
                  ? "border-blue-500 bg-blue-50 shadow-blue-200/50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handleOrderSelect(order.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-sm pr-8">{order.positionTitle}</h3>
                <div className="flex flex-col items-end gap-1 min-w-0 flex-shrink-0">
                  <div className="flex items-center gap-1">
                    {order.isUrgent && (
                      <Badge variant="destructive" className="text-xs">
                        긴급
                      </Badge>
                    )}
                    <div
                      className="relative"
                      title={
                        order.status === "active" && order.deadline
                          ? `마감일: ${order.deadline} (${getDaysRemaining(order.deadline)}일 남음)`
                          : order.status === "active" && !order.deadline
                            ? "마감일 미설정"
                            : order.status === "closed" && order.deadline
                              ? `마감일: ${order.deadline} (마감됨)`
                              : undefined
                      }
                    >
                      <Badge
                        variant={
                          order.status === "active" ? "default" : order.status === "completed" ? "secondary" : "outline"
                        }
                        className={`text-xs ${order.status === "closed" ? "bg-gray-500 text-white" : ""}`}
                      >
                        {order.status === "active" ? "진행중" : order.status === "completed" ? "완료" : "마감"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">{order.companyName}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {order.createdAt}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {candidates[order.id]?.length || 0}명
                </div>
              </div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <span className="truncate">{order.careerLevel}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 hover:bg-blue-100"
                    onClick={(e) => handleEditOrder(order, e)}
                  >
                    <Edit className="h-3 w-3 text-gray-500 hover:text-blue-600" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 hover:bg-red-100"
                    onClick={(e) => handleDeleteOrder(order.id, e)}
                  >
                    <Trash2 className="h-3 w-3 text-gray-500 hover:text-red-600" />
                  </Button>
                </div>
              </div>

              {/* 분석 관련 버튼들 */}
              <div className="flex justify-center">
                {order.analysisStatus === "none" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-7"
                    onClick={(e) => handleAnalyzeOrder(order.id, e)}
                  >
                    <Search className="h-3 w-3 mr-1" />
                    분석하기
                  </Button>
                )}

                {order.analysisStatus === "analyzing" && (
                  <Button size="sm" variant="outline" className="text-xs h-7" disabled>
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    분석중...
                  </Button>
                )}

                {order.analysisStatus === "completed" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-7"
                    onClick={(e) => handleToggleExpand(order.id, e)}
                  >
                    {order.isExpanded ? (
                      <>
                        <ChevronUp className="h-3 w-3 mr-1" />
                        접기
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-3 w-3 mr-1" />
                        펼쳐보기
                      </>
                    )}
                  </Button>
                )}
              </div>

              {/* 확장된 분석 결과 */}
              {order.isExpanded && order.analysisData && (
                <div className="mt-4 pt-4 border-t border-gray-200 bg-gray-50/50 rounded-lg p-3 shadow-inner">
                  <div className="space-y-4">
                    {/* 포지션 가이드 섹션 (최상단) */}
                    <div>
                      <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        포지션 가이드
                      </h4>
                      <div className="bg-blue-50 border border-blue-200 rounded-md p-3 shadow-sm">
                        <p className="text-xs text-gray-700 leading-relaxed">{order.analysisData.positionGuide}</p>
                      </div>
                    </div>

                    {/* 키워드 섹션 */}
                    <div>
                      <h4 className="text-xs font-semibold text-gray-700 mb-2">추천 검색 키워드</h4>
                      <div className="flex flex-wrap gap-1">
                        {order.analysisData.keywords.map((keyword, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* 기타 정보 섹션 */}
                    <div>
                      <h4 className="text-xs font-semibold text-gray-700 mb-2">필터링 조건</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500">경력:</span>
                          <span className="ml-1 font-medium">{order.analysisData.otherInfo.experience}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">나이:</span>
                          <span className="ml-1 font-medium">{order.analysisData.otherInfo.age}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">성별:</span>
                          <span className="ml-1 font-medium">{order.analysisData.otherInfo.gender}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">지역:</span>
                          <span className="ml-1 font-medium">{order.analysisData.otherInfo.location}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">학력:</span>
                          <span className="ml-1 font-medium">{order.analysisData.otherInfo.education}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">연봉:</span>
                          <span className="ml-1 font-medium">{order.analysisData.otherInfo.salary}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          {filteredAndSortedOrders.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>{filterBy === "all" ? "등록된 채용오더가 없습니다" : "조건에 맞는 채용오더가 없습니다"}</p>
              <p className="text-sm">
                {filterBy === "all" ? "+ 버튼을 클릭하여 새 오더를 등록하세요" : "다른 필터 조건을 선택해보세요"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Candidates Panel */}
      <Card className="lg:col-span-1 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {selectedOrderId
              ? candidates[selectedOrderId]?.length > 0
                ? `매칭된 후보자 (${candidates[selectedOrderId].length}명)`
                : "채용오더 상세정보"
              : "후보자 정보"}
          </CardTitle>
          <CardDescription>
            {selectedOrderId
              ? candidates[selectedOrderId]?.length > 0
                ? `${selectedOrder?.positionTitle} 포지션의 매칭 후보자들`
                : `${selectedOrder?.positionTitle} 포지션 상세 정보`
              : "채용오더를 선택하면 후보자 정보를 확인할 수 있습니다"}
          </CardDescription>
        </CardHeader>
        <CardContent className="max-h-[768px] overflow-y-auto">
          {selectedOrderId ? (
            candidates[selectedOrderId]?.length > 0 ? (
              // 후보자가 있는 경우: 후보자 목록 표시
              <div className="space-y-4">
                {candidates[selectedOrderId].map((candidate) => {
                  const matchInfo = getMatchInfo(candidate.matchRate)
                  return (
                    <div
                      key={candidate.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg relative ${
                        selectedCandidate?.id === candidate.id
                          ? "border-blue-500 bg-blue-50 shadow-blue-200/50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleCandidateSelect(candidate)}
                    >
                      {/* 기존 후보자 카드 내용 */}
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
                          {candidate.lastName}
                        </div>
                        <div className="flex-1 min-w-0 pr-8">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-base">{candidate.lastName}○○</h3>
                              <span className="text-sm text-gray-500">
                                {candidate.birthYear}년생 ({candidate.age}세)
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-medium text-blue-600">{candidate.matchRate}%</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            <span className="text-sm text-gray-600">{candidate.location}</span>
                          </div>
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-sm text-gray-600">경력 {candidate.experience}</p>
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                candidate.isEmployed
                                  ? "border-orange-300 text-orange-700"
                                  : "border-gray-300 text-gray-600"
                              }`}
                            >
                              {candidate.isEmployed ? "재직중" : "구직중"}
                            </Badge>
                          </div>

                          {/* 새로운 적합도 표시 - 중앙 정렬 */}
                          <div className="flex justify-center">
                            <Badge
                              className={`text-xs ${matchInfo.bgColor} ${matchInfo.textColor} ${matchInfo.borderColor} border px-3 py-1`}
                            >
                              <span className="mr-1">{matchInfo.emoji}</span>
                              {matchInfo.label}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* 삭제 버튼 */}
                      <div className="absolute top-3 right-3">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 hover:bg-red-100"
                          onClick={(e) => handleDeleteCandidate(candidate.id, e)}
                        >
                          <Trash2 className="h-3 w-3 text-gray-500 hover:text-red-600" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              // 후보자가 없는 경우: 채용오더 상세 정보 표시
              selectedOrder && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">기본 정보</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">회사명:</span> {selectedOrder.companyName}
                      </div>
                      <div>
                        <span className="font-medium">포지션:</span> {selectedOrder.positionTitle}
                      </div>
                      <div>
                        <span className="font-medium">경력 요건:</span> {selectedOrder.careerLevel}
                      </div>
                      <div>
                        <span className="font-medium">등록일:</span> {selectedOrder.createdAt}
                      </div>
                      <div>
                        <span className="font-medium">상태:</span>
                        <Badge className="ml-2" variant={selectedOrder.status === "active" ? "default" : "secondary"}>
                          {selectedOrder.status === "active"
                            ? "진행중"
                            : selectedOrder.status === "completed"
                              ? "완료"
                              : "마감"}
                        </Badge>
                      </div>
                      {selectedOrder.deadline && (
                        <div>
                          <span className="font-medium">마감 기한:</span>
                          <span
                            className={`ml-1 ${
                              selectedOrder.deadline < new Date().toISOString().split("T")[0]
                                ? "text-red-600 font-medium"
                                : ""
                            }`}
                          >
                            {selectedOrder.deadline}
                          </span>
                        </div>
                      )}
                      {selectedOrder.isUrgent && (
                        <div>
                          <span className="font-medium">긴급 여부:</span>
                          <Badge variant="destructive" className="ml-2 text-xs">
                            긴급 채용
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {selectedOrder.responsibilities && (
                    <>
                      <div>
                        <h4 className="font-semibold mb-3">주요 업무</h4>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedOrder.responsibilities}</p>
                      </div>
                      <Separator />
                    </>
                  )}

                  {selectedOrder.qualifications && (
                    <>
                      <div>
                        <h4 className="font-semibold mb-3">자격 요건</h4>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedOrder.qualifications}</p>
                      </div>
                      <Separator />
                    </>
                  )}

                  {selectedOrder.preferentialTreatment && (
                    <>
                      <div>
                        <h4 className="font-semibold mb-3">우대 사항</h4>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {selectedOrder.preferentialTreatment}
                        </p>
                      </div>
                      <Separator />
                    </>
                  )}

                  {selectedOrder.otherInfo && (
                    <div>
                      <h4 className="font-semibold mb-3">기타 정보</h4>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedOrder.otherInfo}</p>
                    </div>
                  )}
                </div>
              )
            )
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>채용오더를 선택해주세요</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details Panel */}
      <Card className="lg:col-span-1 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          {selectedCandidate && (
            <>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                후보자 상세 정보
              </CardTitle>
              <CardDescription>{selectedCandidate.lastName}○○님의 상세 정보</CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent className="max-h-[768px] overflow-y-auto">
          {selectedCandidate ? (
            // 후보자가 선택된 경우: 후보자 상세 정보 표시
            <div className="space-y-6">
              {/* 기존 후보자 상세 정보 내용 */}
              <div className="flex items-start gap-6">
                <div className="flex-1">
                  <h3 className="font-semibold text-xl mb-2">{selectedCandidate.lastName}○○</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      {selectedCandidate.birthYear}년생 ({selectedCandidate.age}세)
                    </p>
                    <p>경력 {selectedCandidate.experience}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      <span className="text-xs">{selectedCandidate.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-3 w-3 text-gray-400" />
                      <span className="text-xs">{selectedCandidate.isEmployed ? "현재 재직중" : "구직중"}</span>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <div className="scale-75 origin-top-right drop-shadow-lg">
                    <MatchRateCircle rate={selectedCandidate.matchRate} />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3">최종학력</h4>
                <div className="flex items-center gap-2 text-sm">
                  <GraduationCap className="h-4 w-4 text-gray-500" />
                  <span>{selectedCandidate.education}</span>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3">보유 기술</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCandidate.skills.map((skill: string) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3">매칭 분석 결과</h4>
                <div className="space-y-2">
                  {selectedCandidate.matchReasons.map((reason, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          selectedCandidate.isMatch ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      <span className="text-gray-700">{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Button className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  제안서 작성
                </Button>
                <Button variant="outline" className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  추천 이메일 작성
                </Button>
              </div>
            </div>
          ) : (
            // 후보자가 선택되지 않은 경우: 완전히 빈 상태
            <div></div>
          )}
        </CardContent>
      </Card>

      {/* Dialog 컴포넌트 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "채용오더 수정" : "채용오더 등록"}</DialogTitle>
            <DialogDescription>
              {isEditMode ? "채용오더 정보를 수정해주세요." : "새로운 채용오더 정보를 입력해주세요."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddOrder}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="companyName">회사명 *</Label>
                <Textarea
                  id="companyName"
                  value={newOrder.companyName}
                  onChange={(e) => setNewOrder({ ...newOrder, companyName: e.target.value })}
                  placeholder="회사명을 입력해주세요"
                  rows={2}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="positionTitle">포지션명 *</Label>
                <Textarea
                  id="positionTitle"
                  value={newOrder.positionTitle}
                  onChange={(e) => setNewOrder({ ...newOrder, positionTitle: e.target.value })}
                  placeholder="포지션명을 입력해주세요"
                  rows={2}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="careerLevel">경력 요건</Label>
                <Textarea
                  id="careerLevel"
                  value={newOrder.careerLevel}
                  onChange={(e) => setNewOrder({ ...newOrder, careerLevel: e.target.value })}
                  placeholder="필요한 경력 요건을 입력해주세요"
                  rows={3}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="responsibilities">주요 업무</Label>
                <Textarea
                  id="responsibilities"
                  value={newOrder.responsibilities}
                  onChange={(e) => setNewOrder({ ...newOrder, responsibilities: e.target.value })}
                  placeholder="주요 업무 내용을 입력해주세요"
                  rows={4}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="qualifications">자격 요건</Label>
                <Textarea
                  id="qualifications"
                  value={newOrder.qualifications}
                  onChange={(e) => setNewOrder({ ...newOrder, qualifications: e.target.value })}
                  placeholder="필수 자격 요건을 입력해주세요"
                  rows={4}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="preferentialTreatment">우대 사항</Label>
                <Textarea
                  id="preferentialTreatment"
                  value={newOrder.preferentialTreatment}
                  onChange={(e) => setNewOrder({ ...newOrder, preferentialTreatment: e.target.value })}
                  placeholder="우대 사항을 입력해주세요"
                  rows={3}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="otherInfo">기타 정보</Label>
                <Textarea
                  id="otherInfo"
                  value={newOrder.otherInfo}
                  onChange={(e) => setNewOrder({ ...newOrder, otherInfo: e.target.value })}
                  placeholder="위에서 명시되지 않은 추가 정보를 입력해주세요"
                  rows={3}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="deadline">마감 기한 (선택사항)</Label>
                <input
                  type="date"
                  id="deadline"
                  value={newOrder.deadline}
                  onChange={(e) => setNewOrder({ ...newOrder, deadline: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <p className="text-xs text-gray-500">기한을 설정하지 않으면 무기한 진행중 상태로 유지됩니다.</p>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isUrgent"
                  checked={newOrder.isUrgent}
                  onChange={(e) => setNewOrder({ ...newOrder, isUrgent: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <Label
                  htmlFor="isUrgent"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  긴급 채용
                </Label>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="memo">내부 메모 (비공개)</Label>
                <Textarea
                  id="memo"
                  value={newOrder.memo}
                  onChange={(e) => setNewOrder({ ...newOrder, memo: e.target.value })}
                  placeholder="고객사 내부 요청사항을 입력해주세요. 예: 선호 성별, 나이 제한, 특별 요구사항 등"
                  rows={2}
                  className="text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  ※ 이 메모는 후보자 매칭 정확도를 높이는 용도로 사용되며 외부에 노출되지 않습니다.
                </p>
              </div>
            </div>
            <DialogFooter>
              <div className="flex justify-center gap-2 w-full">
                <Button type="submit">{isEditMode ? "수정" : "등록"}</Button>
                {isEditMode && (
                  <Button type="button" variant="destructive" onClick={handleCloseOrder}>
                    마감
                  </Button>
                )}
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Footer 추가 */}
      <footer className="bg-white border-t border-gray-200 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center text-sm text-gray-500">
            © 2025 <span className="gradient-text font-semibold">searchFlow</span> - AI-Powered smart tool
          </div>
        </div>
      </footer>
    </div>
  )
}
