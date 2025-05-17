import 'react-router'

declare module 'react-router' {
  export interface FutureConfig {
    unstable_subResourceIntegrity?: boolean
    unstable_middleware?: boolean
  }
}
