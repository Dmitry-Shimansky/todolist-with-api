import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { Todolist } from "@/features/todolists/api/todolistsApi.types.ts"
import { todolistApi } from "@/features/todolists/api/todolistApi.ts"

export const todolistsSlice = createSlice({
  name: "todolists",
  initialState: [] as DomainTodolist[],
  reducers: (create) => {
    return {
      deleteTodolistAC: create.reducer<{ id: string }>((state, action) => {
        const index = state.findIndex((todolist) => todolist.id === action.payload.id)
        if (index !== -1) {
          state.splice(index, 1)
        }
      }),
      changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
        const todolist = state.find((todolist) => todolist.id === action.payload.id)
        if (todolist) {
          todolist.filter = action.payload.filter
        }
      }),
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodolistTC.fulfilled, (_state, action) => {
        return action.payload.todolists.map((tl) => {
          return { ...tl, filter: "all" }
        })
      })
      .addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
        const index = state.findIndex((todolist) => todolist.id === action.payload.id)
        if (index !== -1) {
          state[index].title = action.payload.title
        }
      })
      .addCase(createTodolistTC.fulfilled, (state, action) => {
        state.push({ ...action.payload, filter: "all" })
      })
      .addCase(deleteTodolistTC.fulfilled, (state, action) => {
        const index = state.findIndex((todolist) => todolist.id === action.payload.id)
        if (index !== -1) {
          state.splice(index, 1)
        }
      })
  },
})

export const fetchTodolistTC = createAsyncThunk(`${todolistsSlice.name}/fetchTodolist`, async (_arg, thunkAPI) => {
  const { rejectWithValue } = thunkAPI
  try {
    const res = await todolistApi.getTodolist()
    return { todolists: res.data }
  } catch (err) {
    return rejectWithValue(err)
  }
})

export const changeTodolistTitleTC = createAsyncThunk(
  `${todolistsSlice.name}/changeTodolistTitleTC`,
  async (arg: { id: string; title: string }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI
    try {
      await todolistApi.changeTodolistTitle(arg)
      return arg
    } catch (err) {
      return rejectWithValue(err)
    }
  },
)

export const createTodolistTC = createAsyncThunk(
  `${todolistsSlice.name}/createTodolistAC`,
  async (title: string, thunkAPI) => {
    const { rejectWithValue } = thunkAPI
    try {
      const res = await todolistApi.createTodolist(title)
      return res.data.data.item
    } catch (err) {
      return rejectWithValue(err)
    }
  },
)

export const deleteTodolistTC = createAsyncThunk(
  `${todolistsSlice.name}/deleteTodolistTC`,
  async (arg: { id: string }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI
    try {
      await todolistApi.deleteTodolist(arg.id)
      return arg
    } catch (err) {
      return rejectWithValue(err)
    }
  },
)

export const todolistsReducer = todolistsSlice.reducer
export const { changeTodolistFilterAC } = todolistsSlice.actions

export type DomainTodolist = Todolist & {
  filter: FilterValues
}

export type FilterValues = "all" | "active" | "completed"
