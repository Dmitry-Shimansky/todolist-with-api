import { Header } from "@/common/components/Header/Header"
import { useAppSelector } from "@/common/hooks/useAppSelector"
import { getTheme } from "@/common/theme/theme"
import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
import { selectThemeMode } from "./app-slice.ts"
import { ErrorSnackBar } from "@/common/components"
import { Routing } from "@/common/routing/Routing.tsx"
import { useAppDispatch } from "@/common/hooks"
import { useEffect, useState } from "react"
import { meTC } from "@/features/auth/model/auth-slice.ts"
import { CircularProgress } from "@mui/material"
import styles from "./App.module.css"

export const App = () => {
  const [init, setInit] = useState(false)
  const themeMode = useAppSelector(selectThemeMode)
  const dispatch = useAppDispatch()

  const theme = getTheme(themeMode)

  useEffect(() => {
    dispatch(meTC())
      .unwrap()
      .finally(() => setInit(true))
  }, [])

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
