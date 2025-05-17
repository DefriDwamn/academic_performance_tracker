import { Box, Text, useColorModeValue } from '@chakra-ui/react'

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
  const tooltipBg = useColorModeValue('white', 'gray.800')
  const tooltipBorderColor = useColorModeValue('gray.200', 'gray.700')
  const valueTextColor = useColorModeValue('gray.700', 'gray.200')
  const headerBgColor = useColorModeValue('blue.50', 'blue.900')
  const headerTextColor = useColorModeValue('blue.700', 'blue.200')

  if (active && payload && payload.length) {
    // Форматируем заголовок в зависимости от типа данных
    const formattedLabel = (() => {
      if (typeof label === 'string') {
        // Для GPA Trend
        if (label.match(/^[A-Za-z]+\s\d+$/)) {
          return `Semester ${label}`
        }
        // Для Course Performance
        if (label.length > 15) {
          return label.substring(0, 15) + '...'
        }
        return label
      }
      return label
    })()

    return (
      <Box
        bg={tooltipBg}
        borderRadius="md"
        boxShadow="md"
        maxW="200px"
        wordBreak="break-word"
        border="1px solid"
        borderColor={tooltipBorderColor}
        overflow="hidden"
      >
        <Box bg={headerBgColor} p={2} borderBottom="1px solid" borderColor={tooltipBorderColor}>
          <Text fontWeight="bold" fontSize="sm" color={headerTextColor}>
            {formattedLabel}
          </Text>
        </Box>
        <Box p={2}>
          {payload.map((entry, index) => (
            <Text key={index} color={valueTextColor} fontSize="sm">
              {entry.name}: {entry.value}%
            </Text>
          ))}
        </Box>
      </Box>
    )
  }
  return null
}
