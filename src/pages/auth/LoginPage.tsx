'use client'

import { useState } from 'react'
import { useNavigate } from 'react-router'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '../../store/authStore'
import { AnimatedElement } from '../../components/common/AnimatedElement'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading, error } = useAuthStore()
  const navigate = useNavigate()
  const toast = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      const success = await login(data.email, data.password)
      if (success) {
        navigate('/dashboard')
        toast({
          title: 'Login successful',
          status: 'success',
          duration: 2000,
          isClosable: true,
        })
      }
    } catch (err) {
      // Error is handled by the store
    }
  }

  return (
    <AnimatedElement animation="fadeIn">
      <VStack spacing={6} align="stretch">
        <Box textAlign="center">
          <Heading size="lg" mb={2}>
            Welcome Back
          </Heading>
          <Text color="gray.600">Sign in to your account</Text>
        </Box>

        {error && (
          <Box p={3} bg="red.50" color="red.500" borderRadius="md">
            {error}
          </Box>
        )}

        <Box as="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <VStack spacing={4} align="stretch">
            <FormControl isInvalid={!!errors.email}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="your.email@example.com"
                {...register('email')}
                autoComplete="username"
              />
              <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.password}>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  {...register('password')}
                  autoComplete="current-password"
                />
                <InputRightElement>
                  <IconButton
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
            </FormControl>

            <Button
              type="submit"
              colorScheme="brand"
              size="lg"
              isLoading={isLoading}
              loadingText="Signing in"
              w="full"
              mt={4}
            >
              Sign In
            </Button>
          </VStack>
        </Box>

        {/* Demo credentials */}
        <Box mt={6} p={4} bg="gray.50" borderRadius="md">
          <Text fontSize="sm" fontWeight="medium" mb={2}>
            Demo Credentials
          </Text>
          <VStack align="stretch" spacing={1} fontSize="xs">
            <Text>
              <strong>Student:</strong> student1..10@example.com / password123
            </Text>
            <Text>
              <strong>Administrator:</strong> admin@example.com / admin123
            </Text>
          </VStack>
        </Box>
      </VStack>
    </AnimatedElement>
  )
}
