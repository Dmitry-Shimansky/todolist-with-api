import { Route, Routes } from "react-router"
import { Main } from "@/app/ui/Main.tsx"
import { Login } from "@/features/auth/ui/Login/Login.tsx"
import { PageNotFound } from "@/common/components"
import { PrivateRoutes } from "@/common/components/PrivateRoutes/PrivateRoutes.tsx"
import { useAppSelector } from "@/common/hooks"
import { selectIsLoggedIn } from "@/app/model/app-slice.ts"

export const Path = {
  Main: "/",
  Login: "/login",
  NotFound: "*",
} as const

export const Routing = () => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn)

  return (
    <Routes>
      <Route element={<PrivateRoutes isAllowed={isLoggedIn} />}>
        <Route path={Path.Main} element={<Main />} />
      </Route>
      <Route element={<PrivateRoutes isAllowed={!isLoggedIn} redirectPath={Path.Main} />}>
        <Route path={Path.Login} element={<Login />} />
      </Route>
      // Для children
      {/*<Route*/}
      {/*  path={Path.Login}*/}
      {/*  element={*/}
      {/*    <PrivateRoutes isAllowed={!isLoggedIn} redirectPath={Path.Main}>*/}
      {/*      <Login />*/}
      {/*    </PrivateRoutes>*/}
      {/*  }*/}
      {/*/>*/}
      <Route path={Path.NotFound} element={<PageNotFound />} />
    </Routes>
  )
}
