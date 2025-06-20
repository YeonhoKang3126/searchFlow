import type { JobPostingOrder, Candidate, AnalysisData } from "@/types/recruitment"

// UUID 생성 함수
export const generateId = (): string => {
  return "JP-" + Math.random().toString(36).substr(2, 9) + "-" + Date.now().toString(36)
}

// localStorage 관련 유틸리티 함수들
const STORAGE_KEY = "jobPostingOrders"
const CANDIDATES_STORAGE_KEY = "candidates"

export const saveToLocalStorage = (orders: JobPostingOrder[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
  } catch (error) {
    console.error("Failed to save to localStorage:", error)
  }
}

export const loadFromLocalStorage = (): JobPostingOrder[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error("Failed to load from localStorage:", error)
  }
  return getInitialOrders()
}

export const saveCandidatesToLocalStorage = (candidates: Record<string, Candidate[]>): void => {
  try {
    localStorage.setItem(CANDIDATES_STORAGE_KEY, JSON.stringify(candidates))
  } catch (error) {
    console.error("Failed to save candidates to localStorage:", error)
  }
}

export const loadCandidatesFromLocalStorage = (): Record<string, Candidate[]> => {
  try {
    const stored = localStorage.getItem(CANDIDATES_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error("Failed to load candidates from localStorage:", error)
  }
  return getInitialCandidates()
}

// Mock n8n API 호출 함수
export const analyzeJobOrder = async (order: JobPostingOrder): Promise<AnalysisData> => {
  // 실제로는 n8n webhook으로 데이터 전송
  // const response = await fetch('YOUR_N8N_WEBHOOK_URL', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(order)
  // })

  // Mock 데이터로 시뮬레이션 (3초 지연)
  await new Promise((resolve) => setTimeout(resolve, 3000))

  // 포지션에 따른 Mock 분석 결과
  const mockAnalysisData: AnalysisData = {
    positionGuide:
      "React와 TypeScript를 활용한 프론트엔드 개발 전문가를 찾고 있습니다. 사용자 인터페이스 구현과 웹 애플리케이션 개발 경험이 풍부하며, 팀과의 협업 능력이 뛰어난 시니어급 개발자가 적합합니다. 최신 프론트엔드 기술 트렌드에 관심이 많고 지속적인 학습 의지가 있는 분을 우대합니다.",
    keywords: [
      "React",
      "TypeScript",
      "Next.js",
      "JavaScript",
      "Frontend",
      "웹개발",
      "UI/UX",
      "반응형",
      "컴포넌트",
      "상태관리",
    ],
    otherInfo: {
      experience: "3-7년",
      age: "25-35세",
      gender: "무관",
      location: "서울/경기 선호",
      education: "대졸 이상",
      salary: "5000-8000만원",
    },
  }

  return mockAnalysisData
}

// 매칭률에 따른 적합도 정보를 반환하는 함수
export const getMatchInfo = (matchRate: number) => {
  if (matchRate >= 90) {
    return {
      label: "Strong match",
      emoji: "⭐",
      bgColor: "bg-emerald-100",
      textColor: "text-emerald-800",
      borderColor: "border-emerald-200",
    }
  } else if (matchRate >= 80) {
    return {
      label: "Good fit",
      emoji: "✅",
      bgColor: "bg-green-100",
      textColor: "text-green-800",
      borderColor: "border-green-200",
    }
  } else if (matchRate >= 70) {
    return {
      label: "Suitable",
      emoji: "👌",
      bgColor: "bg-lime-100",
      textColor: "text-lime-800",
      borderColor: "border-lime-200",
    }
  } else if (matchRate >= 50) {
    return {
      label: "Borderline",
      emoji: "⚠️",
      bgColor: "bg-orange-100",
      textColor: "text-orange-800",
      borderColor: "border-orange-200",
    }
  } else {
    return {
      label: "Not suitable",
      emoji: "❌",
      bgColor: "bg-red-100",
      textColor: "text-red-800",
      borderColor: "border-red-200",
    }
  }
}

// 남은 일수 계산 함수
export const getDaysRemaining = (deadline: string): number => {
  const today = new Date()
  const deadlineDate = new Date(deadline)
  const diffTime = deadlineDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

// 초기 샘플 데이터 (새로운 형식으로 변환)
export const getInitialOrders = (): JobPostingOrder[] => [
  {
    id: "JP-001", // 고정 ID로 변경
    companyName: "TechCorp",
    positionTitle: "Senior Frontend Developer",
    careerLevel: "5년 이상",
    responsibilities: "React 기반 웹 애플리케이션 개발, UI/UX 구현, 코드 리뷰",
    qualifications: "React, TypeScript, Next.js 경험 필수",
    preferentialTreatment: "AWS 경험, 팀 리딩 경험",
    otherInfo: "연봉 ₩60,000,000 - ₩80,000,000, 서울 근무",
    status: "active",
    createdAt: "2025-01-15",
    deadline: "2025-03-15",
    isUrgent: true,
    isExpanded: false,
    analysisStatus: "none",
  },
  {
    id: "JP-002", // 고정 ID로 변경
    companyName: "StartupXYZ",
    positionTitle: "Product Manager",
    careerLevel: "3년 이상",
    responsibilities: "제품 기획, 로드맵 수립, 개발팀과의 협업",
    qualifications: "제품 기획 경험, 데이터 분석 능력",
    preferentialTreatment: "스타트업 경험, Agile 방법론 경험",
    otherInfo: "연봉 ₩55,000,000 - ₩70,000,000, 부산 근무",
    status: "active",
    createdAt: "2025-01-10",
    deadline: "2025-04-10",
    isUrgent: false,
    isExpanded: false,
    analysisStatus: "none",
  },
  {
    id: "JP-003", // 고정 ID로 변경
    companyName: "DesignStudio",
    positionTitle: "UX Designer",
    careerLevel: "2년 이상",
    responsibilities: "사용자 경험 설계, 프로토타입 제작, 사용성 테스트",
    qualifications: "Figma, Adobe XD 사용 능력",
    preferentialTreatment: "포트폴리오 우수자, 디자인 시스템 구축 경험",
    otherInfo: "연봉 ₩45,000,000 - ₩60,000,000, 원격 근무",
    status: "closed",
    createdAt: "2024-01-08",
    deadline: "2024-01-20",
    isUrgent: false,
    isExpanded: false,
    analysisStatus: "none",
  },
  {
    id: "JP-004", // 고정 ID로 변경
    companyName: "FinTech Solutions",
    positionTitle: "Backend Developer",
    careerLevel: "4년 이상",
    responsibilities: "API 설계 및 개발, 데이터베이스 최적화, 마이크로서비스 아키텍처 구축",
    qualifications: "Java, Spring Boot, MySQL 경험 필수",
    preferentialTreatment: "Kubernetes, Docker 경험, 금융권 프로젝트 경험",
    otherInfo: "연봉 ₩65,000,000 - ₩85,000,000, 서울 강남구 근무",
    status: "active",
    createdAt: "2025-01-18",
    deadline: "2025-02-28",
    isUrgent: true,
    isExpanded: false,
    analysisStatus: "none",
  },
  {
    id: "JP-005", // 고정 ID로 변경
    companyName: "Global Commerce",
    positionTitle: "DevOps Engineer",
    careerLevel: "3년 이상",
    responsibilities: "CI/CD 파이프라인 구축, 클라우드 인프라 관리, 모니터링 시스템 운영",
    qualifications: "AWS, Docker, Kubernetes 경험",
    preferentialTreatment: "Terraform, Jenkins 경험, 대용량 트래픽 처리 경험",
    otherInfo: "연봉 ₩58,000,000 - ₩75,000,000, 판교 근무, 재택근무 가능",
    status: "active",
    createdAt: "2025-01-20",
    isUrgent: false,
    isExpanded: false,
    analysisStatus: "none",
  },
  {
    id: "JP-006", // 고정 ID로 변경
    companyName: "AI Research Lab",
    positionTitle: "Machine Learning Engineer",
    careerLevel: "5년 이상",
    responsibilities: "ML 모델 개발 및 배포, 데이터 파이프라인 구축, 모델 성능 최적화",
    qualifications: "Python, TensorFlow, PyTorch 경험 필수",
    preferentialTreatment: "논문 발표 경험, MLOps 경험, 컴퓨터 비전 분야 경험",
    otherInfo: "연봉 ₩80,000,000 - ₩120,000,000, 서울 서초구 근무",
    status: "active",
    createdAt: "2025-01-12",
    deadline: "2025-03-31",
    isUrgent: false,
    isExpanded: false,
    analysisStatus: "none",
  },
]

// 후보자 데이터 (채용오더 ID 기반으로 변경)
export const getInitialCandidates = (): Record<string, Candidate[]> => {
  const result: Record<string, Candidate[]> = {}

  // 첫 번째 채용오더 (Senior Frontend Developer)에 후보자 할당
  result["JP-001"] = [
    {
      id: 101,
      lastName: "김",
      birthYear: 1990,
      age: 35,
      location: "서울시 강남구",
      experience: "6년",
      isEmployed: true,
      matchRate: 92,
      isMatch: true,
      education: "서울대학교 컴퓨터공학과 학사",
      skills: ["React", "TypeScript", "Next.js", "Node.js", "AWS"],
      matchReasons: [
        "React 및 TypeScript 6년 경험으로 기술 요구사항 완벽 부합",
        "Next.js 프로젝트 다수 경험으로 즉시 업무 투입 가능",
        "AWS 클라우드 경험으로 우대사항 해당",
        "서울 거주로 출퇴근 용이",
      ],
    },
    {
      id: 102,
      lastName: "이",
      birthYear: 1988,
      age: 37,
      location: "서울시 서초구",
      experience: "8년",
      isEmployed: false,
      matchRate: 88,
      isMatch: true,
      education: "연세대학교 정보시스템학과 학사",
      skills: ["Vue.js", "JavaScript", "Python", "AWS", "Docker"],
      matchReasons: [
        "8년 풍부한 개발 경험으로 시니어 레벨 요구사항 충족",
        "AWS 클라우드 경험으로 우대사항 해당",
        "구직중으로 빠른 입사 가능",
        "서울 거주로 근무지 접근성 우수",
      ],
    },
    {
      id: 103,
      lastName: "박",
      birthYear: 1992,
      age: 33,
      location: "경기도 성남시",
      experience: "4년",
      isEmployed: true,
      matchRate: 65,
      isMatch: false,
      education: "KAIST 전산학부 학사",
      skills: ["React", "Angular", "MongoDB", "Express"],
      matchReasons: [
        "경력 4년으로 요구사항 5년 이상에 미달",
        "React 경험은 있으나 TypeScript 경험 부족",
        "경기도 거주로 출퇴근 시간 소요",
      ],
    },
    {
      id: 104,
      lastName: "송",
      birthYear: 1995,
      age: 30,
      location: "대구시 중구",
      experience: "1년",
      isEmployed: false,
      matchRate: 35,
      isMatch: false,
      education: "지방대학교 경영학과 학사",
      skills: ["HTML", "CSS", "jQuery", "PHP"],
      matchReasons: [
        "경력 1년으로 요구사항 5년 이상에 크게 미달",
        "React, TypeScript 경험 전무",
        "프론트엔드 전문 기술 스택 부족",
        "지역적 거리로 인한 출퇴근 어려움",
      ],
    },
  ]

  // 두 번째 채용오더 (Product Manager)에 후보자 할당
  result["JP-002"] = [
    {
      id: 201,
      lastName: "최",
      birthYear: 1987,
      age: 38,
      location: "부산시 해운대구",
      experience: "7년",
      isEmployed: true,
      matchRate: 85,
      isMatch: true,
      education: "고려대학교 경영학과 학사",
      skills: ["Product Strategy", "Agile", "Data Analysis", "Figma", "Jira"],
      matchReasons: [
        "7년 제품 기획 경험으로 요구사항 충족",
        "Agile 방법론 경험으로 우대사항 해당",
        "부산 거주로 근무지 접근성 우수",
        "데이터 분석 능력 및 협업 도구 활용 능력 보유",
      ],
    },
    {
      id: 202,
      lastName: "정",
      birthYear: 1991,
      age: 34,
      location: "부산시 남구",
      experience: "5년",
      isEmployed: false,
      matchRate: 78,
      isMatch: true,
      education: "부산대학교 산업공학과 학사",
      skills: ["Product Management", "SQL", "Tableau", "Slack"],
      matchReasons: [
        "5년 제품 관리 경험으로 요구사항 충족",
        "데이터 분석 도구 활용 능력 보유",
        "구직중으로 즉시 입사 가능",
        "부산 지역 거주로 근무 환경 적합",
      ],
    },
  ]

  // 네 번째 채용오더 (Backend Developer)에 후보자 할당
  result["JP-004"] = [
    {
      id: 401,
      lastName: "강",
      birthYear: 1989,
      age: 36,
      location: "서울시 강남구",
      experience: "7년",
      isEmployed: true,
      matchRate: 94,
      isMatch: true,
      education: "서강대학교 컴퓨터공학과 학사",
      skills: ["Java", "Spring Boot", "MySQL", "Redis", "Kubernetes", "Docker"],
      matchReasons: [
        "Java, Spring Boot 7년 경험으로 기술 요구사항 완벽 부합",
        "Kubernetes, Docker 경험으로 우대사항 해당",
        "대용량 데이터베이스 최적화 경험 보유",
        "서울 강남구 거주로 출퇴근 최적",
      ],
    },
    {
      id: 402,
      lastName: "윤",
      birthYear: 1993,
      age: 32,
      location: "서울시 송파구",
      experience: "5년",
      isEmployed: false,
      matchRate: 89,
      isMatch: true,
      education: "한양대학교 소프트웨어학과 학사",
      skills: ["Java", "Spring", "PostgreSQL", "Docker", "AWS"],
      matchReasons: [
        "Java, Spring 5년 경험으로 요구사항 충족",
        "Docker, AWS 경험으로 우대사항 해당",
        "구직중으로 빠른 입사 가능",
        "서울 거주로 근무지 접근성 우수",
      ],
    },
    {
      id: 403,
      lastName: "조",
      birthYear: 1985,
      age: 40,
      location: "경기도 분당구",
      experience: "12년",
      isEmployed: true,
      matchRate: 91,
      isMatch: true,
      education: "KAIST 전산학부 석사",
      skills: ["Java", "Spring Boot", "Oracle", "MySQL", "Microservices"],
      matchReasons: [
        "12년 풍부한 백엔드 개발 경험",
        "마이크로서비스 아키텍처 구축 경험 보유",
        "금융권 프로젝트 다수 경험",
        "시니어급 기술 리더십 보유",
      ],
    },
  ]

  // 다섯 번째 채용오더 (DevOps Engineer)에 후보자 할당
  result["JP-005"] = [
    {
      id: 501,
      lastName: "한",
      birthYear: 1990,
      age: 35,
      location: "경기도 성남시",
      experience: "6년",
      isEmployed: true,
      matchRate: 87,
      isMatch: true,
      education: "성균관대학교 정보통신공학과 학사",
      skills: ["AWS", "Docker", "Kubernetes", "Terraform", "Jenkins", "Python"],
      matchReasons: [
        "AWS, Docker, Kubernetes 6년 경험으로 기술 요구사항 완벽 부합",
        "Terraform, Jenkins 경험으로 우대사항 해당",
        "판교 근무지와 인접한 성남 거주",
        "대용량 트래픽 처리 경험 보유",
      ],
    },
    {
      id: 502,
      lastName: "오",
      birthYear: 1992,
      age: 33,
      location: "서울시 강서구",
      experience: "4년",
      isEmployed: false,
      matchRate: 82,
      isMatch: true,
      education: "중앙대학교 컴퓨터공학과 학사",
      skills: ["AWS", "Docker", "GitLab CI", "Monitoring", "Linux"],
      matchReasons: [
        "AWS, Docker 4년 경험으로 요구사항 충족",
        "CI/CD 파이프라인 구축 경험 보유",
        "구직중으로 즉시 입사 가능",
        "재택근무 선호로 근무 방식 적합",
      ],
    },
  ]

  // 여섯 번째 채용오더 (Machine Learning Engineer)에 후보자 할당
  result["JP-006"] = [
    {
      id: 601,
      lastName: "임",
      birthYear: 1986,
      age: 39,
      location: "서울시 서초구",
      experience: "8년",
      isEmployed: true,
      matchRate: 96,
      isMatch: true,
      education: "서울대학교 컴퓨터공학과 박사",
      skills: ["Python", "TensorFlow", "PyTorch", "MLOps", "Computer Vision", "AWS"],
      matchReasons: [
        "Python, TensorFlow, PyTorch 8년 전문 경험",
        "MLOps 및 컴퓨터 비전 분야 우대사항 해당",
        "다수 논문 발표 경험으로 연구 역량 입증",
        "서초구 거주로 출퇴근 최적",
      ],
    },
    {
      id: 602,
      lastName: "신",
      birthYear: 1988,
      age: 37,
      location: "서울시 관악구",
      experience: "6년",
      isEmployed: false,
      matchRate: 88,
      isMatch: true,
      education: "연세대학교 수학과 석사",
      skills: ["Python", "Scikit-learn", "TensorFlow", "Pandas", "Jupyter"],
      matchReasons: [
        "Python, TensorFlow 6년 경험으로 요구사항 충족",
        "수학 전공 배경으로 모델링 역량 우수",
        "구직중으로 빠른 입사 가능",
        "서울 거주로 근무지 접근성 우수",
      ],
    },
  ]

  return result
}
