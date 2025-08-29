import { EditableSpan } from "@/common/components/EditableSpan/EditableSpan"
import DeleteIcon from "@mui/icons-material/Delete"
import Checkbox from "@mui/material/Checkbox"
import IconButton from "@mui/material/IconButton"
import ListItem from "@mui/material/ListItem"
import type { ChangeEvent } from "react"
import { getListItemSx } from "./TaskItem.styles.ts"
import { DomainTask, domainTaskSchema } from "@/features/todolists/api/tasksApi.types.ts"
import { ResultCode, TaskStatus } from "@/common/enums/enums.ts"
import { useDeleteTaskMutation, useUpdateTaskMutation } from "@/features/todolists/api/tasksApi.ts"
import { setIsLoggedIn } from "@/app/model/app-slice.ts"
import { useAppDispatch } from "@/common/hooks"
import { createTaskModel } from "@/features/todolists/lib/utils"

type Props = {
  task: DomainTask
  todolistId: string
  disabled?: boolean
}

export const TaskItem = ({ task, todolistId, disabled }: Props) => {
  const dispatch = useAppDispatch()
  const [updateTask] = useUpdateTaskMutation()
  const [deleteTask] = useDeleteTaskMutation()

  const deleteTaskHandler = () => {
    deleteTask({ todolistId, taskId: task.id })
  }

  const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
    const newStatusValue = e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New
    const model = createTaskModel(task, { status: newStatusValue })
    updateTask({ todolistId, taskId: task.id, model }).then((res) => {
      domainTaskSchema.parse(res.data?.data.item) // zod validation
      if (res.data?.resultCode === ResultCode.Success) {
        dispatch(setIsLoggedIn({ isLoggedIn: true }))
      }
    })
  }

  const changeTaskTitle = (title: string) => {
    const model = createTaskModel(task, { title })
    updateTask({ todolistId, taskId: task.id, model }).then((res) => {
      domainTaskSchema.parse(res.data?.data.item) // zod validation
      if (res.data?.resultCode === ResultCode.Success) {
        dispatch(setIsLoggedIn({ isLoggedIn: true }))
      }
    })
  }

  const isDone = task.status === TaskStatus.Completed

  return (
    <ListItem sx={getListItemSx(isDone)}>
      <div>
        <Checkbox checked={isDone} onChange={changeTaskStatus} disabled={disabled} />
        <EditableSpan value={task.title} onChange={changeTaskTitle} disabled={disabled} />
      </div>
      <IconButton onClick={deleteTaskHandler} disabled={disabled}>
        <DeleteIcon />
      </IconButton>
    </ListItem>
  )
}
