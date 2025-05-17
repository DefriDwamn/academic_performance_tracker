'use client'

import { Heading, Text, Button, Center, VStack, Icon } from '@chakra-ui/react'
import { LockIcon } from '@chakra-ui/icons'
import { useNavigate } from 'react-router'

export const NotAuthorized = () => {
  const navigate = useNavigate()

  return (
    <Center h="calc(100vh - 200px)">
      <VStack spacing={6} textAlign="center" p={8}>
        <Icon as={LockIcon} boxSize={16} color="brand.500" />
        <Heading size="xl">Access Denied</Heading>
        <Text fontSize="lg" color="gray.600">
          You don't have permission to access this page.
        </Text>
        <Button colorScheme="brand" onClick={() => navigate('/dashboard')}>
          Go to Dashboard
        </Button>
      </VStack>
    </Center>
  )
}
