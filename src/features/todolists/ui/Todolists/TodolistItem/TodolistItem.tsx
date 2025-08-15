import { useAppDispatch } from "@/common/hooks/useAppDispatch"
import { FilterButtons } from "./FilterButtons/FilterButtons.tsx"
import { createTask } from "@/features/todolists/model/tasks-slice.ts"
import { Tasks } from "./Tasks/Tasks.tsx"
import { TodolistTitle } from "./TodolistTitle/TodolistTitle.tsx"
import { CreateItemForm } from "@/common/components/CreateItemForm/CreateItemForm"
import { DomainTodolist } from "@/features/todolists/model/todolists-slice.ts"

type Props = {
  todolist: DomainTodolist
}

export const TodolistItem = ({ todolist }: Props) => {
  const dispatch = useAppDispatch()

  const createTaskHandler = (title: string) => {
    dispatch(createTask({ todolistId: todolist.id, title }))
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
