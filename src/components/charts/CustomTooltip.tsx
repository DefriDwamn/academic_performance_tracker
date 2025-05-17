import { Box, Text } from '@chakra-ui/react'

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    color: string
  }>
  label?: string
}

export const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <Box
        bg="white"
        p={3}
        borderRadius="md"
        boxShadow="md"
        maxW="200px"
        wordBreak="break-word"
      >
        <Text fontWeight="bold" mb={1}>{label}</Text>
        {payload.map((entry, index) => (
          <Text key={index} color={entry.color}>
            {entry.name}: {entry.value}%
          </Text>
        ))}
      </Box>
    )
  }
  return null
} 