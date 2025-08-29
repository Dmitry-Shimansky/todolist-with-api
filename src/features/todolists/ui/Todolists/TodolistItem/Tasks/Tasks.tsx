import { TaskItem } from "./TaskItem/TaskItem.tsx"
import List from "@mui/material/List"
import { DomainTodolist } from "@/features/todolists/model/todolists-slice.ts"
import { TaskStatus } from "@/common/enums/enums.ts"
import { useGetTasksQuery } from "@/features/todolists/api/tasksApi.ts"

type Props = {
  todolist: DomainTodolist
}

export const Tasks = ({ todolist }: Props) => {
  const { id, filter, entityStatus } = todolist

  const { data } = useGetTasksQuery(id)

  let filteredTasks = data?.items
  if (filter === "active") {
    filteredTasks = filteredTasks?.filter((task) => task.status === TaskStatus.New)
  }
  if (filter === "completed") {
    filteredTasks = filteredTasks?.filter((task) => task.status === TaskStatus.Completed)
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
