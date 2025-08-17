import { Link } from "react-router"
import styles from "./PageNotFound.module.css"
import Button from "@mui/material/Button"

import Box from "@mui/material/Box"

export const PageNotFound = () => (
  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
    <h1 className={styles.title}>404</h1>
    <h2 className={styles.subtitle}>page not found</h2>
    <Button component={Link} to="/" variant={"contained"} color={"primary"} sx={{ p: 2, mt: 2 }}>
      Вернуться на главную
    </Button>
  </Box>
)
