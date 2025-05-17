export interface Student {
  _id: string
  id: string // Alias for _id
  firstName: string
  lastName: string
  email: string
  studentId: string
  dateOfBirth: string
  gender: string
  address: string
  phoneNumber: string
  enrollmentDate: string
  graduationDate?: string
  department: string
  program: string
  status: 'active' | 'inactive' | 'graduated' | 'suspended'
  avatar?: string
}
