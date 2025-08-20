import { Navigate, Outlet } from "react-router"
import { ReactNode } from "react"
import { Path } from "@/common/routing"

type Props = {
  children?: ReactNode
  isAllowed: boolean
  redirectPath?: string
}

export const PrivateRoutes = ({ children, isAllowed, redirectPath = Path.Login }: Props) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} />
  }
  return children ?? <Outlet />
}
