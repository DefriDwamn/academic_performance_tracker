'use client'

import { type ReactNode, useRef, useEffect } from 'react'
import { Box, type BoxProps, useColorModeValue } from '@chakra-ui/react'
import anime from 'animejs'

interface AnimatedElementProps extends BoxProps {
  children: ReactNode
  animation?: 'fadeIn' | 'slideUp' | 'slideIn' | 'scale' | 'pulse'
  delay?: number
  duration?: number
}

export const AnimatedElement = ({
  children,
  animation = 'fadeIn',
  delay = 0,
  duration = 500,
  ...props
}: AnimatedElementProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const bgColor = useColorModeValue('white', 'gray.800')

  useEffect(() => {
    if (!ref.current) return

    let animeConfig: anime.AnimeParams = {
      targets: ref.current,
      easing: 'easeOutExpo',
      duration,
      delay,
    }

    switch (animation) {
      case 'fadeIn':
        animeConfig = {
          ...animeConfig,
          opacity: [0, 1],
        }
        break
      case 'slideUp':
        animeConfig = {
          ...animeConfig,
          opacity: [0, 1],
          translateY: [20, 0],
        }
        break
      case 'slideIn':
        animeConfig = {
          ...animeConfig,
          translateX: ['-100%', 0],
          opacity: [1, 1],
        }
        break
      case 'scale':
        animeConfig = {
          ...animeConfig,
          scale: [0.9, 1],
          opacity: [0, 1],
        }
        break
      case 'pulse':
        animeConfig = {
          ...animeConfig,
          scale: [1, 1.05, 1],
        }
        break
    }

    anime(animeConfig)
  }, [animation, delay, duration])

  return (
    <Box 
      ref={ref} 
      opacity={1}
      bg={bgColor}
      position="relative"
      {...props}
    >
      {children}
    </Box>
  )
}
