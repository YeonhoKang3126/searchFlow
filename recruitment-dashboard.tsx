"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { MapPin, Calendar, DollarSign, Users, Star, Mail, Phone, Briefcase, GraduationCap } from "lucide-react"

// Sample data
const positions = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp",
    location: "Seoul, Korea",
    salary: "₩60,000,000 - ₩80,000,000",
    type: "Full-time",
    posted: "2024-01-15",
    candidates: 12,
    status: "active",
  },
  {
    id: 2,
    title: "Product Manager",
    company: "StartupXYZ",
    location: "Busan, Korea",
    salary: "₩55,000,000 - ₩70,000,000",
    type: "Full-time",
    posted: "2024-01-10",
    candidates: 8,
    status: "active",
  },
  {
    id: 3,
    title: "UX Designer",
    company: "DesignStudio",
    location: "Remote",
    salary: "₩45,000,000 - ₩60,000,000",
    type: "Contract",
    posted: "2024-01-08",
    candidates: 15,
    status: "active",
  },
]

const candidates = {
  1: [
    {
      id: 101,
      name: "김민수",
      email: "minsu.kim@email.com",
      phone: "+82-10-1234-5678",
      experience: "5년",
      skills: ["React", "TypeScript", "Next.js", "Node.js"],
      education: "서울대학교 컴퓨터공학과",
      rating: 4.8,
      status: "interested",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 102,
      name: "이지은",
      email: "jieun.lee@email.com",
      phone: "+82-10-2345-6789",
      experience: "7년",
      skills: ["Vue.js", "JavaScript", "Python", "AWS"],
      education: "연세대학교 정보시스템학과",
      rating: 4.9,
      status: "applied",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 103,
      name: "박준호",
      email: "junho.park@email.com",
      phone: "+82-10-3456-7890",
      experience: "4년",
      skills: ["React", "Angular", "MongoDB", "Express"],
      education: "KAIST 전산학부",
      rating: 4.7,
      status: "reviewing",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ],
  2: [
    {
      id: 201,
      name: "최수영",
      email: "suyoung.choi@email.com",
      phone: "+82-10-4567-8901",
      experience: "6년",
      skills: ["Product Strategy", "Agile", "Data Analysis", "Figma"],
      education: "고려대학교 경영학과",
      rating: 4.6,
      status: "interested",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ],
  3: [
    {
      id: 301,
      name: "정하늘",
      email: "haneul.jung@email.com",
      phone: "+82-10-5678-9012",
      experience: "3년",
      skills: ["UI/UX Design", "Figma", "Adobe XD", "Prototyping"],
      education: "홍익대학교 시각디자인과",
      rating: 4.8,
      status: "applied",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ],
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "interested":
      return "bg-blue-100 text-blue-800"
    case "applied":
      return "bg-green-100 text-green-800"
    case "reviewing":
      return "bg-yellow-100 text-yellow-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case "interested":
      return "관심 있음"
    case "applied":
      return "지원 완료"
    case "reviewing":
      return "검토 중"
    default:
      return status
  }
}

export default function RecruitmentDashboard() {
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null)
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null)

  const handlePositionSelect = (positionId: number) => {
    setSelectedPosition(positionId)
    setSelectedCandidate(null)
  }

  const handleCandidateSelect = (candidate: any) => {
    setSelectedCandidate(candidate)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">채용 대시보드</h1>
          <p className="text-gray-600 mt-2">포지션별 후보자 매칭 현황을 확인하세요</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Positions Panel */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                포지션 목록
              </CardTitle>
              <CardDescription>현재 진행 중인 채용 포지션들</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {positions.map((position) => (
                <div
                  key={position.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedPosition === position.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handlePositionSelect(position.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-sm">{position.title}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {position.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{position.company}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {position.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {position.candidates}명
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <DollarSign className="h-3 w-3" />
                    {position.salary}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Candidates Panel */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                매칭된 후보자
              </CardTitle>
              <CardDescription>
                {selectedPosition
                  ? `${positions.find((p) => p.id === selectedPosition)?.title} 포지션 후보자`
                  : "포지션을 선택해주세요"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedPosition ? (
                <div className="space-y-4">
                  {candidates[selectedPosition as keyof typeof candidates]?.map((candidate) => (
                    <div
                      key={candidate.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        selectedCandidate?.id === candidate.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleCandidateSelect(candidate)}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={candidate.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{candidate.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-sm truncate">{candidate.name}</h3>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs text-gray-600">{candidate.rating}</span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">경력 {candidate.experience}</p>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {candidate.skills.slice(0, 2).map((skill) => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {candidate.skills.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{candidate.skills.length - 2}
                              </Badge>
                            )}
                          </div>
                          <Badge className={`text-xs ${getStatusColor(candidate.status)}`}>
                            {getStatusText(candidate.status)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>포지션을 선택하면 매칭된 후보자를 확인할 수 있습니다</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Details Panel */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                상세 정보 및 제안 내용
              </CardTitle>
              <CardDescription>
                {selectedCandidate ? `${selectedCandidate.name}님의 상세 정보` : "후보자를 선택해주세요"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedCandidate ? (
                <div className="space-y-6">
                  {/* Candidate Profile */}
                  <div className="text-center">
                    <Avatar className="h-20 w-20 mx-auto mb-4">
                      <AvatarImage src={selectedCandidate.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-lg">{selectedCandidate.name[0]}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-lg">{selectedCandidate.name}</h3>
                    <p className="text-gray-600">경력 {selectedCandidate.experience}</p>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{selectedCandidate.rating}</span>
                      <span className="text-gray-500">/5.0</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Contact Information */}
                  <div>
                    <h4 className="font-semibold mb-3">연락처 정보</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span>{selectedCandidate.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>{selectedCandidate.phone}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Education */}
                  <div>
                    <h4 className="font-semibold mb-3">학력</h4>
                    <div className="flex items-center gap-2 text-sm">
                      <GraduationCap className="h-4 w-4 text-gray-500" />
                      <span>{selectedCandidate.education}</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Skills */}
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

                  {/* Status & Actions */}
                  <div>
                    <h4 className="font-semibold mb-3">현재 상태</h4>
                    <Badge className={`mb-4 ${getStatusColor(selectedCandidate.status)}`}>
                      {getStatusText(selectedCandidate.status)}
                    </Badge>
                    <div className="space-y-2">
                      <Button className="w-full">
                        <Mail className="h-4 w-4 mr-2" />
                        제안서 발송
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Calendar className="h-4 w-4 mr-2" />
                        면접 일정 잡기
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Star className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>후보자를 선택하면 상세 정보를 확인할 수 있습니다</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
