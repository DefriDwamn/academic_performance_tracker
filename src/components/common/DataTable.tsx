'use client'

import type React from 'react'

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  Flex,
  Input,
  Select,
  Text,
  Skeleton,
  HStack,
  IconButton,
} from '@chakra-ui/react'
import { type ReactNode, useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon } from '@chakra-ui/icons'

interface Column<T> {
  header: string
  accessor: keyof T | ((item: T) => ReactNode)
  isNumeric?: boolean
}

interface DataTableProps<T extends Record<string, any>> {
  columns: Column<T>[]
  data: T[]
  isLoading?: boolean
  keyExtractor: (item: T) => string
  onRowClick?: (item: T) => void
  searchable?: boolean
  sortable?: boolean
  pagination?: boolean
  itemsPerPageOptions?: number[]
  defaultItemsPerPage?: number
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  isLoading = false,
  keyExtractor,
  onRowClick,
  searchable = true,
  sortable = true,
  pagination = true,
  itemsPerPageOptions = [10, 25, 50, 100],
  defaultItemsPerPage = 10,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage)

  // Filter data based on search term
  const filteredData = searchTerm
    ? data.filter((item) =>
        Object.values(item).some(
          (value) => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : data

  // Sort data based on sort column and direction
  const sortedData = sortColumn
    ? [...filteredData].sort((a, b) => {
        const aValue = a[sortColumn]
        const bValue = b[sortColumn]

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue)
        }

        if (aValue === bValue) return 0
        if (sortDirection === 'asc') {
          return aValue > bValue ? 1 : -1
        } else {
          return aValue < bValue ? 1 : -1
        }
      })
    : filteredData

  // Paginate data
  const totalPages = Math.ceil(sortedData.length / itemsPerPage)
  const paginatedData = pagination
    ? sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : sortedData

  const handleSort = (column: keyof T) => {
    if (!sortable) return

    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1) // Reset to first page on search
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value))
    setCurrentPage(1) // Reset to first page when changing items per page
  }

  return (
    <Box>
      {searchable && (
        <Flex mb={4}>
          <Box position="relative" w="full" maxW="md">
            <Input placeholder="Search..." value={searchTerm} onChange={handleSearch} pl={10} />
            <Box position="absolute" left={3} top="50%" transform="translateY(-50%)">
              <SearchIcon color="gray.400" />
            </Box>
          </Box>
        </Flex>
      )}

      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              {columns.map((column, index) => (
                <Th
                  key={`header-${column.header}-${index}`}
                  isNumeric={column.isNumeric}
                  cursor={sortable ? 'pointer' : 'default'}
                  onClick={() => {
                    if (typeof column.accessor === 'string') {
                      handleSort(column.accessor)
                    }
                  }}
                >
                  {column.header}
                  {sortable &&
                    typeof column.accessor === 'string' &&
                    sortColumn === column.accessor && (
                      <Text as="span" ml={1}>
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </Text>
                    )}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {isLoading ? (
              Array.from({ length: itemsPerPage }).map((_, index) => (
                <Tr key={`skeleton-row-${index}`}>
                  {columns.map((_, colIndex) => (
                    <Td key={`skeleton-cell-${index}-${colIndex}`}>
                      <Skeleton height="20px" />
                    </Td>
                  ))}
                </Tr>
              ))
            ) : paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <Tr
                  key={`row-${keyExtractor(item)}`}
                  _hover={{ bg: 'gray.50' }}
                  cursor={onRowClick ? 'pointer' : 'default'}
                  onClick={() => onRowClick && onRowClick(item)}
                >
                  {columns.map((column, colIndex) => (
                    <Td key={`cell-${keyExtractor(item)}-${colIndex}`} isNumeric={column.isNumeric}>
                      {typeof column.accessor === 'function'
                        ? column.accessor(item)
                        : (item[column.accessor] as ReactNode)}
                    </Td>
                  ))}
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={columns.length} textAlign="center" py={6}>
                  No data available
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>

      {pagination && totalPages > 0 && (
        <Flex justify="space-between" align="center" mt={4} direction={{ base: 'column', md: 'row' }} gap={4}>
          <HStack>
            <Text>Rows per page:</Text>
            <Select value={itemsPerPage} onChange={handleItemsPerPageChange} size="sm" w="70px">
              {itemsPerPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </HStack>

          <HStack>
            <Text display={{ base: 'none', md: 'block' }}>
              {currentPage} of {totalPages}
            </Text>
            <Text display={{ base: 'block', md: 'none' }}>
              Page {currentPage}/{totalPages}
            </Text>
            <IconButton
              icon={<ChevronLeftIcon />}
              aria-label="Previous page"
              isDisabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              size="sm"
            />
            <IconButton
              icon={<ChevronRightIcon />}
              aria-label="Next page"
              isDisabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              size="sm"
            />
          </HStack>
        </Flex>
      )}
    </Box>
  )
}
