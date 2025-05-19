import { Outlet } from 'react-router'
import { Box, Container, Flex, Heading, Text, useColorModeValue } from '@chakra-ui/react'
import { AnimatedElement } from '../components/common/AnimatedElement'

export default function AuthLayout() {
  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.100', 'gray.700')
  const boxShadow = useColorModeValue('sm', 'dark-lg')
  const pageBgColor = useColorModeValue('gray.50', 'gray.900')

  return (
    <Flex minH="100vh" direction="column" bg={pageBgColor}>
      <Box
        as="header"
        py={4}
        bg={bgColor}
        boxShadow={boxShadow}
        borderBottom="1px"
        borderColor={borderColor}
      >
        <Container maxW="container.xl">
          <AnimatedElement animation="fadeIn">
            <Heading size="md" color="brand.600">
              Academic Performance Tracker
            </Heading>
          </AnimatedElement>
        </Container>
      </Box>

      <Flex flex="1" align="center" justify="center" p={4} bg={pageBgColor}>
        <Container maxW="md">
          <AnimatedElement animation="slideUp" delay={300}>
            <Box
              bg={bgColor}
              p={8}
              borderRadius="lg"
              boxShadow={boxShadow}
              borderWidth="1px"
              borderColor={borderColor}
            >
              <Outlet />
            </Box>
          </AnimatedElement>
        </Container>
      </Flex>

      <Box
        as="footer"
        py={4}
        textAlign="center"
        bg={bgColor}
        borderTop="1px"
        borderColor={borderColor}
      >
        <Container maxW="container.xl">
          <AnimatedElement animation="fadeIn" delay={600}>
            <Text fontSize="sm" color={useColorModeValue('gray.500', 'gray.400')}>
              © {new Date().getFullYear()} Academic Performance Tracker. All rights reserved.
            </Text>
          </AnimatedElement>
        </Container>
      </Box>
    </Flex>
  )
}
