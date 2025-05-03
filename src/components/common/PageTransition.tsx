"use client"

import { type ReactNode, useRef, useEffect } from "react"
import { Box } from "@chakra-ui/react"
import anime from "animejs"

interface PageTransitionProps {
  children: ReactNode
}

export const PageTransition = ({ children }: PageTransitionProps) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      anime({
        targets: ref.current,
        opacity: [0, 1],
        translateY: [10, 0],
        easing: "easeOutExpo",
        duration: 500,
      })
    }
  }, [])

  return (
    <Box ref={ref} opacity={0}>
      {children}
    </Box>
  )
}
