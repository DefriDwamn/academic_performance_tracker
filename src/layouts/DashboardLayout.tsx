'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Box,
  Flex,
  Container,
  Heading,
  Text,
  IconButton,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  VStack,
  HStack,
  Divider,
  useColorModeValue,
  useBreakpointValue,
} from '@chakra-ui/react'
import { HamburgerIcon, ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons'
import {
  BookOpen,
  Calendar,
  BarChartIcon as ChartBar,
  Home,
  LogOut,
  User,
  Users,
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { AnimatedElement } from '../components/common/AnimatedElement'
import { PageTransition } from '../components/common/PageTransition'

export default function DashboardLayout() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { user, logout } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()
  const [pageTitle, setPageTitle] = useState('Dashboard')

  const isDesktop = useBreakpointValue({ base: false, lg: true })
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  useEffect(() => {
    // Set page title based on current route
    const path = location.pathname.split('/').pop() || 'dashboard'
    setPageTitle(path.charAt(0).toUpperCase() + path.slice(1))
  }, [location])

  const handleLogout = () => {
    logout()
    navigate('/auth/login')
  }

  const NavItem = ({
    icon,
    children,
    to,
    ...rest
  }: {
    icon: React.ReactElement
    children: React.ReactNode
    to: string
  }) => {
    const isActive =
      location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(`${to}/`))
    return (
      <Link to={to} style={{ textDecoration: 'none', width: '100%' }}>
        <Flex
          align="center"
          p="3"
          mx="2"
          borderRadius="md"
          role="group"
          cursor="pointer"
          bg={isActive ? 'brand.50' : 'transparent'}
          color={isActive ? 'brand.600' : 'inherit'}
          fontWeight={isActive ? 'medium' : 'normal'}
          _hover={{
            bg: 'brand.50',
            color: 'brand.600',
          }}
          {...rest}
        >
          {icon && (
            <Box mr="3" color={isActive ? 'brand.600' : 'gray.500'}>
              {icon}
            </Box>
          )}
          {children}
          {isActive && <ChevronRightIcon ml="auto" boxSize={4} />}
        </Flex>
      </Link>
    )
  }

  const SidebarContent = () => (
    <Box
      bg={bgColor}
      borderRight="1px"
      borderRightColor={borderColor}
      w={{ base: 'full', lg: '250px' }}
      h="full"
      py={4}
    >
      <VStack align="stretch" spacing={1}>
        <Box px={4} mb={6}>
          <Heading size="md" color="brand.600">
            Academic Tracker
          </Heading>
        </Box>

        <NavItem icon={<Home size={18} />} to="/dashboard">
          Dashboard
        </NavItem>

        {user?.role === 'STUDENT' ? (
          <>
            <NavItem icon={<BookOpen size={18} />} to="/dashboard/grades">
              My Grades
            </NavItem>
            <NavItem icon={<Calendar size={18} />} to="/dashboard/attendance">
              My Attendance
            </NavItem>
            <NavItem icon={<ChartBar size={18} />} to="/dashboard/analytics">
              My Analytics
            </NavItem>
            <NavItem icon={<User size={18} />} to="/dashboard/profile">
              Profile
            </NavItem>
          </>
        ) : (
          <>
            <NavItem icon={<Users size={18} />} to="/dashboard/students">
              Students
            </NavItem>
            <NavItem icon={<BookOpen size={18} />} to="/dashboard/grades">
              Grades
            </NavItem>
            <NavItem icon={<Calendar size={18} />} to="/dashboard/attendance">
              Attendance
            </NavItem>
            <NavItem icon={<ChartBar size={18} />} to="/dashboard/analytics">
              Analytics
            </NavItem>
          </>
        )}

        <Divider my={4} />

        <NavItem icon={<ChartBar size={18} />} onClick={handleLogout}>
          Logout
        </NavItem>
      </VStack>
    </Box>
  )

  return (
    <Flex h="100vh" flexDirection="column">
      {/* Header */}
      <Flex
        as="header"
        align="center"
        justify="space-between"
        py={4}
        px={6}
        bg={bgColor}
        borderBottomWidth="1px"
        borderBottomColor={borderColor}
        boxShadow="sm"
      >
        <AnimatedElement animation="fadeIn">
          <Flex align="center">
            {!isDesktop && (
              <IconButton
                aria-label="Open menu"
                icon={<HamburgerIcon />}
                variant="ghost"
                onClick={onOpen}
                mr={4}
              />
            )}
            <Heading size="md" display={{ base: 'none', md: 'block' }}>
              {pageTitle}
            </Heading>
          </Flex>
        </AnimatedElement>

        <AnimatedElement animation="fadeIn" delay={200}>
          <HStack spacing={4}>
            <Menu>
              <MenuButton as={Box} cursor="pointer">
                <HStack>
                  <Avatar size="sm" name={user?.name} src={user?.avatar} bg="brand.500" />
                  <Box display={{ base: 'none', md: 'block' }}>
                    <Text fontWeight="medium" fontSize="sm">
                      {user?.name}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {user?.role === 'STUDENT' ? 'Student' : 'Administrator'}
                    </Text>
                  </Box>
                  <ChevronDownIcon />
                </HStack>
              </MenuButton>
              <MenuList>
                {user?.role === 'STUDENT' && (
                  <MenuItem as={Link} to="/dashboard/profile">
                    Profile
                  </MenuItem>
                )}
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </AnimatedElement>
      </Flex>

      {/* Main Content */}
      <Flex flex="1" overflow="hidden">
        {/* Sidebar - desktop */}
        {isDesktop && (
          <AnimatedElement animation="slideIn" w="250px">
            <SidebarContent />
          </AnimatedElement>
        )}

        {/* Sidebar - mobile */}
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Menu</DrawerHeader>
            <DrawerBody p={0}>
              <SidebarContent />
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        {/* Page Content */}
        <Box flex="1" p={6} overflow="auto">
          <Container maxW="container.xl">
            <PageTransition>
              <Outlet />
            </PageTransition>
          </Container>
        </Box>
      </Flex>
    </Flex>
  )
}
