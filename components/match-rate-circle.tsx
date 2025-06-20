"use client"

import { useState, useEffect } from "react"

interface MatchRateCircleProps {
  rate: number
}

// 적합도에 따른 원형 진행률 컴포넌트를 CSS conic-gradient 방식으로 변경
export const MatchRateCircle = ({ rate }: MatchRateCircleProps) => {
  const [animatedRate, setAnimatedRate] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setIsAnimating(true)
    setAnimatedRate(0)

    const duration = 1500 // 1.5초 애니메이션
    const startTime = Date.now()
    const startRate = 0

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // easeOutCubic 이징 함수로 부드러운 애니메이션
      const easeProgress = 1 - Math.pow(1 - progress, 3)
      const currentRate = Math.round(startRate + (rate - startRate) * easeProgress)

      setAnimatedRate(currentRate)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setIsAnimating(false)
      }
    }

    // 약간의 지연 후 애니메이션 시작
    const timeout = setTimeout(() => {
      requestAnimationFrame(animate)
    }, 200)

    return () => {
      clearTimeout(timeout)
    }
  }, [rate])

  const getConicGradient = (rate: number) => {
    const percentage = rate / 100
    const angle = percentage * 360
    if (rate >= 90) {
      return `conic-gradient(from 0deg, #007bff 0deg, #7f00ff ${angle * 0.5}deg, #00bcd4 ${angle}deg, transparent ${angle}deg)`
    }
    const color = rate >= 80 ? "#3b82f6" : rate >= 70 ? "#f59e0b" : "#ef4444"
    return `conic-gradient(from 0deg, ${color} 0deg, ${color} ${angle}deg, transparent ${angle}deg)`
  }

  return (
    <div className="relative w-28 h-28 mx-auto">
      {/* 메인 원형 진행률 바 */}
      <div
        className="relative w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300"
        style={{
          background: `${getConicGradient(animatedRate)}`,
          transform: "scaleX(-1)", // 반시계방향으로 변경
        }}
      >
        {/* 내부 흰색 원 (게이지 두께 줄이기 위해 크기 증가) */}
        <div
          className="w-24 h-24 bg-white rounded-full flex items-center justify-center"
          style={{
            transform: "scaleX(-1)", // 텍스트 원래대로 복원
          }}
        >
          {/* 중앙 텍스트 */}
          <div className="text-center">
            <span
              className={`text-2xl font-bold transition-all duration-300 ${
                animatedRate >= 90
                  ? "bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent"
                  : animatedRate >= 80
                    ? "text-blue-600"
                    : animatedRate >= 70
                      ? "text-orange-600"
                      : "text-red-600"
              }`}
              style={
                animatedRate >= 90
                  ? {
                      filter: "drop-shadow(0 0 4px rgba(0, 123, 255, 0.3))",
                      animation: "subtle-glow 3s ease-in-out infinite",
                    }
                  : {}
              }
            >
              {animatedRate}%
            </span>
            {animatedRate >= 90 && !isAnimating && (
              <div
                className="text-xs font-medium mt-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent animate-fade-in"
                style={{
                  animation: "subtle-glow 3s ease-in-out infinite 0.5s, fade-in 0.5s ease-out",
                }}
              >
                EXCELLENT
              </div>
            )}
          </div>
        </div>

        {/* 90% 이상일 때 회전하는 빛 효과 */}
        {animatedRate >= 90 && !isAnimating && (
          <div
            className="absolute inset-0 rounded-full opacity-60"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.8) 10%, transparent 20%, transparent 80%, rgba(255,255,255,0.8) 90%, transparent 100%)",
              animation: "spin-counterclockwise 4s linear infinite",
              transform: "scaleX(-1)", // 반시계방향 맞추기
            }}
          />
        )}
      </div>

      {/* 애니메이션 CSS 추가 */}
      <style jsx>{`
        @keyframes subtle-glow {
          0%, 100% { 
            filter: drop-shadow(0 0 2px rgba(0, 123, 255, 0.3)); 
          }
          50% { 
            filter: drop-shadow(0 0 8px rgba(0, 123, 255, 0.6)); 
          }
        }
        @keyframes spin-counterclockwise {
          from { transform: scaleX(-1) rotate(0deg); }
          to { transform: scaleX(-1) rotate(-360deg); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
