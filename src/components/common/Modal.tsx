import {
  Modal as ChakraModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  type ModalProps as ChakraModalProps,
} from '@chakra-ui/react'

interface ModalProps extends Omit<ChakraModalProps, 'children'> {
  title: string
  children: React.ReactNode
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | 'full'
}

export const Modal = ({ title, children, size = 'xl', ...props }: ModalProps) => {
  return (
    <ChakraModal size={size} {...props} isCentered scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent
        mx={{ base: 4, md: 0 }}
        my={{ base: 4, md: 0 }}
        maxH={{ base: '90vh', md: '85vh' }}
      >
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>{children}</ModalBody>
      </ModalContent>
    </ChakraModal>
  )
}
