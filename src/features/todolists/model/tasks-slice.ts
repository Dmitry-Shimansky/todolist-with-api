import { createTodolist, deleteTodolist } from "./todolists-slice.ts"
import { createAppSlice } from "@/common/utils"
import { tasksApi } from "@/features/todolists/api/tasksApi.ts"
import { DomainTask, UpdateTaskModel } from "@/features/todolists/api/tasksApi.types.ts"
import { changeStatusAC } from "@/app/app-slice.ts"

export const tasksSlice = createAppSlice({
  name: "tasks",
  initialState: {} as TasksState,
  selectors: {
    selectTasks: (state) => state,
  },
  reducers: (create) => ({
    // actions
    changeTaskTitleAC: create.reducer<{ todolistId: string; taskId: string; title: string }>((state, action) => {
      const task = state[action.payload.todolistId].find((task) => task.id === action.payload.taskId)
      if (task) {
        task.title = action.payload.title
      }
    }),
    // thunks
    fetchTasks: create.asyncThunk(
      async (todolistId: string, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI
        try {
          dispatch(changeStatusAC({ status: "loading" }))
          const res = await tasksApi.getTasks(todolistId)
          dispatch(changeStatusAC({ status: "succeeded" }))
          return { tasks: res.data.items, todolistId }
        } catch (err) {
          dispatch(changeStatusAC({ status: "failed" }))
          return rejectWithValue(err)
        }
      },
      {
        fulfilled: (state, action) => {
          state[action.payload.todolistId] = action.payload.tasks
        },
      },
    ),
    createTask: create.asyncThunk(
      async (args: { todolistId: string; title: string }, { dispatch, rejectWithValue }) => {
        try {
          dispatch(changeStatusAC({ status: "loading" }))
          const res = await tasksApi.createTask(args)
          dispatch(changeStatusAC({ status: "succeeded" }))
          return { task: res.data.data.item }
        } catch (err) {
          dispatch(changeStatusAC({ status: "failed" }))
          return rejectWithValue(err)
        }
      },
      {
        fulfilled: (state, action) => {
          state[action.payload.task.todoListId].unshift(action.payload.task)
        },
      },
    ),
    deleteTask: create.asyncThunk(
      async (args: { todolistId: string; taskId: string }, thunkAPI) => {
        try {
          await tasksApi.deleteTask(args)
          return args
        } catch (err) {
          return thunkAPI.rejectWithValue(err)
        }
      },
      {
        fulfilled: (state, action) => {
          const tasks = state[action.payload.todolistId]
          const index = tasks.findIndex((task) => task.id === action.payload.taskId)
          if (index !== -1) {
            tasks.splice(index, 1)
          }
        },
      },
    ),
    changeTaskStatus: create.asyncThunk(
      async (task: DomainTask, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI
        try {
          const model: UpdateTaskModel = {
            status: task.status,
            title: task.title,
            priority: task.priority,
            description: task.description,
            startDate: task.startDate,
            deadline: task.deadline,
          }
          dispatch(changeStatusAC({ status: "loading" }))
          const res = await tasksApi.changeTaskStatus({ todolistId: task.todoListId, taskId: task.id, model })
          dispatch(changeStatusAC({ status: "succeeded" }))
          return { task: res.data.data.item }
        } catch (err) {
          dispatch(changeStatusAC({ status: "failed" }))
          return rejectWithValue(err)
        }
      },
      {
        fulfilled: (state, action) => {
          const task = state[action.payload.task.todoListId].find((task) => task.id === action.payload.task.id)
          if (task) {
            task.status = action.payload.task.status
          }
        },
      },
    ),
  }),
  extraReducers: (builder) => {
    builder
      .addCase(createTodolist.fulfilled, (state, action) => {
        state[action.payload.id] = []
      })
      .addCase(deleteTodolist.fulfilled, (state, action) => {
        delete state[action.payload.id]
      })
  },
})

export const { selectTasks } = tasksSlice.selectors
export const { changeTaskTitleAC, fetchTasks, createTask, deleteTask, changeTaskStatus } = tasksSlice.actions
export const tasksReducer = tasksSlice.reducer

export type TasksState = Record<string, DomainTask[]>
