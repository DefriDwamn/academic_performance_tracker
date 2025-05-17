'use client'

import { useEffect, useRef } from 'react'
import { Box } from '@chakra-ui/react'
import anime from 'animejs'

interface PageTransitionProps {
  children: React.ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    anime({
      targets: ref.current,
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 300,
      easing: 'easeOutQuad',
    })
  }, [])

  return (
    <Box ref={ref} opacity={0}>
      {children}
    </Box>
  )
}
