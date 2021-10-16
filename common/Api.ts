import { ReactNode } from 'react'

interface Api {
  environment: {
    tagPrefix: string
    displayName: string
  }
  version: string
  dialog: () => void
  getLink: (url: string, contents: ReactNode) => ReactNode
  additionalRoutes?: ReactNode
}

export default Api
