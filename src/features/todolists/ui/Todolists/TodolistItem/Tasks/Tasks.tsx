import { TaskItem } from "./TaskItem/TaskItem.tsx"
import List from "@mui/material/List"
import { TaskStatus } from "@/common/enums/enums.ts"
import { useGetTasksQuery } from "@/features/todolists/api/tasksApi.ts"
import { TasksSkeleton } from "@/features/todolists/ui/Todolists/TodolistItem/Tasks/TasksSkeleton/TasksSkeleton.tsx"
import { DomainTodolist } from "@/features/todolists/lib/types"

type Props = {
  todolist: DomainTodolist
}

export const Tasks = ({ todolist }: Props) => {
  const { id, filter, entityStatus } = todolist

  const { data, isLoading } = useGetTasksQuery(id)

  // useEffect(() => {
  //   if (error) {
  //     if ("status" in error) {
  //       const errMsg = "error" in error ? error.error : JSON.stringify(error.data)
  //       dispatch(setAppErrorAC({ error: errMsg }))
  //     } else {
  //       dispatch(setAppErrorAC({ error: error.message || "Some error Occurred" }))
  //     }
  //   }
  // }, [error])

  let filteredTasks = data?.items
  if (filter === "active") {
    filteredTasks = filteredTasks?.filter((task) => task.status === TaskStatus.New)
  }
  if (filter === "completed") {
    filteredTasks = filteredTasks?.filter((task) => task.status === TaskStatus.Completed)
  }

  if (isLoading) {
    return <TasksSkeleton />
  }

  return (
    <>
      {filteredTasks?.length === 0 ? (
        <p>Тасок нет</p>
      ) : (
        <List>
          {filteredTasks?.map((task) => (
            <TaskItem key={task.id} task={task} todolistId={id} disabled={entityStatus === "loading"} />
          ))}
        </List>
      )}
    </>
  )
}
