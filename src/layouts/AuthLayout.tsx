import { Outlet } from 'react-router'
import { Box, Container, Flex, Heading, Text } from '@chakra-ui/react'
import { AnimatedElement } from '../components/common/AnimatedElement'

export default function AuthLayout() {
  return (
    <Flex minH="100vh" direction="column">
      <Box as="header" py={4} bg="white" boxShadow="sm">
        <Container maxW="container.xl">
          <AnimatedElement animation="fadeIn">
            <Heading size="md" color="brand.600">
              Academic Performance Tracker
            </Heading>
          </AnimatedElement>
        </Container>
      </Box>

      <Flex flex="1" align="center" justify="center" p={4}>
        <Container maxW="md">
          <AnimatedElement animation="slideUp" delay={300}>
            <Box bg="white" p={8} borderRadius="lg" boxShadow="md">
              <Outlet />
            </Box>
          </AnimatedElement>
        </Container>
      </Flex>

      <Box as="footer" py={4} textAlign="center" bg="white" borderTop="1px" borderColor="gray.100">
        <Container maxW="container.xl">
          <AnimatedElement animation="fadeIn" delay={600}>
            <Text fontSize="sm" color="gray.500">
              © {new Date().getFullYear()} Academic Performance Tracker. All rights reserved.
            </Text>
          </AnimatedElement>
        </Container>
      </Box>
    </Flex>
  )
}
