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
  useColorMode,
  useColorModeValue,
  Tooltip,
  Flex,
} from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon, MoonIcon, SunIcon } from '@chakra-ui/icons'
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
  const { colorMode, toggleColorMode } = useColorMode()

  // Color mode values
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const labelColor = useColorModeValue('gray.700', 'gray.200')
  const inputBgColor = useColorModeValue('white', 'gray.700')
  const inputBorderColor = useColorModeValue('gray.200', 'gray.600')
  const demoBgColor = useColorModeValue('gray.50', 'gray.700')
  const errorBgColor = useColorModeValue('red.50', 'red.900')
  const errorTextColor = useColorModeValue('red.500', 'red.300')

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
      <Flex justifyContent="flex-end" mb={4}>
        <Tooltip label={colorMode === 'light' ? 'Включить темную тему' : 'Включить светлую тему'}>
          <IconButton
            size="sm"
            aria-label="Переключить тему"
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            variant="ghost"
            onClick={toggleColorMode}
          />
        </Tooltip>
      </Flex>
      <VStack spacing={6} align="stretch">
        <Box textAlign="center">
          <Heading size="lg" mb={2} color={useColorModeValue('gray.800', 'white')}>
            Welcome Back
          </Heading>
          <Text color={textColor}>Sign in to your account</Text>
        </Box>

        {error && (
          <Box p={3} bg={errorBgColor} color={errorTextColor} borderRadius="md">
            {error}
          </Box>
        )}

        <Box as="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <VStack spacing={4} align="stretch">
            <FormControl isInvalid={!!errors.email}>
              <FormLabel color={labelColor}>Email</FormLabel>
              <Input
                type="email"
                placeholder="your.email@example.com"
                {...register('email')}
                autoComplete="username"
                bg={inputBgColor}
                borderColor={inputBorderColor}
                _hover={{ borderColor: useColorModeValue('gray.300', 'gray.500') }}
                _focus={{
                  borderColor: 'brand.500',
                  boxShadow: `0 0 0 1px var(--chakra-colors-brand-500)`,
                }}
              />
              <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.password}>
              <FormLabel color={labelColor}>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  {...register('password')}
                  autoComplete="current-password"
                  bg={inputBgColor}
                  borderColor={inputBorderColor}
                  _hover={{ borderColor: useColorModeValue('gray.300', 'gray.500') }}
                  _focus={{
                    borderColor: 'brand.500',
                    boxShadow: `0 0 0 1px var(--chakra-colors-brand-500)`,
                  }}
                />
                <InputRightElement>
                  <IconButton
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    color={useColorModeValue('gray.500', 'gray.400')}
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
        <Box
          mt={6}
          p={4}
          bg={demoBgColor}
          borderRadius="md"
          borderWidth="1px"
          borderColor={inputBorderColor}
        >
          <Text
            fontSize="sm"
            fontWeight="medium"
            mb={2}
            color={useColorModeValue('gray.700', 'gray.200')}
          >
            Demo Credentials
          </Text>
          <VStack align="stretch" spacing={1} fontSize="xs">
            <Text color={textColor}>
              <strong>Student:</strong> student1..10@example.com / password123
            </Text>
            <Text color={textColor}>
              <strong>Administrator:</strong> admin@example.com / admin123
            </Text>
          </VStack>
        </Box>
      </VStack>
    </AnimatedElement>
  )
}
