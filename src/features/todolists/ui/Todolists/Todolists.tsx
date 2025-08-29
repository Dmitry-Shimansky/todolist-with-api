import { TodolistItem } from "./TodolistItem/TodolistItem.tsx"
import Grid from "@mui/material/Grid2"
import Paper from "@mui/material/Paper"
import { useGetTodolistsQuery } from "@/features/todolists/api/todolistApi.ts"

export const Todolists = () => {
  const { data } = useGetTodolistsQuery()

  return (
    <>
      {data?.map((todolist: any) => (
        <Grid key={todolist.id}>
          <Paper sx={{ p: "0 20px 20px 20px" }}>
            <TodolistItem todolist={todolist} />
          </Paper>
        </Grid>
      ))}
    </>
  )
}
