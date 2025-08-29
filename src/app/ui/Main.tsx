import { CreateItemForm } from "@/common/components/CreateItemForm/CreateItemForm.tsx"
import { Todolists } from "@/features/todolists/ui/Todolists/Todolists.tsx"
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid2"
import { Navigate } from "react-router"
import { Path } from "@/common/routing"
import { useAppSelector } from "@/common/hooks"
import { useCreateTodolistMutation } from "@/features/todolists/api/todolistApi.ts"
import { selectIsLoggedIn } from "@/app/model/app-slice.ts"

export const Main = () => {
  const [createTodolistMutation] = useCreateTodolistMutation()

  const isLoggedIn = useAppSelector(selectIsLoggedIn)

  const createTodolistHandler = (title: string) => {
    createTodolistMutation(title)
  }

  if (!isLoggedIn) {
    return <Navigate to={Path.Login} />
  }

  return (
    <Container maxWidth={"lg"}>
      <Grid container sx={{ mb: "30px" }}>
        <CreateItemForm onCreateItem={createTodolistHandler} />
      </Grid>
      <Grid container spacing={4}>
        <Todolists />
      </Grid>
    </Container>
  )
}
