import { Todolist } from "@/features/todolists/api/todolistsApi.types.ts"
import { todolistApi } from "@/features/todolists/api/todolistApi.ts"
import { createAppSlice } from "@/common/utils"
import { changeStatusAC } from "@/app/app-slice.ts"

export const todolistsSlice = createAppSlice({
  name: "todolists",
  initialState: [] as DomainTodolist[],
  selectors: {
    selectTodolists: (state) => state,
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
      // thunks
      fetchTodolistTC: create.asyncThunk(
        async (_arg, thunkAPI) => {
          const { dispatch, rejectWithValue } = thunkAPI
          try {
            dispatch(changeStatusAC({ status: "loading" }))
            await new Promise((resolve) => setTimeout(resolve, 2000))
            const res = await todolistApi.getTodolist()
            dispatch(changeStatusAC({ status: "succeeded" }))
            return { todolists: res.data }
          } catch (err) {
            dispatch(changeStatusAC({ status: "failed" }))
            return rejectWithValue(err)
          }
        },
        {
          fulfilled: (_state, action) => {
            return action.payload?.todolists.map((tl) => {
              return { ...tl, filter: "all" }
            })
          },
        },
      ),
      createTodolist: create.asyncThunk(
        async (title: string, thunkAPI) => {
          const { dispatch, rejectWithValue } = thunkAPI
          try {
            dispatch(changeStatusAC({ status: "loading" }))
            const res = await todolistApi.createTodolist(title)
            dispatch(changeStatusAC({ status: "succeeded" }))
            return res.data.data.item
          } catch (err) {
            dispatch(changeStatusAC({ status: "failed" }))
            return rejectWithValue(err)
          }
        },
        {
          fulfilled: (state, action) => {
            state.push({ ...action.payload, filter: "all" })
          },
        },
      ),
      deleteTodolist: create.asyncThunk(
        async (arg: { id: string }, thunkAPI) => {
          const { dispatch, rejectWithValue } = thunkAPI
          try {
            dispatch(changeStatusAC({ status: "loading" }))
            await todolistApi.deleteTodolist(arg.id)
            dispatch(changeStatusAC({ status: "succeeded" }))
            return arg
          } catch (err) {
            dispatch(changeStatusAC({ status: "failed" }))
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
            await todolistApi.changeTodolistTitle(arg)
            dispatch(changeStatusAC({ status: "succeeded" }))
            return arg
          } catch (err) {
            dispatch(changeStatusAC({ status: "failed" }))
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
export const { changeTodolistFilterAC, fetchTodolistTC, createTodolist, deleteTodolist, changeTodolistTitle } =
  todolistsSlice.actions

export type DomainTodolist = Todolist & {
  filter: FilterValues
}

export type FilterValues = "all" | "active" | "completed"
