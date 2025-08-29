import { Todolist, todolistSchema } from "@/features/todolists/api/todolistsApi.types.ts"
import { _todolistApi } from "@/features/todolists/api/todolistApi.ts"
import { createAppSlice } from "@/common/utils"
import { changeStatusAC } from "@/app/model/app-slice.ts"
import { RequestStatus } from "@/common/types"
import { ResultCode } from "@/common/enums/index.ts"
import { handleServerError } from "@/common/utils/handleServerError.ts"
import { handleAppError } from "@/common/utils/handleAppError.ts"
import { clearDataAC } from "@/common/actions"

export const todolistsSlice = createAppSlice({
  name: "todolists",
  initialState: [] as DomainTodolist[],
  selectors: {
    selectTodolists: (state) => state,
  },
  extraReducers: (builder) => {
    builder.addCase(clearDataAC, () => {
      return []
    })
  },
  reducers: (create) => {
    return {
      // actions
      changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
        const todolist = state.find((todolist) => todolist.id === action.payload.id)
        if (todolist) {
          todolist.filter = action.payload.filter
        }
      }),
      changeTodolistEntityStatusAC: create.reducer<{ id: string; entityStatus: RequestStatus }>((state, action) => {
        const todolist = state.find((todolist) => todolist.id === action.payload.id)
        if (todolist) {
          todolist.entityStatus = action.payload.entityStatus
        }
      }),
      // thunks
      fetchTodolistTC: create.asyncThunk(
        async (_arg, thunkAPI) => {
          const { dispatch, rejectWithValue } = thunkAPI
          try {
            dispatch(changeStatusAC({ status: "loading" }))
            const res = await _todolistApi.getTodolist()
            todolistSchema.array().parse(res.data) // zod validation
            dispatch(changeStatusAC({ status: "succeeded" }))
            return { todolists: res.data }
          } catch (err) {
            handleServerError(err, dispatch)
            return rejectWithValue(err)
          }
        },
        {
          fulfilled: (_state, action) => {
            return action.payload?.todolists.map((tl) => {
              return { ...tl, filter: "all", entityStatus: "idle" }
            })
          },
        },
      ),
      createTodolist: create.asyncThunk(
        async (title: string, thunkAPI) => {
          const { dispatch, rejectWithValue } = thunkAPI
          try {
            dispatch(changeStatusAC({ status: "loading" }))
            const res = await _todolistApi.createTodolist(title)
            todolistSchema.parse(res.data.data.item) // zod validation
            if (res.data.resultCode === ResultCode.Success) {
              dispatch(changeStatusAC({ status: "succeeded" }))
              return { todolist: res.data.data.item }
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
            state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" })
          },
        },
      ),
      deleteTodolist: create.asyncThunk(
        async (arg: { id: string }, thunkAPI) => {
          const { dispatch, rejectWithValue } = thunkAPI
          try {
            dispatch(changeStatusAC({ status: "loading" }))
            dispatch(changeTodolistEntityStatusAC({ id: arg.id, entityStatus: "loading" }))
            const res = await _todolistApi.deleteTodolist(arg.id)
            if (res.data.resultCode === ResultCode.Success) {
              dispatch(changeStatusAC({ status: "succeeded" }))
              return arg
            } else {
              handleAppError(res.data, dispatch)
              return rejectWithValue(null)
            }
          } catch (err) {
            handleServerError(err, dispatch)
            dispatch(changeTodolistEntityStatusAC({ id: arg.id, entityStatus: "failed" }))
            return rejectWithValue(err)
          }
        },
        {
          fulfilled: (state, action) => {
            const index = state.findIndex((todolist) => todolist.id === action.payload.id)
            if (index !== -1) {
              state.splice(index, 1)
            }
          },
        },
      ),
      changeTodolistTitle: create.asyncThunk(
        async (arg: { id: string; title: string }, thunkAPI) => {
          const { dispatch, rejectWithValue } = thunkAPI
          try {
            dispatch(changeStatusAC({ status: "loading" }))
            const res = await _todolistApi.changeTodolistTitle(arg)
            if (res.data.resultCode === ResultCode.Success) {
              dispatch(changeStatusAC({ status: "succeeded" }))
              return arg
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
            const index = state.findIndex((todolist) => todolist.id === action.payload.id)
            if (index !== -1) {
              state[index].title = action.payload.title
            }
          },
        },
      ),
    }
  },
})

export const { selectTodolists } = todolistsSlice.selectors
export const todolistsReducer = todolistsSlice.reducer
export const {
  changeTodolistFilterAC,
  fetchTodolistTC,
  createTodolist,
  deleteTodolist,
  changeTodolistTitle,
  changeTodolistEntityStatusAC,
} = todolistsSlice.actions

export type DomainTodolist = Todolist & {
  filter: FilterValues
  entityStatus: RequestStatus
}

export type FilterValues = "all" | "active" | "completed"
