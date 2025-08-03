import { type ChangeEvent, type CSSProperties, useEffect, useState } from "react"
import Checkbox from "@mui/material/Checkbox"
import { CreateItemForm, EditableSpan } from "@/common/components"
import { Todolist } from "../features/todolists/api/todolistsApi.types.ts"
import { todolistApi } from "../features/todolists/api/todolistApi.ts"
import { tasksApi } from "@/features/todolists/api/tasksApi.ts"
import { DomainTask, TaskStatus, UpdateTaskModel } from "@/features/todolists/api/tasksApi.types.ts"

export const AppHttpRequests = () => {
  const [todolists, setTodolists] = useState<Todolist[]>([])
  const [tasks, setTasks] = useState<Record<string, DomainTask[]>>({})

  useEffect(() => {
    todolistApi.getTodolist().then((res) => {
      const todolists = res.data
      setTodolists(todolists)
      todolists.forEach((todolist) => {
        tasksApi.getTasks(todolist.id).then((res) => {
          setTasks((prevTasks) => ({
            ...prevTasks,
            [todolist.id]: res.data.items,
          }))
        })
      })
    })
  }, [])

  const createTodolist = (title: string) => {
    todolistApi.createTodolist(title).then((res) => {
      const todolist = res.data.data.item
      setTodolists([todolist, ...todolists])
    })
  }

  const deleteTodolist = (id: string) => {
    todolistApi.deleteTodolist(id).then(() => {
      setTodolists(todolists.filter((todolist) => todolist.id !== id))
    })
  }

  const changeTodolistTitle = (id: string, title: string) => {
    todolistApi.changeTodolistTitle({ id, title }).then(() => {
      setTodolists(todolists.map((todolist) => (todolist.id === id ? { ...todolist, title } : todolist)))
    })
  }

  const createTask = (todolistId: string, title: string) => {
    tasksApi.createTask({ todolistId, title }).then((res) => {
      const newTask = res.data.data.item
      // setTasks({ ...tasks, [todolistId]: [newTask, ...tasks[todolistId]] })
      setTasks((prevTasks) => ({
        ...prevTasks,
        [todolistId]: [newTask, ...(prevTasks[todolistId] || [])],
      }))
    })
  }

  const deleteTask = (todolistId: string, taskId: string) => {
    tasksApi.deleteTask({ todolistId, taskId }).then(() => {
      setTasks({ ...tasks, [todolistId]: tasks[todolistId].filter((task) => task.id !== taskId) })
    })
  }

  const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>, task: DomainTask) => {
    const todolistId = task.todoListId

    const model: UpdateTaskModel = {
      title: task.title,
      priority: task.priority,
      description: task.description,
      startDate: task.startDate,
      deadline: task.deadline,
      status: e.target.checked ? TaskStatus.Completed : TaskStatus.New,
    }

    tasksApi.changeTaskStatus({ todolistId, taskId: task.id, model }).then((res) => {
      setTasks({
        ...tasks,
        [todolistId]: tasks[todolistId].map((el) => (el.id === task.id ? res.data.data.item : el)),
      })
    })
  }

  const changeTaskTitle = (task: DomainTask, title: string) => {
    const todolistId = task.todoListId

    const model: UpdateTaskModel = {
      title: title,
      priority: task.priority,
      description: task.description,
      startDate: task.startDate,
      deadline: task.deadline,
      status: task.status,
    }

    tasksApi.changeTaskTitle({ todolistId, taskId: task.id, model }).then((res) => {
      setTasks({
        ...tasks,
        [todolistId]: tasks[todolistId].map((el) => (el.id === task.id ? res.data.data.item : el)),
      })
    })
  }

  return (
    <div style={{ margin: "20px" }}>
      <CreateItemForm onCreateItem={createTodolist} />
      {todolists.map((todolist) => (
        <div key={todolist.id} style={container}>
          <div>
            <EditableSpan value={todolist.title} onChange={(title) => changeTodolistTitle(todolist.id, title)} />
            <button onClick={() => deleteTodolist(todolist.id)}>x</button>
          </div>
          <CreateItemForm onCreateItem={(title) => createTask(todolist.id, title)} />
          {tasks[todolist.id]?.map((task) => (
            <div key={task.id}>
              <Checkbox checked={task.status === TaskStatus.Completed} onChange={(e) => changeTaskStatus(e, task)} />
              <EditableSpan value={task.title} onChange={(title) => changeTaskTitle(task, title)} />
              <button onClick={() => deleteTask(todolist.id, task.id)}>x</button>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

const container: CSSProperties = {
  border: "1px solid black",
  margin: "20px 0",
  padding: "10px",
  width: "300px",
  display: "flex",
  justifyContent: "space-between",
  flexDirection: "column",
}
