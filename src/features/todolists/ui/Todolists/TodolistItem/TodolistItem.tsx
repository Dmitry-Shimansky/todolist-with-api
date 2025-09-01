import { FilterButtons } from "./FilterButtons/FilterButtons.tsx"
import { Tasks } from "./Tasks/Tasks.tsx"
import { TodolistTitle } from "./TodolistTitle/TodolistTitle.tsx"
import { CreateItemForm } from "@/common/components/CreateItemForm/CreateItemForm"
import { useCreateTaskMutation } from "@/features/todolists/api/tasksApi.ts"
import { DomainTodolist } from "@/features/todolists/lib/types"

type Props = {
  todolist: DomainTodolist
}

export const TodolistItem = ({ todolist }: Props) => {
  const [createTask] = useCreateTaskMutation()

  const createTaskHandler = (title: string) => {
    createTask({ todolistId: todolist.id, title })
  }

  return (
    <div>
      <TodolistTitle todolist={todolist} />
      <CreateItemForm onCreateItem={createTaskHandler} disabled={todolist.entityStatus === "loading"} />
      <Tasks todolist={todolist} />
      <FilterButtons todolist={todolist} />
    </div>
  )
}
