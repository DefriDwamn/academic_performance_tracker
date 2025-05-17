"use client"

import type React from "react"

import { useEffect, useState } from "react"
import {
  Box,
  Heading,
  Card,
  CardHeader,
  CardBody,
  Text,
  SimpleGrid,
  GridItem,
  Flex,
  Avatar,
  Button,
  Divider,
  Stack,
  Badge,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
} from "@chakra-ui/react"
import { EditIcon } from "@chakra-ui/icons"
import { useStudentStore } from "../../store/studentStore"
import { AnimatedElement } from "../../components/common/AnimatedElement"

export default function StudentProfile() {
  const { currentStudent, fetchCurrentStudent, updateStudent, isLoading } = useStudentStore()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [formData, setFormData] = useState({
    phoneNumber: "",
    address: "",
  })

  useEffect(() => {
    fetchCurrentStudent()
  }, [fetchCurrentStudent])

  useEffect(() => {
    if (currentStudent) {
      setFormData({
        phoneNumber: currentStudent.phoneNumber,
        address: currentStudent.address,
      })
    }
  }, [currentStudent])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async () => {
    if (!currentStudent) return

    try {
      await updateStudent(currentStudent.id, formData)
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
        status: "success",
        duration: 2000,
        isClosable: true,
      })
      onClose()
    } catch (error) {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Failed to update profile",
        status: "error",
        duration: 2000,
        isClosable: true,
      })
    }
  }

  if (!currentStudent) {
    return (
      <Box>
        <Heading size="lg" mb={6}>
          My Profile
        </Heading>
        <Card>
          <CardBody>
            <Text>Loading profile information...</Text>
          </CardBody>
        </Card>
      </Box>
    )
  }

  return (
    <Box>
      <AnimatedElement animation="fadeIn">
        <Heading size="lg" mb={6}>
          My Profile
        </Heading>
      </AnimatedElement>

      <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6}>
        <GridItem colSpan={{ base: 1, lg: 1 }}>
          <AnimatedElement animation="slideUp" delay={100}>
            <Card>
              <CardBody>
                <Flex direction="column" align="center" justify="center" py={6}>
                  <Avatar size="2xl" name={`${currentStudent.firstName} ${currentStudent.lastName}`} mb={4} />
                  <Heading size="md">{`${currentStudent.firstName} ${currentStudent.lastName}`}</Heading>
                  <Text color="gray.600" mb={4}>
                    {currentStudent.email}
                  </Text>
                  <Badge colorScheme="brand" px={3} py={1} borderRadius="full" textTransform="capitalize">
                    {currentStudent.status}
                  </Badge>
                  <Button leftIcon={<EditIcon />} mt={6} size="sm" onClick={onOpen}>
                    Edit Contact Info
                  </Button>
                </Flex>
              </CardBody>
            </Card>
          </AnimatedElement>
        </GridItem>

        <GridItem colSpan={{ base: 1, lg: 2 }}>
          <AnimatedElement animation="slideUp" delay={200}>
            <Card>
              <CardHeader>
                <Heading size="md">Personal Information</Heading>
              </CardHeader>
              <CardBody>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <Box>
                    <Text fontWeight="medium" color="gray.500" fontSize="sm">
                      Student ID
                    </Text>
                    <Text>{currentStudent.studentId}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="medium" color="gray.500" fontSize="sm">
                      Date of Birth
                    </Text>
                    <Text>{new Date(currentStudent.dateOfBirth).toLocaleDateString()}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="medium" color="gray.500" fontSize="sm">
                      Gender
                    </Text>
                    <Text textTransform="capitalize">{currentStudent.gender}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="medium" color="gray.500" fontSize="sm">
                      Phone Number
                    </Text>
                    <Text>{currentStudent.phoneNumber}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="medium" color="gray.500" fontSize="sm">
                      Address
                    </Text>
                    <Text>{currentStudent.address}</Text>
                  </Box>
                </SimpleGrid>

                <Divider my={6} />

                <Heading size="sm" mb={4}>
                  Academic Information
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <Box>
                    <Text fontWeight="medium" color="gray.500" fontSize="sm">
                      Department
                    </Text>
                    <Text textTransform="capitalize">{currentStudent.department.replace(/_/g, " ")}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="medium" color="gray.500" fontSize="sm">
                      Program
                    </Text>
                    <Text textTransform="capitalize">{currentStudent.program}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="medium" color="gray.500" fontSize="sm">
                      Enrollment Date
                    </Text>
                    <Text>{new Date(currentStudent.enrollmentDate).toLocaleDateString()}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="medium" color="gray.500" fontSize="sm">
                      Expected Graduation
                    </Text>
                    <Text>
                      {currentStudent.graduationDate
                        ? new Date(currentStudent.graduationDate).toLocaleDateString()
                        : "Not set"}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontWeight="medium" color="gray.500" fontSize="sm">
                      Status
                    </Text>
                    <Badge colorScheme={currentStudent.status === "active" ? "green" : "gray"}>
                      {currentStudent.status}
                    </Badge>
                  </Box>
                </SimpleGrid>
              </CardBody>
            </Card>
          </AnimatedElement>
        </GridItem>
      </SimpleGrid>

      {/* Edit Profile Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Contact Information</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>Phone Number</FormLabel>
                <Input name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} />
              </FormControl>
              <FormControl>
                <FormLabel>Address</FormLabel>
                <Input name="address" value={formData.address} onChange={handleInputChange} />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="brand" onClick={handleSubmit} isLoading={isLoading}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}
