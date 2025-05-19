import { Box } from '@chakra-ui/react'
import { Outlet } from 'react-router'

export default function RootLayout() {
  return (
    <Box minH="100vh" bg="gray.50">
      <Outlet />
    </Box>
  )
}
