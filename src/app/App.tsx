import "./App.css"
import { Header } from "@/common/components/Header/Header"
import { useAppSelector } from "@/common/hooks/useAppSelector"
import { getTheme } from "@/common/theme/theme"
import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
import { selectThemeMode } from "./app-slice.ts"
import { ErrorSnackBar } from "@/common/components"
import { Routing } from "@/common/routing/Routing.tsx"

export const App = () => {
  const themeMode = useAppSelector(selectThemeMode)

  const theme = getTheme(themeMode)

  return (
    <ThemeProvider theme={theme}>
      <div className={"app"}>
        <CssBaseline />
        <Header />
        <Routing />
        <ErrorSnackBar />
      </div>
    </ThemeProvider>
  )
}
