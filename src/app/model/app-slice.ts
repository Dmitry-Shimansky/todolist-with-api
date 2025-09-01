import { createSlice, isFulfilled, isPending, isRejected } from "@reduxjs/toolkit"
import { RequestStatus } from "@/common/types"
import { tasksApi } from "@/features/todolists/api/tasksApi.ts"
import { todolistApi } from "@/features/todolists/api/todolistApi.ts"

export const appSlice = createSlice({
  name: "app",
  initialState: {
    themeMode: "dark" as ThemeMode,
    status: "idle" as RequestStatus,
    error: null as string | null,
    isLoggedIn: false,
  },
  selectors: {
    selectThemeMode: (state) => state.themeMode,
    selectStatus: (state) => state.status,
    selectError: (state) => state.error,
    selectIsLoggedIn: (state) => state.isLoggedIn,
  },
  reducers: (create) => {
    return {
      // action creators and reducer
      setIsLoggedIn: create.reducer<{ isLoggedIn: boolean }>((state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn
      }),
      changeThemeModeAC: create.reducer<{ themeMode: ThemeMode }>((state, action) => {
        state.themeMode = action.payload.themeMode
      }),
      changeStatusAC: create.reducer<{ status: RequestStatus }>((state, action) => {
        state.status = action.payload.status
      }),
      setAppErrorAC: create.reducer<{ error: string | null }>((state, action) => {
        state.error = action.payload.error
      }),
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        // (action) => {
        //   return action.type.endsWith("/pending")
        // },
        isPending,
        (state, action) => {
          if (
            todolistApi.endpoints.getTodolists.matchPending(action) ||
            tasksApi.endpoints.getTasks.matchPending(action)
          ) {
            return
          }
          state.status = "loading"
        },
      )
      .addMatcher(isFulfilled, (state) => {
        state.status = "succeeded"
      })
      .addMatcher(isRejected, (state) => {
        state.status = "failed"
      })
  },
})

export const appReducer = appSlice.reducer
export const { changeThemeModeAC, changeStatusAC, setAppErrorAC, setIsLoggedIn } = appSlice.actions
export const { selectThemeMode, selectStatus, selectError, selectIsLoggedIn } = appSlice.selectors

export type ThemeMode = "dark" | "light"
