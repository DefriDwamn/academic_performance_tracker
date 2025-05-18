import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
  disableTransitionOnChange: false,
}

export const theme = extendTheme({
  config,
  styles: {
    global: (props: { colorMode: 'light' | 'dark' }) => ({
      body: {
        bg: props.colorMode === 'light' ? 'gray.50' : 'gray.900',
        color: props.colorMode === 'light' ? 'gray.800' : 'whiteAlpha.900',
      },
    }),
  },
  colors: {
    brand: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
  },
  fonts: {
    heading: 'Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: '500',
        borderRadius: 'md',
      },
      variants: {
        primary: {
          bg: 'brand.600',
          color: 'white',
          _hover: {
            bg: 'brand.700',
          },
        },
      },
    },
    Input: {
      variants: {
        outline: (props: { colorMode: 'light' | 'dark' }) => ({
          field: {
            bg: props.colorMode === 'light' ? 'white' : 'gray.700',
            borderColor: props.colorMode === 'light' ? 'gray.200' : 'gray.600',
            _hover: {
              borderColor: props.colorMode === 'light' ? 'gray.300' : 'gray.500',
            },
            _focus: {
              borderColor: 'brand.500',
              boxShadow: `0 0 0 1px var(--chakra-colors-brand-500)`,
            },
          },
        }),
      },
    },
    FormLabel: {
      baseStyle: (props: { colorMode: 'light' | 'dark' }) => ({
        color: props.colorMode === 'light' ? 'gray.700' : 'gray.200',
      }),
    },
  },
})
