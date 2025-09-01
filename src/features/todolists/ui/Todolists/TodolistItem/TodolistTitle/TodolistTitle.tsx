import { EditableSpan } from "@/common/components/EditableSpan/EditableSpan"
import DeleteIcon from "@mui/icons-material/Delete"
import IconButton from "@mui/material/IconButton"
import styles from "./TodolistTitle.module.css"
import {
  todolistApi,
  useChangeTodolistTitleMutation,
  useDeleteTodolistMutation,
} from "@/features/todolists/api/todolistApi.ts"
import { useAppDispatch } from "@/common/hooks"
import { RequestStatus } from "@/common/types"
import { DomainTodolist } from "@/features/todolists/lib/types"

type Props = {
  todolist: DomainTodolist
}

export const TodolistTitle = ({ todolist }: Props) => {
  const { id, title, entityStatus } = todolist

  const [deleteTodolistMutation] = useDeleteTodolistMutation()
  const [changeTodolistTitleMutation] = useChangeTodolistTitleMutation()

  const dispatch = useAppDispatch()

  const changeTodolistStatus = (entityStatus: RequestStatus) => {
    dispatch(
      todolistApi.util.updateQueryData("getTodolists", undefined, (state) => {
        const todolist = state.find((todolist) => todolist.id === id)
        if (todolist) {
          todolist.entityStatus = entityStatus
        }
      }),
    )
  }

  const deleteTodolistHandler = () => {
    changeTodolistStatus("loading")
    deleteTodolistMutation(id)
      .unwrap()
      .catch(() => changeTodolistStatus("failed"))
  }

  const changeTodolistTitleHandler = (title: string) => {
    changeTodolistTitleMutation({ id, title })
  }

  return (
    <div className={styles.container}>
      <h3>
        <EditableSpan value={title} onChange={changeTodolistTitleHandler} disabled={entityStatus === "loading"} />
      </h3>
      <IconButton onClick={deleteTodolistHandler} disabled={entityStatus === "loading"}>
        <DeleteIcon />
      </IconButton>
    </div>
  )
}
