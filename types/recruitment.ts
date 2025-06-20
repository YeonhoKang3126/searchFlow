// 분석 결과 데이터 인터페이스
export interface AnalysisData {
  positionGuide: string // 포지션 가이드 추가
  keywords: string[]
  otherInfo: {
    experience: string
    age: string
    gender: string
    location: string
    education: string
    salary: string
  }
}

// 채용오더 인터페이스 정의 (분석 관련 필드 추가)
export interface JobPostingOrder {
  id: string
  companyName: string
  positionTitle: string
  careerLevel: string
  responsibilities: string
  qualifications: string
  preferentialTreatment: string
  otherInfo: string
  status: "active" | "completed" | "closed" // "closed" 상태 추가
  createdAt: string
  deadline?: string // 마감 기한 (선택사항)
  isUrgent: boolean // 긴급 여부
  isExpanded: boolean
  memo?: string
  analysisStatus: "none" | "analyzing" | "completed"
  analysisData?: AnalysisData
}

// 후보자 인터페이스 정의
export interface Candidate {
  id: number
  lastName: string // 성만 표시 (예: "김")
  birthYear: number // 출생연도
  age: number // 나이
  location: string // 거주지
  experience: string // 경력
  isEmployed: boolean // 현재 재직 여부
  matchRate: number // 적합도 퍼센테이지 (0-100)
  isMatch: boolean // 적합/부적합 여부
  education: string // 최종학력
  skills: string[]
  matchReasons: string[] // 적합 결과 핵심 이유들
}
