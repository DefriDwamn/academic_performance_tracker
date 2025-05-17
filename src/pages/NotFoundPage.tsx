import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react'
import { Link } from 'react-router'
import { AnimatedElement } from '../components/common/AnimatedElement'

export default function NotFoundPage() {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" minH="100vh" p={4}>
      <AnimatedElement animation="fadeIn">
        <VStack spacing={6} textAlign="center">
          <Heading size="4xl" color="brand.500">
            404
          </Heading>
          <Heading size="xl">Page Not Found</Heading>
          <Text fontSize="lg" color="gray.600" maxW="md">
            The page you are looking for doesn't exist or has been moved.
          </Text>
          <Button as={Link} to="/dashboard" colorScheme="brand" size="lg" mt={4}>
            Go to Dashboard
          </Button>
        </VStack>
      </AnimatedElement>
    </Box>
  )
}
