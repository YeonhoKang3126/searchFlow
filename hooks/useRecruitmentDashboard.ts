"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import type { JobPostingOrder, Candidate } from "@/types/recruitment"
import {
  loadFromLocalStorage,
  saveToLocalStorage,
  loadCandidatesFromLocalStorage,
  saveCandidatesToLocalStorage,
  generateId,
  analyzeJobOrder,
} from "@/utils/recruitment"

export const useRecruitmentDashboard = () => {
  const [jobOrders, setJobOrders] = useState<JobPostingOrder[]>([])
  const [candidates, setCandidates] = useState<Record<string, Candidate[]>>({})
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [newOrder, setNewOrder] = useState({
    companyName: "",
    positionTitle: "",
    careerLevel: "",
    responsibilities: "",
    qualifications: "",
    preferentialTreatment: "",
    otherInfo: "",
    memo: "",
    deadline: "",
    isUrgent: false,
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingOrder, setEditingOrder] = useState<JobPostingOrder | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [sortBy, setSortBy] = useState<"date" | "candidates" | "deadline">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [filterBy, setFilterBy] = useState<"all" | "active" | "completed" | "closed" | "urgent">("all")

  // 컴포넌트 마운트 시 localStorage에서 데이터 로드
  useEffect(() => {
    const loadedOrders = loadFromLocalStorage()
    const loadedCandidates = loadCandidatesFromLocalStorage()
    setJobOrders(loadedOrders)
    setCandidates(loadedCandidates)
  }, [])

  // 기한 체크 및 상태 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      const today = new Date().toISOString().split("T")[0]
      setJobOrders((prevOrders) => {
        const updatedOrders = prevOrders.map((order) => {
          if (order.deadline && order.deadline < today && order.status === "active") {
            return { ...order, status: "closed" as const }
          }
          return order
        })

        const hasChanges = updatedOrders.some((order, index) => order.status !== prevOrders[index]?.status)
        if (hasChanges) {
          saveToLocalStorage(updatedOrders)
          return updatedOrders
        }
        return prevOrders
      })
    }, 60000) // 1분마다 체크

    return () => clearInterval(interval)
  }, [])

  // 정렬 및 필터링된 채용오더 계산
  const filteredAndSortedOrders = useMemo(() => {
    let filtered = [...jobOrders] // 배열 복사

    // 필터링
    if (filterBy !== "all") {
      if (filterBy === "urgent") {
        filtered = filtered.filter((order) => order.isUrgent)
      } else {
        filtered = filtered.filter((order) => order.status === filterBy)
      }
    }

    // 정렬
    const sorted = filtered.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "date":
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
        case "candidates":
          const aCandidates = candidates[a.id]?.length || 0
          const bCandidates = candidates[b.id]?.length || 0
          comparison = aCandidates - bCandidates
          break
        case "deadline":
          const aDeadline = a.deadline || "9999-12-31"
          const bDeadline = b.deadline || "9999-12-31"
          comparison = aDeadline.localeCompare(bDeadline)
          break
        default:
          comparison = 0
      }

      return sortOrder === "asc" ? comparison : -comparison
    })

    return sorted
  }, [jobOrders, candidates, sortBy, sortOrder, filterBy])

  const selectedOrder = jobOrders.find((order) => order.id === selectedOrderId)

  const handleOrderSelect = (orderId: string) => {
    // 다른 채용오더 선택 시 모든 카드 접기
    const updatedOrders = jobOrders.map((order) => ({
      ...order,
      isExpanded: false,
    }))
    setJobOrders(updatedOrders)
    saveToLocalStorage(updatedOrders)

    setSelectedOrderId(orderId)
    setSelectedCandidate(null) // 후보자 선택 해제
  }

  const handleCandidateSelect = (candidate: Candidate) => {
    setSelectedCandidate(candidate)
  }

  const handleDeleteCandidate = (candidateId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm("정말로 이 후보자를 삭제하시겠습니까?")) {
      const updatedCandidates = { ...candidates }

      // 모든 채용오더에서 해당 후보자 제거
      Object.keys(updatedCandidates).forEach((orderId) => {
        updatedCandidates[orderId] = updatedCandidates[orderId].filter((candidate) => candidate.id !== candidateId)
      })

      setCandidates(updatedCandidates)
      saveCandidatesToLocalStorage(updatedCandidates)

      // 현재 선택된 후보자가 삭제된 후보자라면 선택 해제
      if (selectedCandidate?.id === candidateId) {
        setSelectedCandidate(null)
      }
    }
  }

  // 분석하기 버튼 클릭 핸들러
  const handleAnalyzeOrder = async (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation()

    const order = jobOrders.find((o) => o.id === orderId)
    if (!order) return

    // 분석 중 상태로 변경
    const updatedOrders = jobOrders.map((o) => (o.id === orderId ? { ...o, analysisStatus: "analyzing" as const } : o))
    setJobOrders(updatedOrders)
    saveToLocalStorage(updatedOrders)

    try {
      // n8n API 호출 (Mock)
      const analysisData = await analyzeJobOrder(order)

      // 분석 완료 상태로 변경
      const finalUpdatedOrders = jobOrders.map((o) =>
        o.id === orderId
          ? {
              ...o,
              analysisStatus: "completed" as const,
              analysisData: analysisData,
            }
          : o,
      )
      setJobOrders(finalUpdatedOrders)
      saveToLocalStorage(finalUpdatedOrders)
    } catch (error) {
      console.error("Analysis failed:", error)
      // 에러 시 원래 상태로 복원
      const revertedOrders = jobOrders.map((o) => (o.id === orderId ? { ...o, analysisStatus: "none" as const } : o))
      setJobOrders(revertedOrders)
      saveToLocalStorage(revertedOrders)
    }
  }

  // 펼쳐보기/접기 토글 핸들러
  const handleToggleExpand = (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation()

    const updatedOrders = jobOrders.map((o) => (o.id === orderId ? { ...o, isExpanded: !o.isExpanded } : o))
    setJobOrders(updatedOrders)
    saveToLocalStorage(updatedOrders)
  }

  const handleAddOrder = (e: React.FormEvent) => {
    e.preventDefault()

    if (newOrder.companyName && newOrder.positionTitle) {
      let updatedOrders: JobPostingOrder[]

      if (isEditMode && editingOrder) {
        // 수정 모드
        updatedOrders = jobOrders.map((order) =>
          order.id === editingOrder.id
            ? {
                ...order,
                companyName: newOrder.companyName,
                positionTitle: newOrder.positionTitle,
                careerLevel: newOrder.careerLevel,
                responsibilities: newOrder.responsibilities,
                qualifications: newOrder.qualifications,
                preferentialTreatment: newOrder.preferentialTreatment,
                otherInfo: newOrder.otherInfo,
                memo: newOrder.memo,
                deadline: newOrder.deadline || undefined,
                isUrgent: newOrder.isUrgent,
              }
            : order,
        )
      } else {
        // 새 등록 모드
        const newJobOrder: JobPostingOrder = {
          id: generateId(),
          companyName: newOrder.companyName,
          positionTitle: newOrder.positionTitle,
          careerLevel: newOrder.careerLevel,
          responsibilities: newOrder.responsibilities,
          qualifications: newOrder.qualifications,
          preferentialTreatment: newOrder.preferentialTreatment,
          otherInfo: newOrder.otherInfo,
          status: "active",
          createdAt: new Date().toISOString().split("T")[0],
          deadline: newOrder.deadline || undefined,
          isUrgent: newOrder.isUrgent,
          isExpanded: false,
          memo: newOrder.memo,
          analysisStatus: "none",
        }
        updatedOrders = [...jobOrders, newJobOrder]
      }

      // 상태 업데이트 및 localStorage 저장
      setJobOrders(updatedOrders)
      saveToLocalStorage(updatedOrders)

      // 상태 초기화
      setNewOrder({
        companyName: "",
        positionTitle: "",
        careerLevel: "",
        responsibilities: "",
        qualifications: "",
        preferentialTreatment: "",
        otherInfo: "",
        memo: "",
        deadline: "",
        isUrgent: false,
      })
      setIsDialogOpen(false)
      setIsEditMode(false)
      setEditingOrder(null)
    }
  }

  const openDialog = () => {
    setIsEditMode(false)
    setEditingOrder(null)
    setNewOrder({
      companyName: "",
      positionTitle: "",
      careerLevel: "",
      responsibilities: "",
      qualifications: "",
      preferentialTreatment: "",
      otherInfo: "",
      memo: "",
      deadline: "",
      isUrgent: false,
    })
    setIsDialogOpen(true)
  }

  const handleEditOrder = (order: JobPostingOrder, e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditMode(true)
    setEditingOrder(order)
    setNewOrder({
      companyName: order.companyName,
      positionTitle: order.positionTitle,
      careerLevel: order.careerLevel,
      responsibilities: order.responsibilities,
      qualifications: order.qualifications,
      preferentialTreatment: order.preferentialTreatment,
      otherInfo: order.otherInfo,
      memo: order.memo || "",
      deadline: order.deadline || "",
      isUrgent: order.isUrgent || false,
    })
    setIsDialogOpen(true)
  }

  const handleDeleteOrder = (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm("정말로 이 채용오더를 삭제하시겠습니까?")) {
      const updatedOrders = jobOrders.filter((order) => order.id !== orderId)
      setJobOrders(updatedOrders)
      saveToLocalStorage(updatedOrders)

      if (selectedOrderId === orderId) {
        setSelectedOrderId(null)
        setSelectedCandidate(null)
      }
    }
  }

  const handleCloseOrder = () => {
    if (editingOrder && window.confirm("이 채용오더를 마감 처리하시겠습니까?")) {
      const updatedOrders = jobOrders.map((order) =>
        order.id === editingOrder.id ? { ...order, status: "closed" as const } : order,
      )
      setJobOrders(updatedOrders)
      saveToLocalStorage(updatedOrders)
      setIsDialogOpen(false)
      setIsEditMode(false)
      setEditingOrder(null)
    }
  }

  return {
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
  }
}
