import { createAppSlice } from "@/common/utils"
import { LoginInputs } from "@/features/auth/lib/schemas/loginSchema.ts"
import { handleServerError } from "@/common/utils/handleServerError.ts"
import { changeStatusAC } from "@/app/app-slice.ts"
import { authApi } from "@/features/auth/api/authApi.ts"
import { ResultCode } from "@/common/enums"
import { handleAppError } from "@/common/utils/handleAppError.ts"
import { AUTH_TOKEN } from "@/common/с constants"
import { clearDataAC } from "@/common/actions"

export const authSlice = createAppSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  selectors: {
    selectIsLoggedIn: (state) => state.isLoggedIn,
  },
  reducers: (create) => ({
    loginTC: create.asyncThunk(
      async (data: LoginInputs, { dispatch, rejectWithValue }) => {
        try {
          dispatch(changeStatusAC({ status: "loading" }))
          const res = await authApi.login(data)
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(changeStatusAC({ status: "succeeded" }))
            localStorage.setItem(AUTH_TOKEN, res.data.data.token)
            return { isLoggedIn: true }
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
          state.isLoggedIn = action.payload.isLoggedIn
        },
      },
    ),
    logoutTC: create.asyncThunk(
      async (_arg, { dispatch, rejectWithValue }) => {
        try {
          dispatch(changeStatusAC({ status: "loading" }))
          const res = await authApi.logout()
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(changeStatusAC({ status: "succeeded" }))
            dispatch(clearDataAC())
            localStorage.removeItem(AUTH_TOKEN)
            return { isLoggedIn: false }
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
          state.isLoggedIn = action.payload.isLoggedIn
        },
      },
    ),
    meTC: create.asyncThunk(
      async (_arg, { dispatch, rejectWithValue }) => {
        try {
          dispatch(changeStatusAC({ status: "loading" }))
          const res = await authApi.me()
          await new Promise((resolve) => setTimeout(resolve, 2000))
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(changeStatusAC({ status: "succeeded" }))
            return { isLoggedIn: true }
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
          state.isLoggedIn = action.payload.isLoggedIn
        },
      },
    ),
  }),
})

export const { loginTC, logoutTC, meTC } = authSlice.actions
export const { selectIsLoggedIn } = authSlice.selectors
export const authReducer = authSlice.reducer
