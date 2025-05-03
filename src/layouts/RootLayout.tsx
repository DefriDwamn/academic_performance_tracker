import { Outlet } from "react-router-dom"
import { Box } from "@chakra-ui/react"

export default function RootLayout() {
  return (
    <Box minH="100vh" bg="gray.50">
      <Outlet />
    </Box>
  )
}
