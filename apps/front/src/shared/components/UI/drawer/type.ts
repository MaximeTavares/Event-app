import { type ReactNode } from "react"

export type MenuItem = {
  label: string
  isSearch?: boolean
  icon: ReactNode
  path: string
  tooltip?: string
}