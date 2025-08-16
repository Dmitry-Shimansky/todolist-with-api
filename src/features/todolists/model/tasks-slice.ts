import { createTodolist, deleteTodolist } from "./todolists-slice.ts"
import { createAppSlice } from "@/common/utils"
import { tasksApi } from "@/features/todolists/api/tasksApi.ts"
import { DomainTask, domainTaskSchema, UpdateTaskModel } from "@/features/todolists/api/tasksApi.types.ts"
import { changeStatusAC } from "@/app/app-slice.ts"
import { RootState } from "@/app/store.ts"
import { ResultCode } from "@/common/enums"
import { handleServerError } from "@/common/utils/handleServerError.ts"
import { handleAppError } from "@/common/utils/handleAppError.ts"

export const tasksSlice = createAppSlice({
  name: "tasks",
  initialState: {} as TasksState,
  selectors: {
    selectTasks: (state) => state,
  },
  reducers: (create) => ({
    // thunks
    fetchTasks: create.asyncThunk(
      async (todolistId: string, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI
        try {
          dispatch(changeStatusAC({ status: "loading" }))
          const res = await tasksApi.getTasks(todolistId)
          domainTaskSchema.array().parse(res.data.items) // zod validation
          dispatch(changeStatusAC({ status: "succeeded" }))
          return { tasks: res.data.items, todolistId }
        } catch (err) {
          handleServerError(err, dispatch)
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
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(changeStatusAC({ status: "succeeded" }))
            return { task: res.data.data.item }
          } else {
            handleAppError(res.data, dispatch)
            return rejectWithValue(null)
          }
        } catch (err: any) {
          handleServerError(err, dispatch)
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
      async (args: { todolistId: string; taskId: string }, { dispatch, rejectWithValue }) => {
        try {
          const res = await tasksApi.deleteTask(args)
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(changeStatusAC({ status: "succeeded" }))
            return args
          } else {
            handleAppError(res.data, dispatch)
            return rejectWithValue(null)
          }
        } catch (err) {
          handleServerError(err, dispatch)
          return rejectWithValue(err)
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
    updateTask: create.asyncThunk(
      async (
        payload: { todolistId: string; taskId: string; domainModel: Partial<UpdateTaskModel> },
        { dispatch, getState, rejectWithValue },
      ) => {
        const { todolistId, taskId, domainModel } = payload

        const allTodolistTasks = (getState() as RootState).tasks[todolistId]
        const task = allTodolistTasks.find((task) => task.id === taskId)

        if (!task) {
          return rejectWithValue(null)
        }

        const model: UpdateTaskModel = {
          description: task.description,
          title: task.title,
          priority: task.priority,
          startDate: task.startDate,
          deadline: task.deadline,
          status: task.status,
          ...domainModel,
        }

        try {
          dispatch(changeStatusAC({ status: "loading" }))
          const res = await tasksApi.updateTask({ todolistId, taskId, model })
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(changeStatusAC({ status: "succeeded" }))
            return { task: res.data.data.item }
          } else {
            handleAppError(res.data, dispatch)
            return rejectWithValue(null)
          }
        } catch (err) {
          handleServerError(err, dispatch)
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const allTodolistTasks = state[action.payload.task.todoListId]
          const taskIndex = allTodolistTasks.findIndex((task) => task.id === action.payload.task.id)
          if (taskIndex !== -1) {
            allTodolistTasks[taskIndex] = action.payload.task
          }
        },
      },
    ),
  }),
  extraReducers: (builder) => {
    builder
      .addCase(createTodolist.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(deleteTodolist.fulfilled, (state, action) => {
        delete state[action.payload.id]
      })
  },
})

export const { selectTasks } = tasksSlice.selectors
export const { fetchTasks, createTask, deleteTask, updateTask } = tasksSlice.actions
export const tasksReducer = tasksSlice.reducer

export type TasksState = Record<string, DomainTask[]>
