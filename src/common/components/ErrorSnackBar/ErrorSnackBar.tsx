import { type SyntheticEvent } from "react"
import Alert from "@mui/material/Alert"
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { selectError, setAppErrorAC } from "@/app/app-slice.ts"

export const ErrorSnackBar = () => {
  const error = useAppSelector(selectError)
  const dispatch = useAppDispatch()

  const handleClose = (_: SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === "clickaway") return
    dispatch(setAppErrorAC({ error: null }))
  }

  return (
    <Snackbar open={!!error} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="error" variant="filled" sx={{ width: "100%" }}>
        {error}
      </Alert>
    </Snackbar>
  )
}
