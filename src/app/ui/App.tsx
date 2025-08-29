import { Header } from "@/common/components/Header/Header.tsx"
import { useAppSelector } from "@/common/hooks/useAppSelector.ts"
import { getTheme } from "@/common/theme/theme.ts"
import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
import { selectThemeMode, setIsLoggedIn } from "../model/app-slice.ts"
import { ErrorSnackBar } from "@/common/components"
import { Routing } from "@/common/routing/Routing.tsx"
import { useAppDispatch } from "@/common/hooks"
import { useEffect, useState } from "react"
import { CircularProgress } from "@mui/material"
import styles from "./App.module.css"
import { useMeQuery } from "@/features/auth/api/authApi.ts"
import { ResultCode } from "@/common/enums"

export const App = () => {
  const [init, setInit] = useState(false)
  const themeMode = useAppSelector(selectThemeMode)
  const dispatch = useAppDispatch()

  const { data, isLoading } = useMeQuery()

  const theme = getTheme(themeMode)

  useEffect(() => {
    if (!isLoading) {
      if (data?.resultCode === ResultCode.Success) {
        dispatch(setIsLoggedIn({ isLoggedIn: true }))
      }
      setInit(true)
    }
  }, [isLoading])

  if (!init) {
    return (
      <div className={styles.circularProgressContainer}>
        <CircularProgress size={150} thickness={3} />
      </div>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <div className={styles.app}>
        <CssBaseline />
        <Header />
        <Routing />
        <ErrorSnackBar />
      </div>
    </ThemeProvider>
  )
}
